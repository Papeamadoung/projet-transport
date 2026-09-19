export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-5 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-slate-900 font-bold text-sm">
              T
            </div>
            <span className="font-bold text-white tracking-tight">TransSénégal</span>
          </div>
          <p className="text-sm leading-relaxed mb-6 max-w-xs">
            Opérateur de réservation de billets de transport interrégional, connectant toutes les régions du Sénégal.
          </p>
          <div className="flex gap-3">
            {['f', 'in', 'ig'].map((s) => (
              <a key={s} href="#" className="w-9 h-9 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center text-xs transition">
                {s}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Navigation</h4>
          <ul className="space-y-2.5 text-sm">
            <li><a href="/" className="hover:text-white transition">Réserver</a></li>
            <li><a href="/infos" className="hover:text-white transition">Info voyageurs</a></li>
            <li><a href="/a-propos" className="hover:text-white transition">Présentation</a></li>
            <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Contact</h4>
          <ul className="space-y-2.5 text-sm">
            <li>+221 33 000 00 00</li>
            <li>contact@transsenegal.sn</li>
            <li>Dakar, Sénégal</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Newsletter</h4>
          <p className="text-sm mb-3">Recevez nos actualités et offres.</p>
          <div className="flex">
            <input
              type="email"
              placeholder="Votre email"
              className="w-full bg-slate-800 border border-slate-700 rounded-l-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none"
            />
            <button className="bg-white text-slate-900 px-4 rounded-r-lg text-sm font-medium">
              OK
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-xs">
          <span>© {new Date().getFullYear()} TransSénégal. Tous droits réservés.</span>
          <span>Réservation sécurisée · Paiement Wave & Orange Money</span>
        </div>
      </div>
    </footer>
  );
}