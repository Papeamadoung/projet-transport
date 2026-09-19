import Link from 'next/link';

const allNews = [
  {
    id: 1,
    date: '15 sept. 2026',
    category: 'Nouveautés',
    title: 'Nouveaux trajets vers Tambacounda et Ziguinchor',
    excerpt: "TransSénégal élargit son réseau avec de nouveaux départs quotidiens vers l'est et le sud du pays, en partenariat avec Baobab Lines.",
  },
  {
    id: 2,
    date: '10 sept. 2026',
    category: 'Réseau',
    title: '7 nouveaux arrêts ajoutés sur nos lignes interrégionales',
    excerpt: "Pour faciliter l'accès au transport, plusieurs nouveaux points d'arrêt ont été ajoutés sur les trajets Dakar-Thiès et Dakar-Kaolack.",
  },
  {
    id: 3,
    date: '2 sept. 2026',
    category: 'Partenariats',
    title: 'TransSénégal renforce son réseau de compagnies partenaires',
    excerpt: 'Une nouvelle compagnie rejoint la plateforme pour proposer davantage de créneaux horaires sur les trajets les plus demandés.',
  },
  {
    id: 4,
    date: '28 août 2026',
    category: 'Paiement',
    title: 'Le paiement Orange Money bientôt disponible',
    excerpt: "En plus de Wave, l'intégration Orange Money est en cours de déploiement pour encore plus de flexibilité au moment de payer.",
  },
  {
    id: 5,
    date: '20 août 2026',
    category: 'Sécurité',
    title: 'Renforcement des contrôles de sécurité sur nos trajets',
    excerpt: 'Toutes les compagnies partenaires respectent désormais une charte commune de sécurité et de ponctualité.',
  },
];

export default function InfosPage() {
  return (
    <div className="bg-white">
      {/* En-tête de page */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <p className="text-slate-400 font-medium uppercase text-xs tracking-widest mb-3">
            Info voyageurs
          </p>
          <h1 className="text-3xl md:text-4xl font-bold">
            Nos dernières actualités
          </h1>
        </div>
      </section>

      {/* Liste des actualités */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-8">
          {allNews.map((news) => (
            <article key={news.id} className="border-b border-gray-100 pb-8 last:border-0">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-medium text-slate-900 bg-slate-100 px-2.5 py-1 rounded-full">
                  {news.category}
                </span>
                <span className="text-xs text-gray-400">{news.date}</span>
              </div>
              <h2 className="font-bold text-lg text-slate-900 mb-2">
                {news.title}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                {news.excerpt}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* CTA retour réservation */}
      <section className="bg-slate-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <p className="text-gray-500 text-sm mb-4">
            Prêt à voyager ?
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
