import Link from 'next/link';

export default function AProposPage() {
  return (
    <div className="bg-white">
      {/* En-tête */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <p className="text-slate-400 font-medium uppercase text-xs tracking-widest mb-3">
            Présentation
          </p>
          <h1 className="text-3xl md:text-4xl font-bold">
            Qui sommes-nous ?
          </h1>
        </div>
      </section>

      {/* Présentation générale */}
      <section className="max-w-4xl mx-auto px-6 py-16 border-b border-gray-100">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-gray-400 font-medium text-xs uppercase tracking-wide mb-2">
              Notre mission
            </p>
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Faciliter le transport interrégional au Sénégal
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              TransSénégal est une plateforme de réservation qui connecte les voyageurs
              aux compagnies de transport partenaires à travers tout le pays. Notre
              objectif est de rendre la réservation de billets simple, rapide et
              accessible à tous, avec un choix de siège et un paiement mobile intégré.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-6 text-center">
              <p className="text-2xl font-bold text-slate-900">6</p>
              <p className="text-gray-500 text-xs mt-1">Régions desservies</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6 text-center">
              <p className="text-2xl font-bold text-slate-900">3</p>
              <p className="text-gray-500 text-xs mt-1">Compagnies partenaires</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6 text-center">
              <p className="text-2xl font-bold text-slate-900">50K+</p>
              <p className="text-gray-500 text-xs mt-1">Voyageurs</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6 text-center">
              <p className="text-2xl font-bold text-slate-900">98%</p>
              <p className="text-gray-500 text-xs mt-1">Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Nos valeurs */}
      <section className="max-w-4xl mx-auto px-6 py-16 border-b border-gray-100">
        <p className="text-gray-400 font-medium text-xs uppercase tracking-wide text-center mb-2">
          Nos valeurs
        </p>
        <h2 className="text-xl font-bold text-slate-900 mb-10 text-center">
          Ce qui nous engage
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-slate-900 mb-2">Fiabilité</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Toutes nos compagnies partenaires respectent une charte commune de sécurité et de ponctualité.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-2">Simplicité</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Réserver un billet doit être aussi simple que quelques clics, sans passer par un guichet.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-2">Accessibilité</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Un paiement mobile adapté au Sénégal, avec Wave et bientôt Orange Money.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <p className="text-gray-500 text-sm mb-4">
            Prêt à voyager avec nous ?
          </p>
          <Link
            href="/"
            className="inline-block bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-medium text-sm"
          >
            Réservez votre billet
          </Link>
        </div>
      </section>
    </div>
  );
}