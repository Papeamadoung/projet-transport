import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const { tripId, seatId, customerName, customerPhone, paymentMethod } = await request.json();

  const { data: seat } = await supabaseAdmin
    .from('seats')
    .select('id, status')
    .eq('id', seatId)
    .single();

  if (!seat || seat.status !== 'libre') {
    return NextResponse.json({ error: 'Siège indisponible' }, { status: 400 });
  }

  // Créer la réservation, directement marquée "payée" (simulation)
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

  // Marquer le siège comme occupé
  await supabaseAdmin
    .from('seats')
    .update({ status: 'occupé' })
    .eq('id', seatId);

  return NextResponse.json({ bookingId: booking.id });
}