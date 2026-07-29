-- Enrolled students must be able to select the course row through Academy RLS.
-- Route access remains protected by the user's enrollment.
UPDATE public.courses
SET is_active = true
WHERE slug = 'trendy-ring-nail-art-course';
