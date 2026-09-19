'use client';

import { useState, FormEvent } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Pour l'instant, juste un affichage de confirmation
    // On branchera l'envoi réel (email ou base) une fois sur Supabase
    setSubmitted(true);
  };

  return (
    <div className="bg-white">
      {/* En-tête */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <p className="text-slate-400 font-medium uppercase text-xs tracking-widest mb-3">
            Contact
          </p>
          <h1 className="text-3xl md:text-4xl font-bold">
            Une question ? Contactez-nous
          </h1>
        </div>
      </section>

      {/* Contenu */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Infos pratiques */}
          <div>
            <h2 className="font-bold text-slate-900 mb-6">Nos coordonnées</h2>
            <div className="space-y-5">
              <div>
                <p className="text-xs text-gray-400 mb-1">Téléphone</p>
                <p className="text-sm text-slate-900 font-medium">+221 76 337 70 79</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Email</p>
                <p className="text-sm text-slate-900 font-medium">Papeamadouniang1@transsenegal.sn</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Adresse</p>
                <p className="text-sm text-slate-900 font-medium">Dakar, Sénégal</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Horaires</p>
                <p className="text-sm text-slate-900 font-medium">Lundi - Samedi · 07h - 20h</p>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div>
            {submitted ? (
              <div className="bg-slate-50 rounded-xl p-8 text-center">
                <p className="font-bold text-slate-900 mb-2">Message envoyé !</p>
                <p className="text-gray-500 text-sm">Nous vous répondrons dans les plus brefs délais.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Nom</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-800"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg font-medium text-sm"
                >
                  Envoyer le message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}