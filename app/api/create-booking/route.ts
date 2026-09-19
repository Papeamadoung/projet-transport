import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Variables Supabase manquantes sur le serveur.');
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

export async function POST(request: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { tripId, seatId, customerName, customerPhone, paymentMethod } = await request.json();

    const { data: seat } = await supabaseAdmin
      .from('seats')
      .select('id, status')
      .eq('id', seatId)
      .single();

    if (!seat || seat.status !== 'libre') {
      return NextResponse.json({ error: 'Siège indisponible' }, { status: 400 });
    }

    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert({
        trip_id: tripId,
        seat_id: seatId,
        customer_name: customerName,
        customer_phone: customerPhone,
        payment_status: 'payé',
        payment_reference: `SIMULATION_${paymentMethod}_${Date.now()}`,
      })
      .select()
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ error: 'Erreur création réservation' }, { status: 500 });
    }

    await supabaseAdmin
      .from('seats')
      .update({ status: 'occupé' })
      .eq('id', seatId);

    return NextResponse.json({ bookingId: booking.id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur.' },
      { status: 500 }
    );
  }
}
