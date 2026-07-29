// This legacy Store-project function previously duplicated the current
// Netlify course-fulfilment path. It is intentionally retired so one paid
// order can create and deliver only one Academy invitation.
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://blom-cosmetics.co.za',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
}

Deno.serve((req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  return new Response(
    JSON.stringify({
      error: 'This legacy course fulfilment endpoint has been retired.',
    }),
    { status: 410, headers: corsHeaders },
  )
})
