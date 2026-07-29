import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { claimCourseInviteSecurely } from '@/lib/claimCourseInvite';

interface CourseInvite {
  id: string;
  course_id: string;
  email: string;
  token: string;
  expires_at: string;
  redeemed_at: string | null;
  created_at: string;
}

export const useCourseInvites = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createInvite = useCallback(async (courseId: string, email: string, expiresInDays: number = 30) => {
    if (!user) {
      setError('You must be logged in to create invites');
      return null;
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail.includes('@')) {
      setError('Please enter a valid email address');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.rpc('create_course_invite', {
        p_course_id: courseId,
        p_email: normalizedEmail,
        p_expires_in_days: expiresInDays
      });

      if (error) {
        setError(error.message);
        return null;
      }

      return data;
    } catch (error) {
      setError('Failed to create invite');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getInvites = useCallback(async (courseId?: string) => {
    if (!user) {
      setError('You must be logged in to view invites');
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      // Use the course_invites_admin view to get invites with admin details
      let query = supabase.from('course_invites_admin').select('*');
      
      if (courseId) {
        query = query.eq('course_id', courseId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
        return [];
      }

      return data || [];
    } catch (error) {
      setError('Failed to fetch invites');
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  const revokeInvite = useCallback(async (inviteId: string) => {
    if (!user) {
      setError('You must be logged in to revoke invites');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // Delete the invite from the course_invites table
      const { error } = await supabase
        .from('course_invites')
        .delete()
        .eq('id', inviteId);

      if (error) {
        setError(error.message);
        return false;
      }

      return true;
    } catch (error) {
      setError('Failed to revoke invite');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const claimCourseInvite = useCallback(async (token: string): Promise<{ courseSlug: string | null; error: string | null }> => {
    if (!user) {
      return { courseSlug: null, error: 'You must be logged in to claim invites' };
    }

    const normalizedToken = token.trim();
    if (!normalizedToken) {
      return { courseSlug: null, error: 'Missing invite token' };
    }

    setLoading(true);
    setError(null);

    try {
      const data = await claimCourseInviteSecurely(normalizedToken);

      if (data && typeof data === 'object' && 'success' in data && (data as any).success === false) {
        const msg = String((data as any).error ?? 'Invite could not be redeemed');
        setError(msg);
        return { courseSlug: null, error: msg };
      }

      if (data && data.course_slug) {
        return { courseSlug: data.course_slug, error: null };
      }

      return { courseSlug: null, error: 'Invalid response from server' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to claim invite';
      setError(errorMessage);
      return { courseSlug: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    createInvite,
    getInvites,
    revokeInvite,
    claimCourseInvite,
    loading,
    error
  };
};
