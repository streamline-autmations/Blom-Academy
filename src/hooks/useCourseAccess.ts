export const useCourseAccess = (_courseSlug: string) => {
  return {
    hasAccess: true,
    loading: false,
    error: null as string | null,
    refetch: async () => {},
  };
};
