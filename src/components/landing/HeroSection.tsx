'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, BookOpen } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32 lg:py-40">
      {/* Background Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-lentera-green/5 rounded-full blur-[120px] animate-float-slow pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-lentera-green/3 rounded-full blur-[150px] animate-float pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lentera-surface border border-lentera-border mb-8 animate-fade-up">
            <Sparkles className="w-4 h-4 text-lentera-green" />
            <span className="text-xs font-semibold text-lentera-green tracking-wider uppercase">
              NITRO 2026 — HMTI FTS UMP
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight mb-8 animate-fade-up">
            <span className="text-lentera-text">Belajar Lebih Cerdas.</span>
            <br />
            <span className="text-lentera-green">Berpikir Kultural.</span>
            <br />
            <span className="text-lentera-text">Belajar Tanpa Batas.</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-lentera-text-secondary leading-relaxed max-w-2xl mx-auto mb-12 animate-fade-up font-body">
            Platform pembelajaran adaptif berbasis AI yang mengubah materi akademik kompleks
            menjadi analogi budaya yang mudah dipahami. Dirancang untuk mahasiswa neurodivergent
            dan pembelajar global.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-lentera-green text-lentera-bg font-display font-bold text-base tracking-wider hover:bg-lentera-green-dim active:scale-[0.97] transition-all duration-200 shadow-lg shadow-lentera-green/20 glow-green"
            >
              <BookOpen className="w-5 h-5" />
              Mulai Belajar
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <a
              href="#fitur"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-lentera-border text-lentera-text-secondary font-display font-semibold text-base tracking-wider hover:border-lentera-green-glow hover:text-lentera-green hover:bg-lentera-surface transition-all duration-200"
            >
              Pelajari Lebih Lanjut
            </a>
          </div>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-16 animate-fade-up">
            {['Next.js 16', 'Gemini 2.5 Flash', 'TypeScript', 'Tailwind CSS', 'PWA'].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-full text-[11px] font-medium text-lentera-muted bg-lentera-surface border border-lentera-border"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
