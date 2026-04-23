import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/lib/supabase';

interface CourseAccess {
  hasAccess: boolean;
  loading: boolean;
  error: string | null;
}

export const useCourseAccess = (courseSlug: string) => {
  const { user, session } = useAuth();
  const [access, setAccess] = useState<CourseAccess>({
    hasAccess: false,
    loading: true,
    error: null
  });

  const checkAccess = useCallback(async () => {
    if (!session || !user) {
      setAccess({
        hasAccess: false,
        loading: false,
        error: 'Not authenticated'
      });
      return;
    }

    if (!courseSlug) {
      setAccess({
        hasAccess: false,
        loading: false,
        error: 'Missing course identifier'
      });
      return;
    }

    try {
      const { data: courseRow, error: courseError } = await supabase
        .from('courses')
        .select('id')
        .eq('slug', courseSlug)
        .maybeSingle();

      if (courseError) {
        setAccess({ hasAccess: false, loading: false, error: courseError.message });
        return;
      }

      if (!courseRow?.id) {
        setAccess({ hasAccess: false, loading: false, error: 'Unknown course slug' });
        return;
      }

      const { data: enrollmentRows, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('user_id', user.id)
        .eq('course_id', courseRow.id)
        .limit(1);

      if (enrollmentError) {
        setAccess({ hasAccess: false, loading: false, error: enrollmentError.message });
        return;
      }

      setAccess({
        hasAccess: (enrollmentRows?.length ?? 0) > 0,
        loading: false,
        error: null
      });
    } catch (e: any) {
      setAccess({
        hasAccess: false,
        loading: false,
        error: e?.message ?? 'Failed to check access'
      });
    }
  }, [courseSlug, session, user]);

  useEffect(() => {
    checkAccess();
  }, [checkAccess]);

  return {
    ...access,
    refetch: checkAccess
  };
};
