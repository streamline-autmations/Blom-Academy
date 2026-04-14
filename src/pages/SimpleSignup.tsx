import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { showImportantError, showImportantSuccess, showError, showSuccess } from '@/utils/toast';

export default function SimpleSignup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingConfirmationEmail, setPendingConfirmationEmail] = useState<string | null>(null);

  // Get invite token from URL if present
  const inviteToken = searchParams.get('invite');

  const getEmailRedirectTo = () => {
    const origin = window.location.origin;
    if (inviteToken) return `${origin}/accept-invite?invite=${inviteToken}`;
    return `${origin}/login`;
  };

  const handleResendConfirmation = async () => {
    if (!pendingConfirmationEmail) return;
    setResendLoading(true);
    setError(null);
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: pendingConfirmationEmail,
        options: {
          emailRedirectTo: getEmailRedirectTo(),
        },
      });

      if (resendError) {
        const message = resendError.message ?? 'Could not resend confirmation email.';
        setError(message);
        showImportantError(message);
        return;
      }

      showImportantSuccess('Confirmation email sent again. Please check your inbox and spam/junk folder.');
    } catch (err: any) {
      const message = err?.message ?? 'Could not resend confirmation email.';
      setError(message);
      showImportantError(message);
    } finally {
      setResendLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const phone = formData.get('phone') as string;

    try {
      console.log('🚀 Starting simple signup process...', { hasInviteToken: !!inviteToken });

      // Auto-generate username from email
      const username = email.split('@')[0];
      console.log('📝 Generated username from email:', username);

      // Sign up the user
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: getEmailRedirectTo(),
          data: {
            first_name: firstName,
            last_name: lastName,
            username: username,
            phone: phone
          }
        }
      });

      if (signupError) {
        const message = signupError.message ?? 'Signup failed';
        const status = (signupError as any)?.status;
        const isRateLimit = status === 429 || /too many requests|after \d+ seconds/i.test(message);

        if (isRateLimit) {
          const rateLimitMessage = inviteToken
            ? 'Please wait a few seconds and try again. If you already received a confirmation email, confirm it, then open the invite link again.'
            : 'Please wait a few seconds and try again. If you already received a confirmation email, confirm it first.';
          setError(rateLimitMessage);
          showError(rateLimitMessage);
          return;
        }

        throw new Error(`Signup failed: ${message}`);
      }

      console.log('✅ Signup completed');

      const createdUser = signupData?.user;
      const createdSession = signupData?.session;

      if (!createdUser) {
        throw new Error('Signup completed but no user was returned');
      }

      if (!createdSession) {
        const confirmationMessage = inviteToken
          ? 'Account created! Please check your email to confirm your account, then open the invite link again to get course access.'
          : 'Account created! Please check your email to confirm your account.';
        setPendingConfirmationEmail(email);
        showImportantSuccess(confirmationMessage);
        return;
      }

      const user = createdUser;
      console.log('👤 User found:', user.id);

      // Skip all triggers and webhooks - do everything manually
      console.log('🔄 Creating profile and enrollment manually (bypassing all triggers)...');

      // Create profile manually with username
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          first_name: firstName,
          last_name: lastName,
          username: username,
          phone: phone,
          role: 'student'
        });

      if (profileError) {
        console.error('❌ Profile creation failed:', profileError);
        // Don't throw error - just log it and continue
        console.log('⚠️ Profile creation failed, but continuing...');
      } else {
        console.log('✅ Profile created successfully with username:', username);
      }

      // If there's an invite token, redeem it and redirect to course
      if (inviteToken) {
        console.log('🎫 Processing invite token after signup:', inviteToken);

        try {
          const { data: inviteData, error: inviteError } = await supabase.rpc('claim_course_invite', {
            p_token: inviteToken,
            p_user_id: user.id
          });

          if (inviteError) {
            console.error('❌ Failed to redeem invite:', inviteError);
            showError('Account created, but failed to redeem invite. Please try the invite link again.');
            navigate('/home');
            return;
          }

          if (inviteData && inviteData.course_id) {
            if (inviteData.course_slug) {
              console.log('✅ Invite redeemed successfully, redirecting to course:', inviteData.course_slug);
              showSuccess('Account created and course access granted!');
              navigate(`/course/${inviteData.course_slug}`);
              return;
            }

            console.error('❌ Invite redeemed but missing course_slug:', inviteData);
            showError('Account created and invite redeemed, but the course link could not be resolved.');
            navigate('/home');
            return;
          }
        } catch (inviteErr) {
          console.error('❌ Unexpected error redeeming invite:', inviteErr);
          showError('Account created, but failed to redeem invite.');
        }
      }

      // Redirect to home
      navigate('/home');
      showSuccess('Account created successfully!');

    } catch (err: any) {
      console.error('❌ Signup error:', err);
      setError(err.message);
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bloom flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>
            Sign up for BLOM Academy and get access to our courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingConfirmationEmail ? (
            <div className="space-y-4">
              <Alert>
                <AlertDescription className="text-base leading-relaxed">
                  <div className="font-semibold text-lg">Confirm your email to finish setup</div>
                  <div className="mt-2">
                    We created your account for <span className="font-medium">{pendingConfirmationEmail}</span>.
                    Please click the confirmation link in your email.
                  </div>
                  {inviteToken ? (
                    <div className="mt-2">
                      After confirming, come back to your invite link to unlock your course.
                    </div>
                  ) : null}
                  <div className="mt-2">
                    If you don’t see it, check spam/junk, then use “Resend confirmation email”.
                  </div>
                </AlertDescription>
              </Alert>

              {error ? (
                <Alert variant="destructive">
                  <AlertDescription className="text-base">{error}</AlertDescription>
                </Alert>
              ) : null}

              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleResendConfirmation}
                  disabled={resendLoading}
                  className="flex-1"
                >
                  {resendLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Resend confirmation email'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/login')}
                >
                  Go to login
                </Button>
              </div>

              {inviteToken ? (
                <div className="text-sm text-muted-foreground">
                  Invite URL:{' '}
                  <span className="break-all">{`${window.location.origin}/accept-invite?invite=${inviteToken}`}</span>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <form onSubmit={handleSignup} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    required
                    minLength={6}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <Button
                  variant="link"
                  onClick={() => navigate('/login')}
                  className="text-sm"
                >
                  Already have an account? Log in
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
