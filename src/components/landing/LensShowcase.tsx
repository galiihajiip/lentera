'use client'

const LENSES_ROW_1 = [
  { emoji: '🌴', label: 'Nusantara', region: 'Lintas Indonesia' },
  { emoji: '🕌', label: 'Aceh', region: 'Sumatera' },
  { emoji: '☕', label: 'Gayo', region: 'Sumatera' },
  { emoji: '🎶', label: 'Batak Toba', region: 'Sumatera' },
  { emoji: '🏠', label: 'Minangkabau', region: 'Sumatera' },
  { emoji: '📜', label: 'Melayu Riau', region: 'Sumatera' },
  { emoji: '🎭', label: 'Jawa Mataraman', region: 'Jawa' },
  { emoji: '🎵', label: 'Sunda', region: 'Jawa' },
  { emoji: '🎪', label: 'Betawi', region: 'Jawa' },
  { emoji: '🐂', label: 'Madura', region: 'Jawa' },
  { emoji: '💃', label: 'Bali', region: 'Bali & Nusra' },
  { emoji: '🐎', label: 'Sumba', region: 'Bali & Nusra' },
  { emoji: '🎸', label: 'Sasak', region: 'Bali & Nusra' },
  { emoji: '🌋', label: 'Tengger', region: 'Jawa' },
]

const LENSES_ROW_2 = [
  { emoji: '⚔️', label: 'Dayak Kenyah', region: 'Kalimantan' },
  { emoji: '🏘️', label: 'Dayak Ngaju', region: 'Kalimantan' },
  { emoji: '⛵', label: 'Banjar', region: 'Kalimantan' },
  { emoji: '🚢', label: 'Bugis', region: 'Sulawesi' },
  { emoji: '🏔️', label: 'Toraja', region: 'Sulawesi' },
  { emoji: '🎼', label: 'Minahasa', region: 'Sulawesi' },
  { emoji: '🤝', label: 'Ambon', region: 'Maluku' },
  { emoji: '🌿', label: 'Ternate', region: 'Maluku' },
  { emoji: '🗿', label: 'Asmat', region: 'Papua' },
  { emoji: '🏕️', label: 'Dani', region: 'Papua' },
  { emoji: '👜', label: 'Mee', region: 'Papua' },
  { emoji: '🏡', label: 'Korowai', region: 'Papua' },
  { emoji: '🎨', label: 'Sentani', region: 'Papua' },
  { emoji: '🛶', label: 'Biak', region: 'Papua' },
]

function MarqueeRow({ items, reverse = false }: { items: typeof LENSES_ROW_1; reverse?: boolean }) {
  const doubled = [...items, ...items]
  return (
    <div className="overflow-hidden">
      <div className={`flex gap-4 ${reverse ? 'animate-marquee2' : 'animate-marquee'}`}>
        {doubled.map((lens, i) => (
          <div
            key={`${lens.label}-${i}`}
            className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-lentera-surface border border-lentera-border shrink-0 hover:border-lentera-green-glow hover:bg-lentera-surface2 transition-all duration-300 group cursor-default"
          >
            <span className="text-xl group-hover:scale-125 transition-transform">{lens.emoji}</span>
            <div>
              <p className="text-sm font-semibold text-lentera-text group-hover:text-lentera-green transition-colors">
                {lens.label}
              </p>
              <p className="text-[10px] text-lentera-muted">{lens.region}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function LensShowcase() {
  return (
    <section className="py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-bold text-lentera-green tracking-[0.2em] uppercase mb-4">
            Lensa Budaya
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-lentera-text mb-4">
            85+ Lensa dari Sabang sampai Merauke
          </h2>
          <p className="text-lentera-text-secondary text-base leading-relaxed">
            Dari kearifan Aceh hingga tradisi Papua. Pilih lensa budaya yang paling
            dekat dengan akar budayamu untuk memahami materi akademik.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <MarqueeRow items={LENSES_ROW_1} />
        <MarqueeRow items={LENSES_ROW_2} reverse />
      </div>
    </section>
  )
}
