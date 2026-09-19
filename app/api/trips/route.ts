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

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const [{ data: trips, error: tripsError }, { data: companies, error: companiesError }, { data: regions, error: regionsError }, { data: seats, error: seatsError }] = await Promise.all([
      supabaseAdmin.from('trips').select('*'),
      supabaseAdmin.from('companies').select('id, name'),
      supabaseAdmin.from('regions').select('id, name'),
      supabaseAdmin.from('seats').select('trip_id, status'),
    ]);

    const error = tripsError ?? companiesError ?? regionsError ?? seatsError;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      trips: trips ?? [],
      companies: companies ?? [],
      regions: regions ?? [],
      seats: seats ?? [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur de chargement des trajets.' },
      { status: 500 }
    );
  }
}
