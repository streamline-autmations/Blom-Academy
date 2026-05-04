import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

export const useCourseAccess = (courseSlug: string) => {
  const { user, loading: authLoading } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAccess = async () => {
    if (!user || !courseSlug) {
      setHasAccess(false);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from('enrollments')
        .select('user_id, courses!inner(slug)')
        .eq('user_id', user.id)
        .eq('courses.slug', courseSlug)
        .maybeSingle();

      if (queryError) throw queryError;

      setHasAccess(!!data);
    } catch (err: any) {
      setError(err.message ?? 'Failed to check course access');
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    checkAccess();
  }, [user, courseSlug, authLoading]);

  return { hasAccess, loading, error, refetch: checkAccess };
};
