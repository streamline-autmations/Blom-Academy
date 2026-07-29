-- Stage the Trendy Ring Nail Art Course in the Academy catalog.
-- It remains inactive until the Store, enrollment integration, and launch checks are complete.
INSERT INTO public.courses (
  slug,
  title,
  cover,
  summary,
  level,
  tags,
  price_zar,
  duration_text,
  tagline,
  description,
  notes,
  materials,
  is_active
)
VALUES (
  'trendy-ring-nail-art-course',
  'Trendy Ring Nail Art Course',
  'https://res.cloudinary.com/dnlgohkcc/image/upload/v1785314350/Trendy-Ring-Cover_mdc3dy.jpg',
  'Master modern ring nail trends, balanced placement, dimensional details, and a polished client-ready finish in four focused lessons.',
  'Beginner',
  ARRAY['Nail Art', 'Ring Designs', '3D Art', 'Petal Paste'],
  650,
  'Self-paced',
  'Turn simple nails into head-turning masterpieces.',
  'Learn Avané Crous''s approach to refined ring nail art through four practical, step-by-step video lessons.',
  ARRAY[
    'Lifetime access to all four course videos.',
    'White and Clear Petal Paste are not included with the course.',
    'Course purchasers receive a permanent, one-use Store offer: one White and one Clear Petal Paste for R399 together.',
    'Certificate of completion is available after the final practical submission.'
  ],
  '[
    {
      "name": "White Petal Paste",
      "image": "https://res.cloudinary.com/dnlgohkcc/image/upload/v1785314350/IMG-20260728-WA0023_wssnnp.jpg",
      "link": "https://blom-cosmetics.co.za/products/blom-cosmetics-petal-paste-white"
    },
    {
      "name": "Clear Petal Paste",
      "image": "https://res.cloudinary.com/dnlgohkcc/image/upload/v1785314350/IMG-20260728-WA0023_wssnnp.jpg",
      "link": "https://blom-cosmetics.co.za/products/blom-cosmetics-petal-paste-clear"
    }
  ]'::jsonb,
  false
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  cover = EXCLUDED.cover,
  summary = EXCLUDED.summary,
  level = EXCLUDED.level,
  tags = EXCLUDED.tags,
  price_zar = EXCLUDED.price_zar,
  duration_text = EXCLUDED.duration_text,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  notes = EXCLUDED.notes,
  materials = EXCLUDED.materials,
  is_active = false;
