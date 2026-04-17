// @ts-nocheck
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const N8N_WEBHOOK_URL = 'https://dockerfile-1n82.onrender.com/webhook/course-invite'
const APP_BASE_URL = 'https://blom-academy.vercel.app'
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
    // ── Auth: shared webhook secret ──────────────────────────────────────────
    const secret = Deno.env.get('WEBHOOK_SECRET')
    const provided = (req.headers.get('Authorization') ?? '').replace('Bearer ', '').trim()
    if (secret && provided !== secret) {
      return json({ error: 'Unauthorized' }, 401)
    }

    // ── Parse body ───────────────────────────────────────────────────────────
    const { order_id, email, name, phone, course_slug, amount_cents } = await req.json()

    if (!order_id || !email || !course_slug) {
      return json({ error: 'Missing required fields: order_id, email, course_slug' }, 400)
    }

    const normalizedEmail = email.toLowerCase().trim()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // ── 1. Idempotency check ─────────────────────────────────────────────────
    // Skip if we already successfully processed this order+course
    const { data: existing } = await supabase
      .from('course_purchases')
      .select('id, invitation_status')
      .eq('order_id', order_id)
      .eq('course_slug', course_slug)
      .in('invitation_status', ['sent', 'enrolled'])
      .maybeSingle()

    if (existing) {
      return json({ success: true, action: 'skipped', reason: 'already_processed', order_id })
    }

    // ── 2. Resolve course title ──────────────────────────────────────────────
    const { data: course } = await supabase
      .from('courses')
      .select('title')
      .eq('slug', course_slug)
      .maybeSingle()

    const courseTitle = course?.title ?? course_slug

    // ── 3. Upsert course_purchases row ───────────────────────────────────────
    // Insert if not present; if a row already exists for this order+course
    // (e.g. created by the Shop) just update it so we track the full data.
    const { data: purchaseRow } = await supabase
      .from('course_purchases')
      .select('id')
      .eq('order_id', order_id)
      .eq('course_slug', course_slug)
      .maybeSingle()

    if (!purchaseRow) {
      await supabase.from('course_purchases').insert({
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

    // ── 4. Check if buyer already has an Academy account ────────────────────
    const { data: userId } = await supabase.rpc('get_user_id_by_email', {
      p_email: normalizedEmail,
    })

    let action: string

    if (userId) {
      // ── 4a. Existing user → enroll directly, no invite needed ─────────────
      await supabase.rpc('enroll_user_by_id', {
        p_user_id: userId,
        p_course_slugs: [course_slug],
      })

      await supabase
        .from('course_purchases')
        .update({ invitation_status: 'enrolled', academy_user_id: userId })
        .eq('order_id', order_id)
        .eq('course_slug', course_slug)

      action = 'enrolled'

    } else {
      // ── 4b. New user → create invite + fire n8n ───────────────────────────
      const { data: inviteData, error: inviteError } = await supabase.rpc('create_course_invite', {
        p_course_id: course_slug,
        p_email: normalizedEmail,
        p_expires_in_days: INVITE_EXPIRES_DAYS,
      })

      if (inviteError || !inviteData?.token) {
        throw new Error(`Invite creation failed: ${inviteError?.message ?? 'no token returned'}`)
      }

      const inviteUrl = `${APP_BASE_URL}/accept-invite?invite=${inviteData.token}`

      // Fire n8n for email + WhatsApp — best-effort, don't block response
      fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: normalizedEmail,
          name: name ?? normalizedEmail,
          phone: phone ?? '',
          course_slug: courseTitle,         // n8n email template shows the course title
          invite_url: inviteUrl,
          expires_at: inviteData.expires_at,
        }),
      }).catch((err) => console.error('n8n webhook error:', err))

      await supabase
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
