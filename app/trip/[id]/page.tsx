'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import TripMap from '@/components/TripMap';

type Seat = {
  id: number;
  seatNumber: number;
  status: 'libre' | 'reserve';
};

type Region = {
  id?: number;
  name?: string;
  latitude?: number | null;
  longitude?: number | null;
};

const fallbackRegionCoordinates: Record<string, [number, number]> = {
  Dakar: [14.7167, -17.4677],
  Diourbel: [14.6533, -16.2333],
  Fatick: [14.3333, -16.4167],
  Kaffrine: [14.1167, -15.55],
  Kaolack: [14.1517, -16.0728],
  'Kédougou': [12.56, -12.175],
  Kolda: [12.8833, -14.95],
  Louga: [15.6167, -16.2167],
  Matam: [15.6558, -13.2583],
  'Saint-Louis': [16.0212, -16.4896],
  'Sédhiou': [12.7081, -15.5569],
  Tambacounda: [13.758, -13.758],
  Thiès: [14.7833, -16.9333],
  Ziguinchor: [12.56, -16.27],
};

const getRegionCoordinates = (region: Region | null) => {
  const fallback = region?.name ? fallbackRegionCoordinates[region.name] : undefined;

  return {
    latitude: region?.latitude ?? fallback?.[0] ?? 14.7167,
    longitude: region?.longitude ?? fallback?.[1] ?? -17.4677,
  };
};

export default function SeatSelection() {
  const params = useParams();
  const tripId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [tripInfo, setTripInfo] = useState<any>(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const loadSeats = async () => {
      if (!tripId) return;

      const { data, error } = await supabase
        .from('seats')
        .select('id, seat_number, status')
        .eq('trip_id', tripId)
        .order('seat_number');

      if (error) {
        console.error(error);
      } else {
        setSeats(
          (data ?? []).map((seat: any) => ({
            id: seat.id,
            seatNumber: seat.seat_number,
            status: seat.status,
          }))
        );
      }

      setLoading(false);
    };

    loadSeats();
  }, [tripId]);

  useEffect(() => {
    const loadTripInfo = async () => {
      if (!tripId) return;

      const { data, error } = await supabase
        .from('trips')
        .select(
          `
            id,
            departure_region:departure_region_id ( id, name, latitude, longitude ),
            arrival_region:arrival_region_id ( id, name, latitude, longitude )
          `
        )
        .eq('id', tripId)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setTripInfo(data);
    };

    loadTripInfo();
  }, [tripId]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.status !== 'libre') return;
    setSelectedSeat(seat.id === selectedSeat ? null : seat.id);
    setShowPaymentOptions(false);
  };

  const getSeatColor = (seat: Seat) => {
    if (seat.status !== 'libre') return 'bg-red-400 cursor-not-allowed';
    if (seat.id === selectedSeat) return 'bg-blue-600 text-white';
    return 'bg-green-100 hover:bg-green-200 cursor-pointer';
  };

  const departureRegion = tripInfo?.departure_region ?? null;
  const arrivalRegion = tripInfo?.arrival_region ?? null;
  const departureCoordinates = getRegionCoordinates(departureRegion);
  const arrivalCoordinates = getRegionCoordinates(arrivalRegion);

  const handlePayment = async (method: 'wave' | 'orange_money' = 'wave') => {
    if (!selectedSeat) return;

    setProcessing(true);

    try {
      const response = await fetch('/api/create-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripId,
          seatId: selectedSeat,
          customerName: 'Client',
          customerPhone: '770000000',
          paymentMethod: method,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.bookingId) {
        throw new Error(data?.error ?? 'Impossible de créer la réservation.');
      }

      window.location.href = `/booking/success?ref=${data.bookingId}`;
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur de paiement');
      setProcessing(false);
    }
  };

  if (loading) return <p className="text-center py-20">Chargement des sièges...</p>;

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-md mx-auto px-6">
        <h1 className="text-2xl font-bold text-center mb-2">Choisissez votre siège</h1>
        <p className="text-gray-500 text-center mb-8">Trajet #{tripId}</p>

        {tripInfo && (
          <div className="mb-8">
            <TripMap
              departureLat={departureCoordinates.latitude}
              departureLng={departureCoordinates.longitude}
              arrivalLat={arrivalCoordinates.latitude}
              arrivalLng={arrivalCoordinates.longitude}
              departureName={departureRegion?.name ?? 'Départ'}
              arrivalName={arrivalRegion?.name ?? 'Arrivée'}
            />
          </div>
        )}

        <div className="flex justify-center gap-6 mb-8 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 bg-green-100 rounded"></span> Libre
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 bg-red-400 rounded"></span> Occupé
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 bg-blue-600 rounded"></span> Sélectionné
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-4 gap-3">
            {seats.map((seat) => (
              <button
                key={seat.id}
                onClick={() => handleSeatClick(seat)}
                disabled={seat.status !== 'libre'}
                className={`h-12 rounded-lg font-medium text-sm transition ${getSeatColor(seat)}`}
              >
                {seat.seatNumber}
              </button>
            ))}
          </div>
        </div>

        {selectedSeat && (
          <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
            <p className="text-gray-500 text-sm mb-1 text-center">Siège sélectionné</p>
            <p className="text-2xl font-bold text-blue-600 mb-6 text-center">
              N°{seats.find((s) => s.id === selectedSeat)?.seatNumber}
            </p>

            {!showPaymentOptions ? (
              <button
                onClick={() => setShowPaymentOptions(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
              >
                Continuer vers le paiement
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-500 text-center mb-2">Choisissez votre mode de paiement</p>

                <button
                  onClick={() => handlePayment('wave')}
                  disabled={processing}
                  className="w-full flex items-center justify-center gap-3 bg-[#1DC8E5] hover:opacity-90 disabled:opacity-60 text-white py-3 rounded-lg font-medium"
                >
                  {processing ? 'Traitement...' : 'Payer avec Wave'}
                </button>

                <button
                  onClick={() => handlePayment('orange_money')}
                  disabled={processing}
                  className="w-full flex items-center justify-center gap-3 bg-[#FF6600] hover:opacity-90 disabled:opacity-60 text-white py-3 rounded-lg font-medium"
                >
                  {processing ? 'Traitement...' : 'Payer avec Orange Money'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}