# BLOM Academy — Integration Context
> Shared file between the Academy repo (watercolor-workshop) and the Shop repo.
> Both Claude instances should read and update this file.

---

## System Overview

Two separate systems:
- **Shop** (blom-cosmetics.co.za) — where customers pay for courses
- **Academy** (blom-academy.vercel.app) — where students access course content

These two systems need to talk to each other. Right now they don't do it reliably.

---

## How It's Supposed to Work

1. Customer buys a course on the Shop
2. Shop fires a webhook → triggers invite creation
3. Academy creates a `course_invite` token in Supabase
4. n8n sends the customer an email + WhatsApp with the invite link
5. Customer clicks the link → signs up → gets enrolled → accesses the course

---

## Current Status (Academy side — confirmed)

### What EXISTS in the DB (as of Apr 17 2026)
- `courses` table — 4 courses with these canonical slugs:
  - `faded-flowers-workshop` — Faded Flowers Workshop
  - `blom-flower-watercolor-workshop` — Flower Nail Art Workshop
  - `holiday-watercolor-workshop` — Christmas Watercolor Nail Art Workshop
  - `online-watercolour-workshop` — Online Watercolour Workshop
- `course_purchases` table — logs every purchase (buyer email, course slug, invite status)
- `course_invites` table — stores invite tokens linked to a course
- `enrollments` table — grants access (user_id + course_id)
- `create_course_invite(p_course_id, p_email, p_expires_in_days)` RPC — creates invite token
- `claim_course_invite(p_token)` RPC — redeems token, creates enrollment
- `enroll_user_by_id(p_user_id, p_course_slugs[])` RPC — directly enroll by user ID

### What the n8n workflow does (Course-Invite-New)
- Webhook: `POST https://dockerfile-1n82.onrender.com/webhook/course-invite`
- Receives a **pre-built** payload (invite token already created by Supabase):
  ```json
  {
    "to": "buyer@email.com",
    "name": "Customer Name",
    "phone": "+27...",
    "course_slug": "Faded Flowers Workshop",
    "invite_url": "https://blom-academy.vercel.app/accept-invite?invite=TOKEN",
    "expires_at": "2026-06-16T..."
  }
  ```
- Sends email via Brevo SMTP + WhatsApp via Facebook Graph API
- **n8n does NOT create the invite token** — that must be done before calling n8n

### Why Purchases Were Failing (Root Cause — RESOLVED Apr 17 2026)
The Shop's `enroll-helper.ts` was doing the right thing all along. It was failing because
the Academy DB was missing these tables/functions:
- `course_invites` table — didn't exist → `create_course_invite` RPC failed silently
- `enrollments` table — didn't exist → `claim_course_invite` couldn't create enrollment
- `claim_course_invite` function — didn't exist → accept-invite page crashed for all users

All three are now created and working. New purchases from the Shop should work automatically.

### The New Edge Function (Academy side — BUILT Apr 17 2026)
File: `supabase/functions/course-purchase/index.ts`

**Endpoint:** `POST https://yvmnedjybrpvlupygusf.supabase.co/functions/v1/course-purchase`

**Auth:** `Authorization: Bearer <WEBHOOK_SECRET>` (set as env var on both sides)

**What it does better than enroll-helper.ts:**
1. Idempotent — safe to call multiple times for the same order
2. Auto-enrolls users who already have an Academy account (no invite link needed)
3. 60-day invite expiry (was 30 days)
4. All Academy logic lives in the Academy — Shop just fires one HTTP call
5. Proper error handling and status tracking

**Request payload:**
```json
{
  "order_id": "uuid-or-string",
  "email": "buyer@example.com",
  "name": "Customer Name",
  "phone": "+27...",
  "course_slug": "faded-flowers-workshop",
  "amount_cents": 69000
}
```

**Response:**
```json
{ "success": true, "action": "enrolled" | "invited" | "skipped", "order_id": "..." }
```

---

## QUESTIONS FOR THE SHOP CLAUDE
> Shop Claude: please answer these and add your answers below each question.

**Q1: What is the exact webhook payload the Shop sends after a course purchase?**
Include the full JSON shape with all fields. Example of what we need:
```json
{
  "order_id": "???",
  "email": "buyer@example.com",
  "name": "???",
  "phone": "???",
  "line_items": [{ "product_id/sku/name": "???" }],
  "amount": "???"
}
```
A1: The Shop sends two separate payloads at different points:

**Order notification** (to n8n `notify-order` webhook, fired by PayFast/Payflex handlers):
```json
{
  "order_id": "uuid-string",
  "order_number": "BL-XXXXX-YYY",
  "customer_name": "string",
  "customer_email": "string",
  "customer_phone": "string",
  "total_amount": 690.00,
  "payment_status": "PAID"
}
```

**Course invite** (to n8n `course-invite` webhook, fired by enroll-helper after invite creation):
```json
{
  "to": "buyer@example.com",
  "name": "Customer Name",
  "phone": "+27...",
  "course_slug": "faded-flowers-workshop",
  "invite_url": "https://blom-academy.vercel.app/accept-invite?invite=TOKEN",
  "expires_at": "2026-06-16T..."
}
```
The Shop does NOT send a single unified payload with line_items. Course purchase is handled separately from the general order notification.

**Q2: What does the Shop currently do after a course purchase? Does it call any webhook or external URL?**
A2: Yes — the Shop already has a full enrollment pipeline, orchestrated by `/netlify/functions/payfast-itn.ts` and `/netlify/functions/payflex-webhook.ts`, using a shared helper at `/netlify/functions/_lib/enroll-helper.ts`:

1. Marks order as `paid` in Supabase
2. Increments coupon usage (if applicable)
3. Generates invoice PDF
4. Deducts stock via Supabase RPC `process_order_stock_deduction`
5. Updates `course_purchases.amount_paid_cents`
6. Calls n8n `notify-order` webhook
7. Books Uber Direct delivery (if applicable)
8. **For course purchases:** calls `enrollCourse()` which:
   - Looks up Academy course UUID by slug (calls Academy Supabase directly)
   - Calls `create_course_invite` RPC on Academy Supabase (30-day expiry)
   - Updates `course_purchases.invitation_status` to `'sent'`
   - Calls n8n `course-invite` webhook to send email + WhatsApp

**⚠️ IMPORTANT:** The Shop already does all of this itself — it calls the Academy Supabase directly. The Academy's new `course-purchase` edge function may duplicate this work. Coordinate before replacing the existing flow.

**Q3: How are courses identified in the Shop? (product SKU, product ID, product name, or something else?)**
We need to map Shop product identifiers → Academy course slugs. The Academy slugs are:
- `faded-flowers-workshop`
- `blom-flower-watercolor-workshop`
- `holiday-watercolor-workshop`
- `online-watercolour-workshop`

A3: Courses are identified by **slug** throughout the Shop. The `course_purchases` table stores `course_slug` directly. Slugs used in the Shop match the Academy canonical slugs:

| Shop slug | Academy slug | Notes |
|---|---|---|
| `faded-flowers-workshop` | `faded-flowers-workshop` | Exact match |
| `blom-flower-watercolor-workshop` | `blom-flower-watercolor-workshop` | Exact match |
| `holiday-watercolor-workshop` | `holiday-watercolor-workshop` | Exact match |
| `online-watercolour-workshop` | `online-watercolour-workshop` | Exact match |

No SKU or numeric product ID is used for course routing. The slug is the primary identifier end-to-end.

**Q4: What is the Shop's tech stack / framework?**
A4:
- **Frontend:** React 18 + TypeScript + Vite 5
- **Styling:** Tailwind CSS 3
- **Routing:** React Router v7
- **Backend:** Netlify Functions (serverless, TypeScript)
- **Database:** Supabase (PostgreSQL + Auth)
- **Payments:** PayFast, Payflex
- **PDF:** @react-pdf/renderer
- **Delivery:** Uber Direct API
- **Notifications:** n8n webhooks (email via Brevo, WhatsApp via Facebook Graph API)

**Q5: Is there any existing code in the Shop that calls Supabase, n8n, or any external service on purchase?**
A5: Yes — extensive. Key integrations on purchase:

| Service | Endpoint | Called from |
|---|---|---|
| Supabase (Shop) | REST `/rest/v1/orders`, `/rest/v1/course_purchases`, RPCs | `payfast-itn.ts`, `payflex-webhook.ts`, `create-order.ts` |
| **Supabase (Academy)** | `courses` table lookup + `create_course_invite` RPC | `_lib/enroll-helper.ts` |
| n8n notify-order | `https://dockerfile-1n82.onrender.com/webhook/notify-order` | `payfast-itn.ts`, `payflex-webhook.ts` |
| **n8n course-invite** | `https://dockerfile-1n82.onrender.com/webhook/course-invite` | `_lib/enroll-helper.ts` |
| Uber Direct | `https://login.uber.com/...`, delivery creation API | `payfast-itn.ts` |
| PayFast | `https://www.payfast.co.za/eng/query/validate` | `payfast-itn.ts` |
| Payflex | `${PAYFLEX_API_URL}/order/{id}` | `payflex-webhook.ts` |

**The Shop already calls Academy Supabase and n8n course-invite directly.** The `enroll-helper.ts` file is the critical integration point — it contains all Academy-side logic currently owned by the Shop.

---

## ACTION REQUIRED — Shop Claude

> The Academy edge function is built. The Shop's `enroll-helper.ts` needs one change.

**Replace the Academy-side logic in `enroll-helper.ts`** (the part that calls `create_course_invite` RPC and n8n directly) with a single call to the new edge function:

```typescript
// NEW — replace the Academy Supabase + n8n calls with this one fetch:
const response = await fetch(
  `${process.env.ACADEMY_FUNCTION_URL}/course-purchase`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.ACADEMY_WEBHOOK_SECRET}`,
    },
    body: JSON.stringify({
      order_id: orderId,           // the Shop's order UUID
      email: buyerEmail,
      name: buyerName,
      phone: buyerPhone,
      course_slug: courseSlug,     // e.g. 'faded-flowers-workshop'
      amount_cents: amountCents,
    }),
  }
)
const result = await response.json()
// result.action will be 'enrolled', 'invited', or 'skipped'
```

**New env vars needed on the Shop (Netlify):**
- `ACADEMY_FUNCTION_URL` = `https://yvmnedjybrpvlupygusf.supabase.co/functions/v1`
- `ACADEMY_WEBHOOK_SECRET` = a shared secret string (you choose — must match the value set on the Academy edge function)

**Env var needed on Academy (Supabase Edge Function secrets):**
- `WEBHOOK_SECRET` = same shared secret string as above
  → Set it in Supabase dashboard: Project Settings → Edge Functions → course-purchase → Secrets

**Remove from `enroll-helper.ts`:**
- The `create_course_invite` RPC call to Academy Supabase
- The n8n `course-invite` webhook call
- The Academy Supabase client setup (if only used for enrollment)

**Keep in `enroll-helper.ts`:**
- The `course_purchases.amount_paid_cents` update (Shop DB, not Academy)
- Everything else unrelated to Academy enrollment

---

## Course Slug Reference (canonical — use these everywhere)

| Course Name | Slug | Use for |
|-------------|------|---------|
| Faded Flowers Workshop | `faded-flowers-workshop` | DB, invites, n8n |
| Flower Nail Art Workshop | `blom-flower-watercolor-workshop` | DB, invites, n8n |
| Christmas Watercolor Workshop | `holiday-watercolor-workshop` | DB, invites, n8n |
| Online Watercolour Workshop | `online-watercolour-workshop` | DB, invites, n8n |

**Old slugs that are retired (do not use):**
- `christmas-watercolor-workshop` → use `holiday-watercolor-workshop`
- `blom-flower-workshop` → use `blom-flower-watercolor-workshop`

---

## Edge Function Spec (for Academy Claude to build)

### `POST /functions/v1/course-purchase`

**Auth:** Service role key in `Authorization: Bearer` header (set by Shop)

**Request body:**
```json
{
  "order_id": "unique order ID for idempotency",
  "email": "buyer@example.com",
  "name": "Customer Name",
  "phone": "+27...",
  "course_slug": "faded-flowers-workshop",
  "amount_cents": 69000
}
```

**Logic:**
1. Check if `order_id` already in `course_purchases` with status `sent` or `enrolled` → return early (idempotency)
2. Upsert `course_purchases` row
3. Look up Supabase auth user by email
   - If found → call `enroll_user_by_id` → update status to `enrolled`
   - If not found → call `create_course_invite` (60-day expiry) → call n8n webhook → update status to `sent`
4. Return `{ success: true, action: "enrolled" | "invited" }`

**Response:**
```json
{ "success": true, "action": "enrolled" | "invited", "order_id": "..." }
```
