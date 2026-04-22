import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { getSupabaseAdminUntyped } from '@/lib/supabase';
import { generateGoogleWalletLink } from '@/lib/wallet';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> },
) {
  const { ticketId } = await params;
  const session = await auth0.getSession();
  if (!session?.user?.sub) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseAdminUntyped();
  const { data: ticket } = await supabase
    .from('tickets')
    .select(`
      id, qr_code_secret, seat_label,
      event:events!tickets_event_id_fkey (id, title, venue_name, city),
      occurrence:event_occurrences!tickets_occurrence_id_fkey (starts_at, ends_at),
      tier:ticket_tiers!tickets_tier_id_fkey (id, name)
    `)
    .eq('id', ticketId)
    .eq('user_id', session.user.sub)
    .single();

  if (!ticket) {
    return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
  }

  const event = ticket.event as any;
  const occurrence = ticket.occurrence as any;
  const tier = ticket.tier as any;

  const walletUrl = await generateGoogleWalletLink(
    { id: ticket.id, qr_code_secret: ticket.qr_code_secret, seat_label: ticket.seat_label },
    { id: event.id, title: event.title, starts_at: occurrence?.starts_at, ends_at: occurrence?.ends_at, venue_name: event.venue_name, city: event.city },
    { id: tier.id, name: tier.name },
  );

  if (!walletUrl) {
    return NextResponse.json({ error: 'Google Wallet not configured' }, { status: 503 });
  }

  return NextResponse.redirect(walletUrl);
}
