'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const fallbackRegions = [
  'Dakar',
  'Diourbel',
  'Fatick',
  'Kaffrine',
  'Kaolack',
  'Kédougou',
  'Kolda',
  'Louga',
  'Matam',
  'Saint-Louis',
  'Sédhiou',
  'Tambacounda',
  'Thiès',
  'Ziguinchor',
].map((name, index) => ({ id: index + 1, name }));

export default function Home() {
  const [regions, setRegions] = useState<any[]>(fallbackRegions);
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [trips, setTrips] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [regionsError, setRegionsError] = useState('');
  const displayRegions = regions.length > 0 ? regions : fallbackRegions;

  useEffect(() => {
    const loadRegions = async () => {
      const { data, error } = await supabase.from('regions').select('id, name').order('name');

      if (error) {
        setRegionsError('Impossible de charger les régions.');
        setRegions(fallbackRegions);
        return;
      }

      setRegions(data?.length ? data : fallbackRegions);
    };

    loadRegions();
  }, []);

  const handleSearch = async () => {
    setSearching(true);

    const [{ data: rawTrips, error: tripsError }, { data: companies = [] }, { data: allRegions = [] }, { data: seatRows = [] }] = await Promise.all([
      supabase.from('trips').select('*'),
      supabase.from('companies').select('id, name'),
      supabase.from('regions').select('id, name'),
      supabase.from('seats').select('trip_id, status'),
    ]);

    if (tripsError) {
      setTrips([]);
      setSearched(true);
      setSearching(false);
      return;
    }

    const regionMap = new Map<number, string>((allRegions as Array<{ id: number; name: string }>).map((region) => [region.id, region.name]));
    const companyMap = new Map<number, string>((companies as Array<{ id: number; name: string }>).map((company) => [company.id, company.name]));
    const availableSeatsByTrip = new Map<number, number>();

    (seatRows as Array<{ trip_id: number; status: string }>).forEach((seat) => {
      if (seat.status === 'libre') {
        availableSeatsByTrip.set(seat.trip_id, (availableSeatsByTrip.get(seat.trip_id) ?? 0) + 1);
      }
    });

    const filteredTrips = (rawTrips as any[])
      .filter((trip) => {
        if (departure && String(trip.departure_region_id) !== departure) return false;
        if (arrival && String(trip.arrival_region_id) !== arrival) return false;
        return true;
      })
      .map((trip) => ({
        id: trip.id,
        company: companyMap.get(trip.company_id) ?? 'Compagnie',
        departureRegion: regionMap.get(trip.departure_region_id) ?? 'Inconnu',
        arrivalRegion: regionMap.get(trip.arrival_region_id) ?? 'Inconnu',
        departureTime: new Date(trip.departure_time).toLocaleString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
        duration: trip.duration,
        price: trip.price,
        totalSeats: trip.total_seats,
        availableSeats: availableSeatsByTrip.get(trip.id) ?? 0,
      }));

    setTrips(filteredTrips);
    setSearched(true);
    setSearching(false);
  };

  return (
    <div className="bg-white">
                 {/* HERO */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        ></div>

        <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
            Plateforme officielle de réservation
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            Votre billet de transport,<br className="hidden md:block" /> réservé en 2 minutes
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto mb-10 text-sm md:text-base">
            Comparez les compagnies, choisissez votre siège, payez avec Wave ou Orange Money.
          </p>

          <div className="bg-white rounded-xl p-4 md:p-5 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="text-left">
                <label className="text-xs font-medium text-gray-500 block mb-1">Départ</label>
                <select
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-3 text-gray-800 text-sm"
                >
                  <option value="">Choisir une ville</option>
                  {displayRegions.map((r: any) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div className="text-left">
                <label className="text-xs font-medium text-gray-500 block mb-1">Arrivée</label>
                <select
                  value={arrival}
                  onChange={(e) => setArrival(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-3 text-gray-800 text-sm"
                >
                  <option value="">Choisir une ville</option>
                  {displayRegions.map((r: any) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  disabled={searching}
                  className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white py-3 rounded-lg font-medium transition text-sm"
                >
                  {searching ? 'Recherche...' : 'Rechercher un trajet'}
                </button>
              </div>
            </div>
            {regionsError && (
              <p className="mt-3 text-sm text-red-600 text-center">{regionsError}</p>
            )}
            {!regionsError && regions.length === 0 && (
              <p className="mt-3 text-sm text-amber-700 text-center">
                Aucune ville n&apos;est encore disponible.
              </p>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mt-8 text-xs text-slate-400">
            <span>✓ Paiement sécurisé</span>
            <span>✓ Choix du siège</span>
            <span>✓ 3 compagnies partenaires</span>
          </div>
        </div>
      </section>
            {/* BANNIÈRE D'ALERTE INFO */}
      {!searched && (
        <div className="bg-amber-50 border-b border-amber-100 py-2.5 overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 flex items-center gap-3 text-xs text-amber-800">
            <span className="font-semibold flex-shrink-0">Info voyageurs</span>
            <span className="truncate">Nouveaux trajets disponibles vers Ziguinchor et Tambacounda — réservez dès maintenant votre place.</span>
          </div>
        </div>
      )}

      {/* RÉSULTATS DE RECHERCHE */}
      {searched && (
        <section className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-lg font-bold text-slate-900 mb-6">
            {trips.length > 0 ? `${trips.length} trajet(s) trouvé(s)` : 'Résultats'}
          </h2>

          {trips.length === 0 && (
            <div className="bg-slate-50 rounded-xl p-8 text-center text-gray-500 text-sm">
              Aucun trajet trouvé pour cette recherche. Essayez d'autres villes.
            </div>
          )}

          <div className="space-y-3">
            {trips.map((trip: any) => (
              <div key={trip.id} className="border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-slate-900">{trip.company}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    {trip.departureRegion} → {trip.arrivalRegion}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Départ : {trip.departureTime} · {Math.floor(trip.duration / 60)}h{trip.duration % 60 > 0 ? trip.duration % 60 : ''}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    {trip.availableSeats} places disponibles / {trip.totalSeats}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xl font-bold text-slate-900">{trip.price.toLocaleString()} FCFA</p>
                  <Link
                    href={`/trip/${trip.id}`}
                    className="mt-2 inline-block bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-lg text-sm font-medium"
                  >
                    Choisir un siège
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* OFFRES DE TRANSPORT */}
      {!searched && (
        <section className="max-w-5xl mx-auto px-6 py-16 border-b border-gray-100">
          <p className="text-gray-400 font-medium text-xs uppercase tracking-wide text-center mb-2">
            Nos offres
          </p>
          <h2 className="text-xl font-bold text-slate-900 mb-10 text-center">
            Découvrez nos offres de transport
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Trajets urbains', desc: "Déplacez-vous facilement à l'intérieur de Dakar et des grandes villes." },
              { title: 'Trajets interrégionaux', desc: 'Rejoignez toutes les régions du Sénégal avec plusieurs compagnies partenaires.' },
              { title: 'Service Express', desc: 'Trajets rapides et confortables pour vos déplacements urgents.' },
            ].map((offer) => (
              <div key={offer.title} className="border border-gray-200 rounded-xl p-6 hover:border-slate-300 transition">
                <h3 className="font-bold text-slate-900 mb-2">{offer.title}</h3>
                <p className="text-gray-500 text-sm">{offer.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* STATISTIQUES */}
      {!searched && (
        <section className="max-w-5xl mx-auto px-6 py-16 border-b border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-slate-900">50K+</p>
              <p className="text-gray-500 text-sm mt-1">Voyageurs</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">6</p>
              <p className="text-gray-500 text-sm mt-1">Destinations</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">98%</p>
              <p className="text-gray-500 text-sm mt-1">Clients satisfaits</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">3</p>
              <p className="text-gray-500 text-sm mt-1">Compagnies partenaires</p>
            </div>
          </div>
        </section>
      )}
            {/* SERVICES */}
      {!searched && (
        <section className="max-w-5xl mx-auto px-6 py-16 border-b border-gray-100">
          <p className="text-gray-400 font-medium text-xs uppercase tracking-wide text-center mb-2">
            Services
          </p>
          <h2 className="text-xl font-bold text-slate-900 mb-10 text-center">
            Découvrez nos offres de services
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { title: 'Réservation en ligne', desc: 'Achetez votre billet depuis le site, sans passer par un guichet.' },
              { title: 'Choix du siège', desc: 'Sélectionnez votre siège comme au cinéma, avant de payer.' },
              { title: 'Paiement mobile', desc: 'Wave et Orange Money acceptés pour tous vos trajets.' },
              { title: 'Suivi de réservation', desc: 'Recevez une confirmation immédiate après paiement.' },
              { title: 'Plusieurs compagnies', desc: 'Comparez les horaires et prix en un seul endroit.' },
              { title: 'Assistance client', desc: 'Une équipe disponible pour vous accompagner.' },
            ].map((service) => (
              <div key={service.title} className="p-5">
                <h3 className="font-bold text-slate-900 text-sm mb-1.5">{service.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* VOYAGEZ EN TOUTE SÉCURITÉ */}
      {!searched && (
        <section className="bg-slate-50 border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-gray-400 font-medium text-xs uppercase tracking-wide mb-2">
                TransSénégal
              </p>
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Voyagez avec nous en toute sécurité
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Les habitudes de mobilité évoluent, c'est pourquoi TransSénégal s'engage à
                opérer des services de transport qui répondent aux besoins de tous les
                voyageurs, avec des compagnies partenaires fiables et vérifiées.
              </p>
            </div>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4 flex justify-between items-center border border-gray-200">
                <span className="text-sm text-gray-600">Réservations générales</span>
                <span className="text-sm font-semibold text-slate-900">+221 33 000 00 00</span>
              </div>
              <div className="bg-white rounded-lg p-4 flex justify-between items-center border border-gray-200">
                <span className="text-sm text-gray-600">Service Express</span>
                <span className="text-sm font-semibold text-slate-900">+221 78 000 00 00</span>
              </div>
              <div className="bg-white rounded-lg p-4 flex justify-between items-center border border-gray-200">
                <span className="text-sm text-gray-600">Support client</span>
                <span className="text-sm font-semibold text-slate-900">+221 77 000 00 00</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ACTUALITÉS RÉCENTES */}
      {!searched && (
        <section className="max-w-5xl mx-auto px-6 py-16 border-b border-gray-100">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-gray-400 font-medium text-xs uppercase tracking-wide mb-2">
                Actualités
              </p>
              <h2 className="text-xl font-bold text-slate-900">Nos dernières actualités</h2>
            </div>
            <Link href="/infos" className="text-sm text-slate-600 hover:text-slate-900 font-medium">
              Voir toute l'actualité →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { date: '15 sept. 2026', title: 'Nouveaux trajets vers Tambacounda et Ziguinchor' },
              { date: '10 sept. 2026', title: '7 nouveaux arrêts ajoutés sur nos lignes interrégionales' },
              { date: '2 sept. 2026', title: 'TransSénégal renforce son réseau de compagnies partenaires' },
            ].map((news) => (
              <Link key={news.title} href="/infos" className="border border-gray-200 rounded-xl p-5 hover:border-slate-300 transition block">
                <p className="text-xs text-gray-400 mb-2">{news.date}</p>
                <h3 className="font-semibold text-slate-900 text-sm leading-snug">{news.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* POURQUOI NOUS CHOISIR */}
      {!searched && (
        <section className="max-w-5xl mx-auto px-6 py-16 border-b border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div>
              <h3 className="font-bold text-slate-900 mb-2">Réservation simple</h3>
              <p className="text-gray-500 text-sm">Choisissez votre trajet et votre siège en quelques clics.</p>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-2">Paiement mobile</h3>
              <p className="text-gray-500 text-sm">Payez directement avec Wave ou Orange Money.</p>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-2">Plusieurs compagnies</h3>
              <p className="text-gray-500 text-sm">Comparez les horaires et les prix de plusieurs compagnies.</p>
            </div>
          </div>
        </section>
      )}

      {/* CTA FINAL */}
      {!searched && (
        <section className="max-w-5xl mx-auto px-6 py-16 text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-3">
            Vous cherchez le meilleur service de transport ?
          </h2>
          <p className="text-gray-500 mb-8 text-sm">
            Voyagez partout au Sénégal en toute sécurité
          </p>
          <a href="#" className="inline-block bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-lg font-medium text-sm">
            Réservez une place
          </a>
        </section>
      )}
    </div>
  );
}