'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full text-center">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 text-2xl">
          ✓
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Réservation confirmée !</h1>
        <p className="text-gray-500 text-sm mb-6">
          Référence de réservation : <span className="font-medium text-slate-900">#{ref}</span>
        </p>
        <Link
          href="/"
          className="inline-block bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg text-sm font-medium"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
      <BookingSuccessContent />
    </Suspense>
  );
}
