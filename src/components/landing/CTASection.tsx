'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function CTASection() {
  return (
    <section id="tentang" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-lentera-surface border border-lentera-border p-12 md:p-20 text-center overflow-hidden">
          
          {/* Background Orbs */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-lentera-green/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-lentera-green/3 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lentera-green-subtle/30 border border-lentera-green-glow mb-8">
              <Sparkles className="w-4 h-4 text-lentera-green" />
              <span className="text-xs font-bold text-lentera-green tracking-wider">GRATIS & OPEN SOURCE</span>
            </div>

            <h2 className="font-display font-bold text-3xl md:text-5xl text-lentera-text mb-6 leading-tight">
              Siap Mengubah Cara<br />Kamu Belajar?
            </h2>

            <p className="text-lg text-lentera-text-secondary leading-relaxed max-w-xl mx-auto mb-10">
              Tidak perlu registrasi. Langsung paste materi kuliahmu, pilih lensa budaya,
              dan biarkan AI LENTERA mengubahnya menjadi pemahaman yang mendalam.
            </p>

            <Link
              href="/app"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-lentera-green text-lentera-bg font-display font-bold text-lg tracking-wider hover:bg-lentera-green-dim active:scale-[0.97] transition-all duration-200 shadow-xl shadow-lentera-green/25 glow-green-strong"
            >
              Mulai Sekarang
              <ArrowRight className="w-5 h-5" />
            </Link>

            <p className="text-xs text-lentera-muted mt-8">
              Powered by Google Gemini 2.5 Flash — Tidak memerlukan akun
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
