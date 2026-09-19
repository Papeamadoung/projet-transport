'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="bg-slate-900 text-slate-400 text-xs py-2 hidden md:block">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="flex gap-6">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              +221 76 337 70 79
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Dakar, Sénégal
            </span>
          </div>
          <span>Lundi - Samedi · 07h - 20h</span>
        </div>
      </div>

      <nav className="bg-white/95 backdrop-blur border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                T
              </div>
              <span className="font-bold text-slate-900 tracking-tight">TransSénégal</span>
            </Link>

            <div className="hidden md:flex items-center gap-9">
              <Link href="/" className="text-gray-600 hover:text-slate-900 text-sm font-medium transition">
                Réserver
              </Link>
              <Link href="/infos" className="text-gray-600 hover:text-slate-900 text-sm font-medium transition">
                Info voyageurs
              </Link>
              <Link href="/a-propos" className="text-gray-600 hover:text-slate-900 text-sm font-medium transition">
                Présentation
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-slate-900 text-sm font-medium transition">
                Contact
              </Link>
            </div>

            <Link
              href="/"
              className="hidden md:inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
            >
              Réserver une place
            </Link>

            <button onClick={() => setOpen(!open)} className="md:hidden text-slate-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {open && (
            <div className="md:hidden pb-4 space-y-1 border-t border-gray-100 pt-3">
              <Link href="/" className="block text-gray-600 text-sm font-medium py-2">Réserver</Link>
              <Link href="/infos" className="block text-gray-600 text-sm font-medium py-2">Info voyageurs</Link>
              <Link href="/a-propos" className="block text-gray-600 text-sm font-medium py-2">Présentation</Link>
              <Link href="/contact" className="block text-gray-600 text-sm font-medium py-2">Contact</Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}