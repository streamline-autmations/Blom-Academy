// @ts-nocheck
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const N8N_WEBHOOK_URL = 'https://dockerfile-1n82.onrender.com/webhook/course-invite'
const APP_BASE_URL = 'https://blom-academy.vercel.app'
const ACADEMY_URL = 'https://khydacdmfnwfwytqdoei.supabase.co'
const INVITE_EXPIRES_DAYS = 60

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Auth: shared webhook secret
    const secret = Deno.env.get('WEBHOOK_SECRET')
    const provided = (req.headers.get('Authorization') ?? '').replace('Bearer ', '').trim()
    if (secret && provided !== secret) {
      return json({ error: 'Unauthorized' }, 401)
    }

    const { order_id, email, name, phone, course_slug, amount_cents } = await req.json()

    if (!order_id || !email || !course_slug) {
      return json({ error: 'Missing required fields: order_id, email, course_slug' }, 400)
    }

    const normalizedEmail = email.toLowerCase().trim()

    // This function is deployed on the STORE project. It uses TWO clients:
    //  - store:   the auto-injected Store DB — owns the `course_purchases` table (bookkeeping).
    //  - academy: the Academy DB — owns courses, users, invites and enrolment, and is where
    //             invite redemption happens, so invites MUST be created here.
    const store = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const academyKey = Deno.env.get('ACADEMY_SERVICE_KEY')
    if (!academyKey) {
      return json({ error: 'ACADEMY_SERVICE_KEY secret is not configured on this function' }, 500)
    }
    const academy = createClient(
      ACADEMY_URL,
      academyKey,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // 1. Idempotency check (STORE course_purchases)
    const { data: existing } = await store
      .from('course_purchases')
      .select('id, invitation_status')
      .eq('order_id', order_id)
      .eq('course_slug', course_slug)
      .in('invitation_status', ['sent', 'redeemed'])
      .maybeSingle()

    if (existing) {
      return json({ success: true, action: 'skipped', reason: 'already_processed', order_id })
    }

    // 2. Resolve course (ACADEMY) — need the UUID for create_course_invite
    const { data: course } = await academy
      .from('courses')
      .select('id, title')
      .eq('slug', course_slug)
      .maybeSingle()

    const courseTitle = course?.title ?? course_slug
    // create_course_invite (Academy) expects the course UUID, not the slug.
    const courseIdForInvite = course?.id ?? course_slug

    // 3. Ensure a STORE course_purchases row exists (the storefront usually made it)
    const { data: purchaseRow } = await store
      .from('course_purchases')
      .select('id')
      .eq('order_id', order_id)
      .eq('course_slug', course_slug)
      .maybeSingle()

    if (!purchaseRow) {
      await store.from('course_purchases').insert({
        order_id,
        course_slug,
        course_title: courseTitle,
        course_type: 'online',
        buyer_email: normalizedEmail,
        buyer_name: name ?? '',
        buyer_phone: phone ?? '',
        amount_paid_cents: amount_cents ?? 0,
        amount_owed_cents: 0,
        payment_kind: 'full',
        invitation_status: 'pending',
        selected_package: 'Complete Workshop',
        selected_date: 'Available Now',
        details: { course_id: course_slug, course_price_cents: amount_cents ?? 0, deposit_cents: 0 },
      })
    }

    // 4. Does the buyer already have an Academy account?
    const { data: userId } = await academy.rpc('get_user_id_by_email', {
      p_email: normalizedEmail,
    })

    let action: string

    if (userId) {
      // 4a. Existing Academy user — enrol directly (ACADEMY)
      await academy.rpc('enroll_user_by_id', {
        p_user_id: userId,
        p_course_slugs: [course_slug],
      })

      await store
        .from('course_purchases')
        .update({ invitation_status: 'redeemed', academy_user_id: userId })
        .eq('order_id', order_id)
        .eq('course_slug', course_slug)

      // Notify the returning customer too (previously this branch sent nothing).
      const courseUrl = `${APP_BASE_URL}/login?course=${encodeURIComponent(course_slug)}`
      fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: normalizedEmail,
          name: name ?? normalizedEmail,
          phone: phone ?? '',
          course_slug: courseTitle,
          invite_url: courseUrl,
          expires_at: null,
          is_existing_user: true,
        }),
      }).catch((err) => console.error('n8n webhook error (existing user):', err))

      action = 'enrolled'

    } else {
      // 4b. New user — create invite (ACADEMY) + fire n8n
      const { data: inviteData, error: inviteError } = await academy.rpc('create_course_invite', {
        p_course_id: courseIdForInvite,
        p_email: normalizedEmail,
        p_expires_in_days: INVITE_EXPIRES_DAYS,
      })

      if (inviteError || !inviteData?.token) {
        throw new Error(`Invite creation failed: ${inviteError?.message ?? 'no token returned'}`)
      }

      const inviteUrl = `${APP_BASE_URL}/accept-invite?invite=${inviteData.token}`

      fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: normalizedEmail,
          name: name ?? normalizedEmail,
          phone: phone ?? '',
          course_slug: courseTitle,
          invite_url: inviteUrl,
          expires_at: inviteData.expires_at,
        }),
      }).catch((err) => console.error('n8n webhook error:', err))

      await store
        .from('course_purchases')
        .update({
          invitation_status: 'sent',
          invited_at: new Date().toISOString(),
        })
        .eq('order_id', order_id)
        .eq('course_slug', course_slug)

      action = 'invited'
    }

    return json({ success: true, action, order_id })

  } catch (e) {
    console.error('course-purchase error:', e)
    return json({ error: String(e?.message ?? e) }, 500)
  }
})

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...{ 'Access-Control-Allow-Origin': '*' }, 'Content-Type': 'application/json' },
  })
}
