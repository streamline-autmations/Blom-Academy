-- Close all direct invite/enrollment bypasses in the Academy database.
--
-- Only the Store service role or an Academy admin may create invites.
-- Only an authenticated user whose canonical Auth email matches the invite
-- email may redeem it.

DROP FUNCTION IF EXISTS public.create_course_invite(text, text, integer);

CREATE OR REPLACE FUNCTION public.create_course_invite(
  p_course_id uuid,
  p_email text,
  p_expires_in_days integer
) RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_token uuid;
  v_expires_at timestamptz;
  v_email text := lower(trim(p_email));
BEGIN
  IF coalesce(auth.role(), '') <> 'service_role'
    AND NOT EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE user_id = auth.uid()
        AND role = 'admin'
    ) THEN
    RAISE EXCEPTION 'Not authorized to create course invites';
  END IF;

  IF p_course_id IS NULL
    OR NOT EXISTS (SELECT 1 FROM public.courses WHERE id = p_course_id) THEN
    RAISE EXCEPTION 'Course not found';
  END IF;

  IF v_email IS NULL OR length(v_email) = 0 THEN
    RAISE EXCEPTION 'p_email is required';
  END IF;

  PERFORM pg_advisory_xact_lock(
    hashtextextended(v_email || '|' || p_course_id::text, 0)
  );

  SELECT token, expires_at
  INTO v_token, v_expires_at
  FROM public.course_invites
  WHERE course_id = p_course_id
    AND lower(trim(email)) = v_email
    AND redeemed_at IS NULL
    AND expires_at > now()
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_token IS NULL THEN
    v_expires_at :=
      now() + make_interval(days => greatest(1, coalesce(p_expires_in_days, 30)));

    INSERT INTO public.course_invites(course_id, email, expires_at)
    VALUES (p_course_id, v_email, v_expires_at)
    RETURNING token INTO v_token;
  END IF;

  RETURN json_build_object(
    'success', true,
    'token', v_token::text,
    'expires_at', v_expires_at,
    'course_id', p_course_id
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.create_course_invite(
  p_course_id uuid,
  p_email text
) RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  RETURN public.create_course_invite(p_course_id, p_email, 7);
END;
$$;

CREATE OR REPLACE FUNCTION public.claim_course_invite(
  p_token text,
  p_user_id uuid DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
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

  IF v_session_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  SELECT lower(trim(email))
  INTO v_session_email
  FROM auth.users
  WHERE id = v_session_user_id;

  IF v_session_email IS NULL OR v_session_email = '' THEN
    RAISE EXCEPTION 'The signed-in account has no email address';
  END IF;

  v_user_id := coalesce(p_user_id, v_session_user_id);
  IF v_user_id <> v_session_user_id THEN
    RAISE EXCEPTION 'Not authorized';
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
    RAISE EXCEPTION
      'This invite belongs to a different email address. Sign in with the email used to purchase the course.';
  END IF;

  IF v_invite.redeemed_at IS NOT NULL THEN
    RAISE EXCEPTION 'Invite already redeemed';
  END IF;

  IF v_invite.expires_at < now() THEN
    RAISE EXCEPTION 'Invite expired';
  END IF;

  INSERT INTO public.enrollments(user_id, course_id)
  VALUES (v_user_id, v_invite.course_id)
  ON CONFLICT (user_id, course_id) DO NOTHING;

  UPDATE public.course_invites
  SET redeemed_at = now(),
      redeemed_user_id = v_user_id
  WHERE id = v_invite.id;

  SELECT slug
  INTO v_course_slug
  FROM public.courses
  WHERE id = v_invite.course_id;

  RETURN jsonb_build_object(
    'success', true,
    'course_id', v_invite.course_id,
    'course_slug', v_course_slug
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.claim_course_invite(
  p_token text
) RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  RETURN public.claim_course_invite(p_token, auth.uid())::json;
END;
$$;

-- Public table policies previously allowed unrestricted invite inserts and
-- updates. Service-role access remains available through its explicit policy.
DROP POLICY IF EXISTS "Service role can insert invites"
ON public.course_invites;

DROP POLICY IF EXISTS "Users can update invites they claim"
ON public.course_invites;

REVOKE ALL ON FUNCTION public.create_course_invite(uuid, text, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.create_course_invite(uuid, text, integer) FROM anon;
REVOKE ALL ON FUNCTION public.create_course_invite(uuid, text, integer) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.create_course_invite(uuid, text, integer)
TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.create_course_invite(uuid, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.create_course_invite(uuid, text) FROM anon;
REVOKE ALL ON FUNCTION public.create_course_invite(uuid, text) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.create_course_invite(uuid, text)
TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.claim_course_invite(text, uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.claim_course_invite(text, uuid) FROM anon;
REVOKE ALL ON FUNCTION public.claim_course_invite(text, uuid) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.claim_course_invite(text, uuid)
TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.claim_course_invite(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.claim_course_invite(text) FROM anon;
REVOKE ALL ON FUNCTION public.claim_course_invite(text) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.claim_course_invite(text)
TO authenticated, service_role;

-- These legacy RPCs are not used by the current Academy frontend or Store.
-- Keep service-role access for operational recovery, but remove browser access.
REVOKE ALL ON FUNCTION public.generate_course_invite_link(text, uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.generate_course_invite_link(text, uuid) FROM anon;
REVOKE ALL ON FUNCTION public.generate_course_invite_link(text, uuid) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.generate_course_invite_link(text, uuid)
TO service_role;

REVOKE ALL ON FUNCTION public.redeem_course_invite(uuid, uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.redeem_course_invite(uuid, uuid) FROM anon;
REVOKE ALL ON FUNCTION public.redeem_course_invite(uuid, uuid) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.redeem_course_invite(uuid, uuid)
TO service_role;

ALTER FUNCTION public.generate_course_invite_link(text, uuid)
SET search_path = public;

ALTER FUNCTION public.redeem_course_invite(uuid, uuid)
SET search_path = public;
