'use client'

import { Globe, Brain, Gamepad2, AudioLines } from 'lucide-react'

const FEATURES = [
  {
    icon: Globe,
    title: 'Lensa Budaya',
    subtitle: '50+ Lensa Tersedia',
    description:
      'Pahami teori akademik melalui analogi budaya yang relevan — dari wayang Jawa hingga filosofi Minangkabau. AI mencocokkan bahasa input secara otomatis.',
    badge: 'AI-LANG',
    accentClass: 'text-lentera-green',
    large: true,
  },
  {
    icon: Brain,
    title: 'Ramah Disleksia',
    subtitle: 'Arsitektur Neurodivergent',
    description:
      'Kalimat pendek (maks 15 kata), kata kunci ditebalkan, spasi longgar, dan hierarki visual yang jelas. Dirancang untuk otak yang berbeda.',
    badge: 'AKSESIBILITAS',
    accentClass: 'text-blue-400',
    large: false,
  },
  {
    icon: Gamepad2,
    title: 'Kuis Mikro',
    subtitle: 'Gamifikasi Belajar',
    description:
      'Uji pemahaman dengan 3 pertanyaan pilihan ganda yang menyelipkan analogi budaya. Feedback langsung dengan penjelasan kontekstual.',
    badge: 'GAMIFIED',
    accentClass: 'text-purple-400',
    large: false,
  },
  {
    icon: AudioLines,
    title: 'Multimodal TTS',
    subtitle: 'Dengarkan & Sorot',
    description:
      'Baca sekaligus dengarkan dengan Text-to-Speech terintegrasi. Kata yang sedang dibaca di-highlight kuning untuk sinkronisasi baca-dengar.',
    badge: 'AUDIO',
    accentClass: 'text-lentera-warning-soft',
    large: true,
  },
]

export default function FeaturesSection() {
  return (
    <section id="fitur" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold text-lentera-green tracking-[0.2em] uppercase mb-4">
            Fitur Utama
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-lentera-text mb-4">
            Belajar yang Dirancang Untukmu
          </h2>
          <p className="text-lentera-text-secondary text-base leading-relaxed">
            Setiap fitur dibangun dengan satu tujuan: membuat materi akademik kompleks menjadi
            mudah dipahami, personal, dan tidak membuat stres.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className={`group relative bg-lentera-surface border border-lentera-border rounded-2xl md:rounded-3xl p-8 md:p-10 hover:border-lentera-border2 transition-all duration-300 overflow-hidden
                  ${feature.large ? 'md:col-span-2 lg:col-span-1' : ''}`}
              >
                {/* Subtle glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-lentera-green/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  {/* Badge */}
                  <span className="inline-block text-[10px] font-bold tracking-[0.15em] text-lentera-muted bg-lentera-surface2 border border-lentera-border px-3 py-1 rounded-full mb-6">
                    {feature.badge}
                  </span>

                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-lentera-surface2 border border-lentera-border flex items-center justify-center mb-5 ${feature.accentClass} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-xl text-lentera-text mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-lentera-muted font-semibold uppercase tracking-wider mb-4">
                    {feature.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-lentera-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
