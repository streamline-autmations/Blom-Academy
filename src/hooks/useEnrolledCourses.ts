import { useEffect, useMemo, useState } from 'react';
import type { Course } from '@/data/types';
import { courses as mockCourses } from '@/data/mock';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

type EnrollmentRow = {
  courses: { slug: string; title: string } | null;
};

// Module-level cache keyed by userId so enrollments survive page navigation.
const cache = new Map<string, EnrollmentRow[]>();

export const useEnrolledCourses = () => {
  const { user } = useAuth();
  const userId = user?.id ?? '';
  const [rows, setRows] = useState<EnrollmentRow[] | null>(() =>
    userId ? cache.get(userId) ?? null : null
  );
  const [loading, setLoading] = useState(rows === null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!userId) {
        setRows([]);
        setLoading(false);
        return;
      }

      const cached = cache.get(userId);
      if (cached) {
        setRows(cached);
        setLoading(false);
      } else {
        setLoading(true);
      }
      setError(null);

      const { data, error } = await supabase
        .from('enrollments')
        .select('courses!inner(slug, title)')
        .eq('user_id', userId);

      if (cancelled) return;

      if (!error && data) {
        const mapped = data as unknown as EnrollmentRow[];
        cache.set(userId, mapped);
        setRows(mapped);
        setLoading(false);
        return;
      }

      const { data: enrollmentRows, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('user_id', userId);

      if (cancelled) return;

      if (enrollmentsError) {
        if (!cached) setRows([]);
        setError(enrollmentsError.message);
        setLoading(false);
        return;
      }

      const courseIds = (enrollmentRows ?? [])
        .map((r) => (r as any).course_id)
        .filter(Boolean) as string[];

      if (courseIds.length === 0) {
        cache.set(userId, []);
        setRows([]);
        setLoading(false);
        return;
      }

      const { data: coursesRows, error: coursesError } = await supabase
        .from('courses')
        .select('id, slug, title')
        .in('id', courseIds);

      if (cancelled) return;

      if (coursesError) {
        if (!cached) setRows([]);
        setError(coursesError.message);
        setLoading(false);
        return;
      }

      const byId = new Map((coursesRows ?? []).map((c: any) => [c.id, c] as const));
      const mapped: EnrollmentRow[] = courseIds
        .map((id) => byId.get(id))
        .filter(Boolean)
        .map((c: any) => ({ courses: { slug: c.slug, title: c.title } }));

      cache.set(userId, mapped);
      setRows(mapped);
      setLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const enrolledCourses = useMemo<Course[]>(() => {
    const mockBySlug = new Map(mockCourses.map((c) => [c.slug, c] as const));
    const slugs = (rows ?? []).map((r) => r.courses?.slug).filter(Boolean) as string[];

    return slugs
      .map((slug) => {
        const mock = mockBySlug.get(slug);
        const rowCourse = (rows ?? []).find((r) => r.courses?.slug === slug)?.courses;
        if (mock) {
          return {
            ...mock,
            title: rowCourse?.title || mock.title,
          };
        }

        return {
          id: slug,
          slug,
          title: rowCourse?.title || slug,
          cover: '',
          summary: '',
          level: 'Beginner',
          tags: [],
        };
      });
  }, [rows]);

  return { enrolledCourses, loading, error };
};
