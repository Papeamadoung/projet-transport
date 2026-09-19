import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { tripId, seatId, customerName, customerPhone } = await request.json();
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const [{ data: trip }, { data: seat }] = await Promise.all([
      supabase.from('trips').select('id, price').eq('id', tripId).single(),
      supabase.from('seats').select('id, status').eq('id', seatId).single(),
    ]);

    if (!trip || !seat || seat.status !== 'libre') {
      return Response.json({ error: 'Trajet ou siège indisponible.' }, { status: 400, headers: corsHeaders });
    }

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        trip_id: tripId,
        seat_id: seatId,
        customer_name: customerName,
        customer_phone: customerPhone,
      })
      .select('id')
      .single();

    if (bookingError || !booking) throw bookingError ?? new Error('Réservation impossible.');

    const appUrl = Deno.env.get('APP_URL') ?? 'http://localhost:3000';
    const waveResponse = await fetch('https://api.wave.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${Deno.env.get('WAVE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: String(trip.price),
        currency: 'XOF',
        client_reference: `booking_${booking.id}`,
        success_url: `${appUrl}/booking/success?ref=${booking.id}`,
        error_url: `${appUrl}/booking/error?ref=${booking.id}`,
      }),
    });

    if (!waveResponse.ok) throw new Error(await waveResponse.text());
    const wave = await waveResponse.json();

    await supabase.from('bookings').update({ payment_reference: wave.id }).eq('id', booking.id);
    await supabase.from('seats').update({ status: 'reserve' }).eq('id', seatId).eq('status', 'libre');

    return Response.json({ waveLaunchUrl: wave.wave_launch_url }, { headers: corsHeaders });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Erreur de paiement.' }, { status: 500, headers: corsHeaders });
  }
});
