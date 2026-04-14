import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { LoaderCircle, CheckCircle, AlertCircle, User, BookOpen } from 'lucide-react';
import { courses } from '@/data/mock';
import { supabase } from '@/lib/supabase';

interface UserAccess {
  slug: string;
  title: string;
  enrolled_at: string;
}

interface EnrollResult {
  success: boolean;
  enrollments_created: number;
  error?: string;
}

export default function AdminAccess() {
  const [userId, setUserId] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EnrollResult | null>(null);
  const [userAccess, setUserAccess] = useState<UserAccess[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Validate UUID format
  const isValidUUID = (uuid: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  // Grant course access
  const grantAccess = async () => {
    if (!userId.trim()) {
      setError('Please enter a user ID');
      return;
    }

    if (!isValidUUID(userId.trim())) {
      setError('Please enter a valid UUID format');
      return;
    }

    if (selectedCourses.length === 0) {
      setError('Please select at least one course');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🎯 Granting access for user:', userId, 'courses:', selectedCourses);
      
      const { data, error: rpcError } = await supabase.rpc('enroll_user_by_id', {
        p_user_id: userId.trim(),
        p_course_slugs: selectedCourses
      });

      if (rpcError) {
        console.error('❌ RPC Error:', rpcError);
        setError(`Failed to grant access: ${rpcError.message}`);
        setIsLoading(false);
        return;
      }

      console.log('✅ RPC Result:', data);
      setResult(data);

      // Fetch user's current access after successful enrollment
      await fetchUserAccess();

    } catch (error) {
      console.error('❌ Unexpected error:', error);
      setError(`An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user's current course access
  const fetchUserAccess = async () => {
    if (!userId.trim() || !isValidUUID(userId.trim())) return;

    try {
      const { data, error: queryError } = await supabase
        .rpc('get_user_enrollments', { p_user_id: userId.trim() });

      if (queryError) {
        console.error('❌ Query Error:', queryError);
        return;
      }

      const accessData: UserAccess[] = (data || []).map((item: any) => ({
        slug: item.slug,
        title: item.title,
        enrolled_at: item.enrolled_at
      }));

      setUserAccess(accessData);
    } catch (error) {
      console.error('❌ Error fetching user access:', error);
    }
  };

  // Handle course selection
  const handleCourseToggle = (courseSlug: string, checked: boolean) => {
    if (checked) {
      setSelectedCourses(prev => [...prev, courseSlug]);
    } else {
      setSelectedCourses(prev => prev.filter(slug => slug !== courseSlug));
    }
  };

  // Handle user ID change
  const handleUserIdChange = (value: string) => {
    setUserId(value);
    setResult(null);
    setUserAccess([]);
    setError(null);
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Admin Course Access</h1>
        <p className="text-body-text">Grant course access to users by ID</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Grant Access Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Grant Course Access
            </CardTitle>
            <CardDescription>
              Enter a user ID and select courses to grant access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User ID Input */}
            <div className="space-y-2">
              <Label htmlFor="userId">User ID (UUID)</Label>
              <Input
                id="userId"
                type="text"
                placeholder="e.g., 123e4567-e89b-12d3-a456-426614174000"
                value={userId}
                onChange={(e) => handleUserIdChange(e.target.value)}
                className={!userId || isValidUUID(userId) ? '' : 'border-red-500'}
              />
              {userId && !isValidUUID(userId) && (
                <p className="text-sm text-red-500">Please enter a valid UUID format</p>
              )}
            </div>

            {/* Course Selection */}
            <div className="space-y-3">
              <Label>Select Courses</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-3">
                {courses.map((course) => (
                  <div key={course.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={course.id}
                      checked={selectedCourses.includes(course.slug)}
                      onCheckedChange={(checked) => 
                        handleCourseToggle(course.slug, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={course.id} 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {course.title}
                    </Label>
                    <Badge variant="secondary" className="text-xs">
                      {course.slug}
                    </Badge>
                  </div>
                ))}
              </div>
              {selectedCourses.length > 0 && (
                <p className="text-sm text-body-text">
                  {selectedCourses.length} course{selectedCourses.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Grant Access Button */}
            <Button 
              onClick={grantAccess} 
              disabled={isLoading || !userId.trim() || !isValidUUID(userId.trim()) || selectedCourses.length === 0}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
                  Granting Access...
                </>
              ) : (
                'Grant Access'
              )}
            </Button>

            {/* Result Display */}
            {result && (
              <Alert className={result.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}>
                {result.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={result.success ? 'text-green-800' : 'text-red-800'}>
                  {result.success 
                    ? `Successfully created ${result.enrollments_created} enrollment${result.enrollments_created !== 1 ? 's' : ''}`
                    : result.error || 'Failed to grant access'
                  }
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* User Access Display */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Current User Access
            </CardTitle>
            <CardDescription>
              Shows all courses this user currently has access to
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userId && isValidUUID(userId) ? (
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  onClick={fetchUserAccess}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Refresh Access List'
                  )}
                </Button>

                {userAccess.length > 0 ? (
                  <div className="space-y-3">
                    {userAccess.map((access, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{access.title}</p>
                          <p className="text-sm text-body-text">{access.slug}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="text-xs">
                            {new Date(access.enrolled_at).toLocaleDateString()}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-body-text">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No course access found for this user</p>
                    <p className="text-sm">Click "Refresh Access List" to check</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-body-text">
                <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Enter a valid user ID to view their course access</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
