-- Keep the Academy catalog aligned with the Store's real product imagery.
UPDATE public.courses
SET
  materials = '[
    {
      "name": "Blom Gel Paint Set",
      "image": "https://res.cloudinary.com/drsrbzm2t/image/upload/v1772128822/GelPaints1_buvq6f.jpg",
      "link": "https://blom-cosmetics.co.za/products/blom-gel-paint-set-12x-colours"
    },
    {
      "name": "Nail Forms",
      "image": "https://res.cloudinary.com/drsrbzm2t/image/upload/v1764140870/nail-forms-white_u5dyzz.webp",
      "link": "https://blom-cosmetics.co.za/products/nail-forms"
    },
    {
      "name": "Professional Detail Brush",
      "image": "https://res.cloudinary.com/drsrbzm2t/image/upload/v1764062947/detail-brush-white_hyfyuu.webp",
      "link": "https://blom-cosmetics.co.za/products/professional-detail-brush"
    },
    {
      "name": "White Petal Paste",
      "image": "https://res.cloudinary.com/hmvetruz/image/upload/v1785259213/products/temp/PetalPasteWhite_hirzoi.jpg",
      "link": "https://blom-cosmetics.co.za/products/blom-cosmetics-petal-paste-white"
    },
    {
      "name": "Clear Petal Paste",
      "image": "https://res.cloudinary.com/hmvetruz/image/upload/v1785259046/products/temp/PetalPasteClear_qh62r2.jpg",
      "link": "https://blom-cosmetics.co.za/products/blom-cosmetics-petal-paste-clear"
    }
  ]'::jsonb,
  is_active = true
WHERE slug = 'trendy-ring-nail-art-course';

-- Serialize invite creation for one email/course pair and reuse an existing
-- valid invite. Concurrent Store payment callbacks can no longer mint two
-- different links for the same purchase.
CREATE OR REPLACE FUNCTION public.create_course_invite(
  p_course_id text,
  p_email text,
  p_expires_in_days integer DEFAULT 30
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_course_id uuid;
  v_token uuid;
  v_expires_at timestamptz;
  v_course_slug text;
  v_email text := lower(trim(p_email));
BEGIN
  IF p_course_id IS NULL OR length(trim(p_course_id)) = 0 THEN
    RAISE EXCEPTION 'p_course_id is required';
  END IF;
  IF v_email IS NULL OR length(v_email) = 0 THEN
    RAISE EXCEPTION 'p_email is required';
  END IF;

  BEGIN
    v_course_id := p_course_id::uuid;
  EXCEPTION
    WHEN OTHERS THEN
      SELECT id INTO v_course_id
      FROM public.courses
      WHERE slug = p_course_id;
  END;

  IF v_course_id IS NULL THEN
    RAISE EXCEPTION 'Course not found';
  END IF;

  PERFORM pg_advisory_xact_lock(
    hashtextextended(v_email || '|' || v_course_id::text, 0)
  );

  SELECT token, expires_at
  INTO v_token, v_expires_at
  FROM public.course_invites
  WHERE course_id = v_course_id
    AND lower(email) = v_email
    AND redeemed_at IS NULL
    AND expires_at > now()
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_token IS NULL THEN
    v_expires_at := now() + make_interval(days => greatest(1, coalesce(p_expires_in_days, 30)));

    INSERT INTO public.course_invites(course_id, email, expires_at)
    VALUES (v_course_id, v_email, v_expires_at)
    RETURNING token INTO v_token;
  END IF;

  SELECT slug INTO v_course_slug
  FROM public.courses
  WHERE id = v_course_id;

  RETURN jsonb_build_object(
    'success', true,
    'token', v_token::text,
    'expires_at', v_expires_at,
    'course_id', v_course_id,
    'course_slug', v_course_slug,
    'invite_url', 'https://blom-academy.vercel.app/accept-invite?invite=' || v_token::text
  );
END;
$$;

-- An invite belongs to the purchasing email. A logged-in user with any other
-- email must never be able to redeem it.
CREATE OR REPLACE FUNCTION public.claim_course_invite(
  p_token text,
  p_user_id uuid DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_session_user_id uuid;
  v_session_email text;
  v_user_id uuid;
  v_token_uuid uuid;
  v_invite record;
  v_course_slug text;
BEGIN
  v_session_user_id := auth.uid();
  v_session_email := lower(trim(coalesce(auth.jwt() ->> 'email', '')));

  IF v_session_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;
  IF v_session_email = '' THEN
    RAISE EXCEPTION 'The signed-in account has no verified email address';
  END IF;

  v_user_id := coalesce(p_user_id, v_session_user_id);
  IF v_user_id <> v_session_user_id THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  IF p_token IS NULL OR length(trim(p_token)) = 0 THEN
    RAISE EXCEPTION 'p_token is required';
  END IF;

  BEGIN
    v_token_uuid := trim(p_token)::uuid;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE EXCEPTION 'Invalid invite token format';
  END;

  SELECT *
  INTO v_invite
  FROM public.course_invites
  WHERE token = v_token_uuid
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invite not found';
  END IF;
  IF lower(trim(v_invite.email)) <> v_session_email THEN
    RAISE EXCEPTION 'This invite belongs to a different email address. Sign in with the email used to purchase the course.';
  END IF;
  IF v_invite.redeemed_at IS NOT NULL THEN
    RAISE EXCEPTION 'Invite already redeemed';
  END IF;
  IF v_invite.expires_at < now() THEN
    RAISE EXCEPTION 'Invite expired';
  END IF;

  INSERT INTO public.enrollments(user_id, course_id)
  VALUES (v_user_id, v_invite.course_id)
  ON CONFLICT DO NOTHING;

  UPDATE public.course_invites
  SET redeemed_at = now(),
      redeemed_user_id = v_user_id
  WHERE id = v_invite.id;

  SELECT slug INTO v_course_slug
  FROM public.courses
  WHERE id = v_invite.course_id;

  RETURN jsonb_build_object(
    'success', true,
    'course_id', v_invite.course_id,
    'course_slug', v_course_slug
  );
END;
$$;
