import { supabase } from '@/lib/supabase';

const REDEEM_URL =
  'https://blom-cosmetics.co.za/.netlify/functions/redeem-academy-invite';

export async function claimCourseInviteSecurely(token: string) {
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData.session?.access_token;

  if (!accessToken) {
    throw new Error('You must be logged in to claim invites');
  }

  const response = await fetch(REDEEM_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(String(data.error || 'Invite could not be redeemed'));
  }

  return data;
}
