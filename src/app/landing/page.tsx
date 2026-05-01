'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Gambar from 'next/image'
import LogoMark from '@/components/LogoMark'
import Footer from '@/components/Footer'


const LENSES_ROW_1 = [
  { id: 'nusantara', emoji: '🏝️', label: 'Nusantara', region: 'Umum' },
  { id: 'aceh', emoji: '🕌', label: 'Aceh', region: 'Sumatera' },
  { id: 'minangkabau', emoji: '🍛', label: 'Minangkabau', region: 'Sumatera' },
  { id: 'jawa_mataraman', emoji: '🎎', label: 'Jawa Mataraman', region: 'Jawa' },
  { id: 'sunda', emoji: '🎶', label: 'Sunda', region: 'Jawa' },
  { id: 'betawi', emoji: '🪆', label: 'Betawi', region: 'Jawa' },
  { id: 'bali', emoji: '🪷', label: 'Bali', region: 'Bali & Nusa Tenggara' },
  { id: 'sasak', emoji: '🎣', label: 'Sasak', region: 'Bali & Nusa Tenggara' },
  { id: 'dayak_kenyah', emoji: '🎭', label: 'Dayak Kenyah', region: 'Kalimantan' },
  { id: 'banjar', emoji: '🛶', label: 'Banjar', region: 'Kalimantan' },
  { id: 'bugis', emoji: '⛵', label: 'Bugis', region: 'Sulawesi' },
  { id: 'toraja', emoji: '⚰️', label: 'Toraja', region: 'Sulawesi' },
]

const LENSES_ROW_2 = [
  { id: 'minahasa', emoji: '🎵', label: 'Minahasa', region: 'Sulawesi' },
  { id: 'ambon', emoji: '🥁', label: 'Ambon', region: 'Maluku' },
  { id: 'ternate', emoji: '🏰', label: 'Ternate', region: 'Maluku' },
  { id: 'asmat', emoji: '🪵', label: 'Asmat', region: 'Papua' },
  { id: 'dani', emoji: '🌾', label: 'Dani', region: 'Papua' },
  { id: 'biak', emoji: '🛶', label: 'Biak', region: 'Papua' },
  { id: 'madura', emoji: '🐂', label: 'Madura', region: 'Jawa' },
  { id: 'tengger', emoji: '🌄', label: 'Tengger', region: 'Jawa' },
  { id: 'batak_toba', emoji: '🎭', label: 'Batak Toba', region: 'Sumatera' },
  { id: 'palembang', emoji: '🐟', label: 'Palembang', region: 'Sumatera' },
  { id: 'kutai', emoji: '👑', label: 'Kutai', region: 'Kalimantan' },
  { id: 'baduy', emoji: '🌾', label: 'Baduy', region: 'Jawa' },
]

// ── TESTIMONIALS DATA ──
const TESTIMONIALS = [
  {
    name: "Budi Santoso",
    university: "Universitas Indonesia",
    initial: "B",
    color: "green",
    quote: "Lensa Nusantara membuat materi termodinamika langsung masuk akal. Menjelaskan entropi melalui konsep kekacauan pasar tradisional memberi saya gambaran mental yang luar biasa.",
    stars: 5,
  },
  {
    name: "Siti Rahmawati",
    university: "Institut Teknologi Bandung",
    initial: "S",
    color: "blue",
    quote: "Lensa Japanese menjelaskan supply and demand menggunakan ekonomi produksi anime. Saya jadi benar-benar menikmati belajar. Fitur kuisnya membuat saya tetap fokus.",
    stars: 5,
  },
  {
    name: "I Wayan Suardana",
    university: "Universitas Udayana",
    initial: "W",
    color: "purple",
    quote: "Sebagai seseorang dengan disleksia, hasil format dari LENTERA sangat luar biasa. Kalimat pendek, kata kunci ditebalkan, dan spasi lebar. LENTERA luar biasa.",
    stars: 5,
  },
  {
    name: "Andi Manggala",
    university: "Universitas Hasanuddin",
    initial: "A",
    color: "amber",
    quote: "Analogi Nusantara tentang sistem komputasi terdistribusi benar-benar jenius. Fitur baca otomatis (TTS) dengan sorotan kata sangat mempermudah saya.",
    stars: 5,
  },
  {
    name: "Ahmad Fauzi",
    university: "Universitas Gadjah Mada",
    initial: "A",
    color: "teal",
    quote: "Lensa Islamic untuk perilaku organisasi mengubah cara saya memahami teori manajemen. Glosarium dua bahasanya adalah penyelamat untuk istilah-istilah teknis.",
    stars: 5,
  },
  {
    name: "Dewi Lestari",
    university: "Universitas Airlangga",
    initial: "D",
    color: "green",
    quote: "Lensa Nusantara untuk filsafat sangat luar biasa. Menjelaskan metode Sokrates melalui analogi musyawarah desa membuat dosen saya terkagum-kagum.",
    stars: 5,
  },
  {
    name: "Rina Permatasari",
    university: "Universitas Diponegoro",
    initial: "R",
    color: "blue",
    quote: "LENTERA menjelaskan jaringan saraf tiruan menggunakan konsep sistem subak di Bali. Sebagai mahasiswa biasa, jembatan budaya ini membuat konsep AI menjadi masuk akal.",
    stars: 5,
  },
  {
    name: "Fajar Pratama",
    university: "Universitas Padjadjaran",
    initial: "F",
    color: "amber",
    quote: "Lensa budaya untuk pemikiran sistem adalah sebuah revolusi. Menjelaskan interdependensi melalui gotong royong memberi saya kerangka kerja yang mudah dipahami.",
    stars: 5,
  },
]

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible')
      })
    }, { threshold: 0.1 })

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="bg-lentera-bg text-lentera-text min-h-screen relative overflow-hidden selection:bg-lentera-green selection:text-lentera-bg font-body">
      <style jsx global>{`
        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .orb { pointer-events: none; z-index: 0; filter: blur(80px); position: absolute; }
      `}</style>

      {/* Noise Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[60] opacity-[0.04]"
        style={{ backgroundGambar: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      {/* Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute inset-0 animate-pulse bg-[length:60px_60px]"
          style={{
            backgroundGambar: 'linear-gradient(#1a2a1a 1px, transparent 1px), linear-gradient(90deg, #1a2a1a 1px, transparent 1px)',
            maskGambar: 'radial-gradient(circle at center, black, transparent 80%)',
            WebkitMaskGambar: 'radial-gradient(circle at center, black, transparent 80%)',
            opacity: 0.2
          }}
        />
        {/* Floating Orbs */}
        <div className="orb w-[500px] h-[500px] bg-lentera-green/10 top-[-100px] left-[-100px] animate-float" />
        <div className="orb w-[600px] h-[400px] bg-lentera-green/5 bottom-[100px] right-[-200px] animate-orb" />
        <div className="orb w-[300px] h-[300px] bg-lentera-green/5 top-[30%] left-[50%] animate-float" />
      </div>


      <nav className="fixed top-0 inset-x-0 h-16 bg-lentera-bg/80 backdrop-blur-xl border-b border-lentera-border flex items-center justify-between px-[5%] z-[100]">
        <Link href="/" className="flex items-center gap-4 group">
          <LogoMark />
          <div className="flex flex-col">
            <span className="font-display font-bold text-lentera-green text-lg tracking-wider leading-none uppercase">LENTERA</span>
            <span className="text-[9px] text-lentera-muted uppercase tracking-widest mt-0.5 font-bold">PLATFORM PEMBELAJARAN AI</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          {['Fitur', 'Lensa', 'Who It\'s For'].map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
              className="text-sm font-medium text-lentera-text-secondary hover:text-lentera-green transition-colors"
            >
              {item}
            </a>
          ))}
          <Link href="/app" className="bg-lentera-green text-lentera-bg px-6 py-2.5 rounded-xl font-display font-bold text-sm hover:scale-[1.03] hover:bg-green-300 transition-all duration-200">
            Buka Aplikasi →
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2 text-lentera-green"
        >
          <div className={`w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <div className={`w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
          <div className={`w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 bg-lentera-bg/95 backdrop-blur-2xl z-[-1] transition-all duration-500 ease-in-out md:hidden ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
          <div className="flex flex-col items-center justify-center h-full gap-8 px-8">
            {['Fitur', 'Lensa', 'Who It\'s For'].map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl font-display font-bold text-lentera-text hover:text-lentera-green transition-colors"
              >
                {item}
              </a>
            ))}
            <Link 
              href="/app" 
              onClick={() => setIsMenuOpen(false)}
              className="w-full bg-lentera-green text-lentera-bg py-5 rounded-2xl font-display font-bold text-xl text-center shadow-lg shadow-lentera-green/20"
            >
              Buka LENTERA
            </Link>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative min-h-screen pt-28 px-[5%] flex flex-col md:grid md:grid-cols-[1.2fr_1fr] lg:grid-cols-[1.1fr_1fr] gap-12 items-center z-10 max-w-[1400px] mx-auto">
        <div className="flex flex-col text-left">
          <div className="animate-fade-up inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-lentera-green/10 border border-lentera-green-dim text-lentera-green text-[11px] font-bold tracking-widest uppercase mb-6 w-fit">
            <span className="w-2 h-2 rounded-full bg-lentera-green animate-pulse" />
            Platform AI Pembelajaran · NITRO 2026
          </div>

          <h1 className="animate-fade-up font-display font-extrabold text-[clamp(42px,6vw,72px)] leading-[1.02] tracking-tight mb-8" style={{ animationDelay: '0.1s' }}>
            <span className="text-lentera-text">Belajar lebih pintar.</span><br />
            <span className="text-lentera-green drop-shadow-[0_0_30px_rgba(74,222,128,0.2)]">Pahami lewat budaya.</span><br />
            <span className="text-lentera-text/50 italic">Berkembang bebas.</span>
          </h1>

          <p className="animate-fade-up text-lg text-lentera-text-secondary font-light leading-relaxed max-w-[580px] mb-10" style={{ animationDelay: '0.2s' }}>
            LENTERA mengubah materi akademik kompleks menjadi <span className="text-lentera-green-text font-medium underline decoration-lentera-green/30 underline-offset-4">analogi budaya yang bermakna</span>: dari kearifan Nusantara hingga budaya pop modern. Dibangun untuk memberdayakan <span className="text-lentera-green-text font-medium decoration-lentera-green/30 underline underline-offset-4">semua jenis pembelajar</span> dan mahasiswa di seluruh Indonesia.
          </p>

          <div className="animate-fade-up flex flex-wrap gap-5" style={{ animationDelay: '0.3s' }}>
            <Link href="/app" className="group bg-lentera-green text-lentera-bg px-8 py-4 rounded-xl font-display font-bold text-base hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(74,222,128,0.3)] transition-all duration-300 flex items-center gap-2">
              ✦ Mulai Belajar Gratis
            </Link>
            <a href="#features" className="group border border-lentera-border2 text-lentera-text-secondary px-8 py-4 rounded-xl font-display font-bold text-base hover:text-lentera-green hover:border-lentera-green-dim hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
              ▷ Lihat Cara Kerja
            </a>
          </div>

        </div>

        {/* Hero Right: Mockup */}
        <div className="animate-fade-up relative w-full aspect-[4/3] max-w-[550px]" style={{ animationDelay: '0.3s' }}>

          <div className="relative overflow-visible">
          </div>

          <div className="animate-float absolute inset-0 bg-lentera-surface border border-lentera-border2 rounded-lentera-xl shadow-[0_40px_80px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(74,222,128,0.1)] overflow-visible flex flex-col">
            <div className="bg-lentera-surface2 px-5 py-3 border-b border-lentera-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-lentera-green-subtle flex items-center justify-center text-[10px] font-bold text-lentera-green">K</div>
                <span className="text-[10px] font-bold text-lentera-green tracking-widest">LENTERA</span>
              </div>
              <div className="flex gap-1.5">
                {[1, 2, 3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-lentera-border" />)}
              </div>
            </div>

            <div className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-bold text-lentera-muted uppercase">Lensa Budaya Aktif</span>
                <div className="flex gap-2">
                  <div className="px-3 py-1.5 rounded-lg bg-lentera-green text-lentera-bg text-[10px] font-bold flex items-center gap-1.5">
                    🌴 Nusantara
                  </div>
                  <div className="px-3 py-1.5 rounded-lg border border-lentera-border text-lentera-muted text-[10px] font-bold">
                    ⛩️ Japanese
                  </div>
                  <div className="px-3 py-1.5 rounded-lg border border-lentera-border text-lentera-muted text-[10px] font-bold">
                    🕌 Islamic
                  </div>
                </div>
              </div>

              <div className="bg-lentera-bg border border-lentera-border rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-lentera-text-secondary text-[10px] uppercase font-bold tracking-wider">
                  <span>📖</span> Dyslexia-Friendly Breakdown
                </div>
                <div className="flex flex-col gap-2">
                  <div className="h-[7px] bg-lentera-green/20 rounded-full w-[90%] animate-shimmer" />
                  <div className="h-[7px] bg-lentera-green/15 rounded-full w-[75%] animate-shimmer" style={{ animationDelay: '0.2s' }} />
                  <div className="h-[7px] bg-lentera-green/10 rounded-full w-[85%] animate-shimmer" style={{ animationDelay: '0.4s' }} />
                </div>

                <div className="bg-lentera-green-subtle border border-lentera-green-dim rounded-lg p-3 mt-1">
                  <span className="inline-block text-[8px] font-bold bg-lentera-green-glow text-lentera-green px-2 py-0.5 rounded-full mb-2 uppercase tracking-tight">Analogi Nusantara</span>
                  <div className="h-[7px] bg-lentera-green/30 rounded-full w-[100%] mb-1.5" />
                  <div className="h-[7px] bg-lentera-green/20 rounded-full w-[80%]" />
                </div>
              </div>

              <div className="mt-auto pt-2 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-lentera-green flex items-center justify-center text-[10px] text-lentera-bg font-bold cursor-default">▶</div>
                <div className="flex-1 flex items-end gap-[3px] h-6 px-1">
                  {[4, 7, 5, 9, 6, 8, 5, 7].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-lentera-green/50 rounded-full animate-wave"
                      style={{ height: h * 2 + 'px', animationDelay: i * 0.1 + 's' }}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-lentera-green">1.0x</span>
              </div>
            </div>
          </div>

          <div className="absolute -top-8 -right-8 bg-lentera-surface border border-lentera-green-dim rounded-2xl p-4 shadow-2xl flex items-start gap-3 z-20 animate-float translate-y-3">
            <span className="text-2xl mt-1">🌴</span>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-lentera-muted uppercase">Active Lens</span>
              <span className="font-display font-bold text-lentera-green">Nusantara</span>
            </div>
          </div>

          <div className="absolute -bottom-6 -left-10 bg-lentera-surface border border-lentera-green-dim rounded-2xl p-4 shadow-2xl flex items-start gap-3 z-20 animate-float" style={{ animationDelay: '1.5s' }}>
            <span className="text-2xl mt-1">🎮</span>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-lentera-muted uppercase">Skor Kuis</span>
              <span className="font-display font-bold text-lentera-green text-lg">3 / 3 <span className="text-xs">✦</span></span>
            </div>
          </div>

          {/* BAGONG MASCOT — Medium size, uncropped on the right side */}
          <div className="absolute -right-24 -bottom-12 w-[340px] h-auto z-20 pointer-events-none animate-float hidden lg:block">
            <Gambar
              src="/images/bagong.png"
              alt="Bagong the Garuda Scholar mascot"
              width={340}
              height={420}
              className="object-contain object-bottom w-full h-auto drop-shadow-[0_20px_50px_rgba(74,222,128,0.25)]"
              priority
            />
          </div>
          <div className="absolute -right-12 -bottom-12 w-48 h-auto z-20 pointer-events-none animate-float block lg:hidden">
            <Gambar
              src="/images/bagong.png"
              alt="Mascot"
              width={192}
              height={240}
              className="object-contain object-bottom w-full h-auto drop-shadow-[0_20px_50px_rgba(74,222,128,0.25)]"
              priority
            />
          </div>
        </div>
      </section>

      {/* --- 6A: HERO MINI-FEATURES ROW --- */}
      <section className="border-y border-lentera-border bg-lentera-surface/30 relative z-10">
        <div className="max-w-[1400px] mx-auto px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { icon: '🌍', num: '50+', label: 'Cultural Lensa', sub: 'Dari Tradisional hingga Pop Kultur' },
            { icon: '🔊', num: '20+', label: 'Suara Regional', sub: 'Mesin TTS Multibahasa' },
            { icon: '💎', num: '100%', label: 'Demo Gratis', sub: 'Untuk NITRO 2026' },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-6 group">
              <div className="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
              <div>
                <div className="font-display font-bold text-3xl text-lentera-green leading-none">{stat.num}</div>
                <div className="font-semibold text-lentera-text text-base mt-2">{stat.label}</div>
                <div className="text-lentera-text-secondary text-[11px] font-bold uppercase tracking-widest mt-1 opacity-60 group-hover:opacity-100 transition-opacity">
                  {stat.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Section: Cultural Marquee --- */}
      <section id="lenses" className="py-24 px-[5%] relative z-10">
        <div className="reveal flex flex-col items-center text-center max-w-[800px] mx-auto mb-20 text-balance">
          <span className="text-lentera-green text-[11px] font-bold uppercase tracking-[0.2em] mb-4">Cultural Lensa</span>
          <h2 className="font-display font-extrabold text-[clamp(28px,4vw,48px)] leading-tight mb-6">
            Budaya Anda. <br />
            <span className="text-lentera-green">Cara Anda memahami.</span>
          </h2>
          <p className="text-lentera-text-secondary font-light max-w-[600px]">
            Setiap siswa berpikir berbeda. LENTERA berbicara dalam bahasa Anda: bukan hanya secara linguistik, tetapi budaya. Dari cerita pewayangan hingga logika modern.
          </p>
        </div>

        <div className="relative space-y-4 py-10">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-lentera-bg to-transparent z-20" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-lentera-bg to-transparent z-20" />

          <div className="flex overflow-hidden">
            <div className="flex gap-4 animate-marquee">
              {[...LENSES_ROW_1, ...LENSES_ROW_1].map((lens, i) => (
                <div key={i} className="flex-shrink-0 bg-lentera-surface border border-lentera-border hover:border-lentera-green-dim hover:bg-lentera-surface2 rounded-xl px-5 py-4 flex items-center gap-3 transition-all duration-300 group cursor-default">
                  <span className="text-2xl group-hover:scale-110 transition-transform">{lens.emoji}</span>
                  <div>
                    <div className="font-display font-semibold text-sm whitespace-nowrap">{lens.label}</div>
                    <div className="text-[10px] text-lentera-muted font-bold uppercase tracking-wider">{lens.region}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex overflow-hidden">
            <div className="flex gap-4 animate-marquee2">
              {[...LENSES_ROW_2, ...LENSES_ROW_2].map((lens, i) => (
                <div key={i} className="flex-shrink-0 bg-lentera-surface border border-lentera-border hover:border-lentera-green-dim hover:bg-lentera-surface2 rounded-xl px-5 py-4 flex items-center gap-3 transition-all duration-300 group cursor-default">
                  <span className="text-2xl group-hover:scale-110 transition-transform">{lens.emoji}</span>
                  <div>
                    <div className="font-display font-semibold text-sm whitespace-nowrap">{lens.label}</div>
                    <div className="text-[10px] text-lentera-muted font-bold uppercase tracking-wider">{lens.region}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- 6B: MAIN FEATURES SECTION --- */}
      <section id="features" className="py-28 px-8 max-w-6xl mx-auto z-10 relative">
        <div className="reveal flex flex-col mb-20">
          <span className="text-lentera-green text-sm font-semibold uppercase tracking-[0.2em] mb-4 block">Fitur LENTERA</span>
          <h2 className="font-display font-extrabold text-[clamp(32px,5vw,52px)] leading-tight mb-6">
            Semua yang kamu butuhkan untuk <br />
            <span className="text-lentera-green drop-shadow-[0_0_20px_rgba(74,222,128,0.2)]">belajar tanpa batas</span>
          </h2>
          <p className="text-lentera-text-secondary text-lg leading-relaxed max-w-2xl font-light">
            Enam alat berbasis AI yang dirancang untuk semua jenis pembelajar.
            Spasi ekstra, bahasa yang jelas, dan konteks budaya: karena
            setiap orang belajar dengan cara yang berbeda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* 1. FEATURED CARD */}
          <div className="reveal md:col-span-2 bg-gradient-to-br from-lentera-green-subtle/40 to-lentera-surface border border-lentera-green-dim rounded-2xl p-10 lg:p-12 flex flex-col lg:flex-row gap-12 hover:border-lentera-green-glow transition-all duration-500 group">
            <div className="flex-1 flex flex-col">
              <div className="w-16 h-16 rounded-2xl bg-lentera-green-subtle border border-lentera-green-glow flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-transform duration-500">
                🌴
              </div>
              <h3 className="font-display font-bold text-3xl text-lentera-text leading-snug mb-5">
                Mesin Lensa Budaya
              </h3>
              <p className="text-lentera-text-secondary text-base lg:text-lg leading-relaxed font-light mb-8 max-w-xl">
                Ubah teks akademik yang padat menjadi analogi yang hidup dan mudah diingat
                dari berbagai budaya. Mitokondria dijelaskan lewat <span className="text-lentera-green/80 font-medium">dapur warung Padang</span>. Superposisi kuantum lewat <span className="text-lentera-green/80 font-medium">orkestra gamelan</span>.
                Latar belakang budaya Anda kini menjadi kekuatan belajar terbesar Anda.
              </p>
              <div className="mt-auto">
                <span className="text-xs font-semibold uppercase tracking-widest text-lentera-green bg-lentera-green-subtle border border-lentera-green-glow px-4 py-2 rounded-full">
                  Fitur Utama
                </span>
              </div>
            </div>

            {/* Featured Preview */}
            <div className="flex-1 relative hidden lg:flex items-center justify-center">
              <div className="bg-lentera-bg/50 backdrop-blur-sm border border-lentera-green-glow/30 rounded-2xl p-8 w-full shadow-2xl scale-105">
                <div className="flex gap-3 mb-8">
                  <div className="px-4 py-2 rounded-xl bg-lentera-green text-lentera-bg text-[10px] font-bold uppercase tracking-wider">Nusantara</div>
                  <div className="px-4 py-2 rounded-xl border border-lentera-border text-lentera-muted text-[10px] font-bold uppercase tracking-wider opacity-60">Japanese</div>
                  <div className="px-4 py-2 rounded-xl border border-lentera-border text-lentera-muted text-[10px] font-bold uppercase tracking-wider opacity-40">Islamic</div>
                </div>
                <div className="space-y-4">
                  <div className="h-2.5 bg-lentera-green/30 rounded-full w-full animate-shimmer" />
                  <div className="h-2.5 bg-lentera-green/20 rounded-full w-[85%] animate-shimmer" style={{ animationDelay: '0.2s' }} />
                  <div className="bg-lentera-green-subtle/30 border border-lentera-green-glow/30 rounded-xl p-4 mt-2">
                    <div className="h-2 bg-lentera-green/40 rounded-full w-[95%] mb-2" />
                    <div className="h-2 bg-lentera-green/30 rounded-full w-[70%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {[
            {
              icon: '📖',
              tag: 'Aksesibilitas',
              title: 'Struktur Ramah Disleksia',
              desc: 'Setiap teks padat dipecah menjadi kalimat pendek, poin-poin yang jelas, dan kata kunci tebal. Tata letak bersih dengan spasi luas. Karena setiap pelajar berhak untuk paham, bukan sekadar bertahan.'
            },
            {
              icon: '🎮',
              tag: 'Keterlibatan',
              title: 'Kuis Mikro Interaktif',
              desc: 'Tiga pertanyaan berbasis budaya. Fokus lima menit dengan umpan balik cepat dan penjelasan detail. Dirancang untuk pembelajar yang butuh tantangan instan dan narasi yang seru.'
            },
            {
              icon: '📚',
              tag: 'Pemahaman',
              title: 'Glosarium Pintar Bilingual',
              desc: 'Setiap istilah akademik yang rumit dijelaskan dalam bahasa sederhana dan konteks budaya lokal. Tidak perlu lagi bolak-balik membuka kamus saat sedang belajar.'
            },
            {
              icon: '🖼️',
              tag: 'Multimodal',
              title: 'Unggah Apa Saja: Catatan, Foto, Audio',
              desc: 'Foto catatan tulisan tangan Anda. Unggah tangkapan layar materi. Rekam memo suara. LENTERA akan mengekstrak teks menggunakan Gemini Vision, lalu menganalisisnya lewat lensa budaya pilihan.'
            },
            {
              icon: '🔊',
              tag: 'Pendengaran',
              title: 'Teks-to-Speech dengan Sorotan Kata',
              desc: 'Dengarkan saat setiap kata disorot secara real-time. Pilih kecepatan suara dan bahasa. Belajar di perjalanan tanpa menatap layar. Dibuat untuk mereka yang mudah lelah membaca.'
            },
          ].map((f, i) => (
            <div key={i} className="reveal bg-lentera-surface border border-lentera-border2 rounded-2xl p-10 flex flex-col gap-8 hover:-translate-y-2 hover:border-lentera-green-glow transition-all duration-300 group">
              <div className="w-16 h-16 rounded-2xl bg-lentera-green-subtle border border-lentera-green-glow flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                {f.icon}
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="font-display font-bold text-2xl text-lentera-text leading-snug">
                  {f.title}
                </h3>
                <p className="text-lentera-text-secondary text-base leading-relaxed font-light">
                  {f.desc}
                </p>
              </div>
              <div className="mt-auto pt-6 border-t border-lentera-border">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-lentera-green bg-lentera-green-subtle border border-lentera-green-glow px-4 py-2 rounded-full">
                  {f.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Section: How It Works --- */}
      <section id="how-it-works" className="py-28 px-8 max-w-6xl mx-auto z-10 relative">
        <div className="reveal flex flex-col items-center text-center mb-20">
          <span className="text-lentera-green text-sm font-semibold uppercase tracking-[0.2em] mb-4 block">Cara Kerja LENTERA</span>
          <h2 className="font-display font-extrabold text-[clamp(28px,4vw,44px)] leading-tight mb-6">Tiga langkah untuk memahami</h2>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-[2px] border-t-2 border-dashed border-lentera-border z-0" />

          {[
            {
              num: '01',
              icon: '📥',
              title: 'Tempel atau Unggah Materi Anda',
              desc: 'Ketik catatan kuliah, tempel dari PDF, foto tulisan tangan, atau unggah rekaman audio. LENTERA menangani berbagai macam format masukan.'
            },
            {
              num: '02',
              icon: '🌍',
              title: 'Pilih Lensa Budaya Anda',
              desc: 'Pilih dari puluhan budaya. Nusantara, Japanese, Viking, Gamer: pilih lensa yang paling sesuai dengan Anda.'
            },
            {
              num: '03',
              icon: '✦',
              title: 'Dapatkan Analisis Personal Anda',
              desc: 'Dapatkan rangkuman ramah disleksia, analogi budaya, serta glosarium bilingual: semuanya dalam hitungan detik.'
            }
          ].map((step, i) => (
            <div key={i} className="reveal flex flex-col items-center text-center relative z-10">
              <div className="absolute -top-10 font-display font-extrabold text-7xl text-lentera-green/10 select-none">
                {step.num}
              </div>
              <div className="w-20 h-20 rounded-2xl bg-lentera-surface border border-lentera-green-dim flex items-center justify-center text-3xl mb-8 shadow-xl">
                {step.icon}
              </div>
              <h3 className="font-display font-bold text-xl text-lentera-text mb-4 px-4">{step.title}</h3>
              <p className="text-lentera-text-secondary text-base leading-relaxed font-light">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Section: Personas --- */}
      <section id="personas" className="py-28 px-8 bg-lentera-surface border-y border-lentera-border z-10 relative">
        <div className="reveal flex flex-col items-center text-center max-w-3xl mx-auto mb-20 text-balance">
          <span className="text-lentera-green text-sm font-semibold uppercase tracking-[0.2em] mb-4 block">Untuk Siapa</span>
          <h2 className="font-display font-extrabold text-[clamp(28px,4vw,44px)] leading-tight mb-4">Dibangun untuk setiap jenis pikiran</h2>
          <p className="text-lentera-text-secondary text-lg font-light leading-relaxed max-w-2xl">
            Tidak ada pembelajar yang tertinggal. Baik Anda memiliki tantangan fokus, membaca, maupun latar belakang budaya tertentu, LENTERA beradaptasi dengan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {[
            {
              tag: 'Disleksia',
              icon: '🧠',
              title: 'Pembelajar Visual',
              role: 'Kesulitan Membaca / Disleksia',
              quote: 'Dulu saya menghindari slide kuliah yang padat. Sekarang saya menempelkannya di LENTERA dan mendapatkan poin-poin yang jelas dan renggang — dalam bahasa budaya saya sendiri.',
              features: ['Teks Ramah Disleksia', 'Sorotan TTS', 'Glosarium Pintar'],
              color: 'border-lentera-green'
            },
            {
              tag: 'Fokus',
              icon: '⚡',
              title: 'Pembelajar Cepat',
              role: 'Tantangan Fokus / ADHD',
              quote: 'Sangat sulit untuk fokus membaca materi yang membosankan. Kuis mikro memberi saya tantangan cepat yang saya butuhkan untuk tetap terhubung dengan materi.',
              features: ['Kuis Gamifikasi', 'Asisten Audio', 'Analogi Naratif'],
              color: 'border-amber-500'
            },
            {
              tag: 'Global',
              icon: '🌏',
              title: 'Pelajar Lintas Budaya',
              role: 'Internasional / Multikultural',
              quote: 'Menjelaskan rekursi melalui cerita wayang? Konsep itu langsung saya pahami dalam 30 detik dibanding 3 pertemuan kelas. Akhirnya, saya paham dasar pemrograman.',
              features: ['50+ Lensa Budaya', 'Input Multimodal', 'TTS Multibahasa'],
              color: 'border-sky-500'
            }
          ].map((p, i) => (
            <div key={i} className="reveal bg-lentera-bg border border-lentera-border2 rounded-2xl p-10 flex flex-col gap-8 transition-all duration-300 hover:border-lentera-green/30">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-lentera-surface border border-lentera-border flex items-center justify-center text-3xl shadow-lg leading-none">
                  {p.icon}
                </div>
                <div>
                  <h4 className="font-display font-bold text-xl text-lentera-text">{p.title}</h4>
                  <div className="text-lentera-muted text-xs font-bold uppercase tracking-widest mt-1">{p.tag}</div>
                </div>
              </div>

              <div className="text-sm font-medium text-lentera-muted/80">{p.role}</div>

              <div className={`bg-lentera-surface border-l-4 ${p.color} p-6 rounded-r-2xl shadow-inner`}>
                <p className="text-base text-lentera-text-secondary leading-relaxed italic font-light">
                  "{p.quote}"
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {p.features.map(f => (
                  <span key={f} className="text-[10px] font-bold text-lentera-muted uppercase tracking-wider bg-lentera-surface border border-lentera-border px-3 py-1.5 rounded-full">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Section: Testimonials --- */}
      <section className="py-24 bg-lentera-surface/50 border-y border-lentera-border relative overflow-hidden z-10">
        <div className="max-w-6xl mx-auto px-8 mb-16 text-center">
          <span className="text-lentera-green text-sm font-semibold uppercase tracking-[0.2em] mb-4 block">Apa kata pembelajar</span>
          <h2 className="font-display font-extrabold text-[clamp(28px,4vw,40px)] leading-tight mb-4 text-lentera-text">Wawasan inspiratif dari mahasiswa Indonesia</h2>
        </div>

        <div className="flex flex-col gap-8">
          {/* Row 1 (Cards 0-3) - Scrolls Left */}
          <div className="flex overflow-hidden">
            <div className="flex gap-6 animate-marquee shrink-0" style={{ animationDuration: '35s' }}>
              {[...TESTIMONIALS.slice(0, 4), ...TESTIMONIALS.slice(0, 4)].map((t, i) => (
                <div key={i} className="min-w-80 max-w-sm flex-shrink-0 bg-lentera-bg border border-lentera-border2 rounded-2xl p-8 flex flex-col gap-5 hover:border-lentera-green/40 transition-colors group">
                  <div className="text-yellow-400 text-sm">★★★★★</div>
                  <p className="text-sm text-lentera-text-secondary leading-relaxed italic font-light">"{t.quote}"</p>
                  <div className="flex items-center gap-4 border-t border-lentera-border pt-4 mt-auto">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${t.color === 'green' ? 'bg-lentera-green-subtle text-lentera-green' :
                        t.color === 'blue' ? 'bg-blue-500/10 text-blue-400' :
                          t.color === 'purple' ? 'bg-purple-500/10 text-purple-400' :
                            t.color === 'amber' ? 'bg-amber-500/10 text-amber-400' :
                              'bg-teal-500/10 text-teal-400'
                      }`}>
                      {t.initial}
                    </div>
                    <div>
                      <div className="font-display font-semibold text-sm text-lentera-text">{t.name}</div>
                      <div className="text-[10px] text-lentera-muted font-bold uppercase tracking-widest">{t.university}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 (Cards 4-7) - Scrolls Right */}
          <div className="flex overflow-hidden">
            <div className="flex gap-6 animate-marquee2 shrink-0" style={{ animationDuration: '40s' }}>
              {[...TESTIMONIALS.slice(4, 8), ...TESTIMONIALS.slice(4, 8)].map((t, i) => (
                <div key={i} className="min-w-80 max-w-sm flex-shrink-0 bg-lentera-bg border border-lentera-border2 rounded-2xl p-8 flex flex-col gap-5 hover:border-lentera-green/40 transition-colors group">
                  <div className="text-yellow-400 text-sm">★★★★★</div>
                  <p className="text-sm text-lentera-text-secondary leading-relaxed italic font-light">"{t.quote}"</p>
                  <div className="flex items-center gap-4 border-t border-lentera-border pt-4 mt-auto">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${t.color === 'green' ? 'bg-lentera-green-subtle text-lentera-green' :
                        t.color === 'blue' ? 'bg-blue-500/10 text-blue-400' :
                          t.color === 'purple' ? 'bg-purple-500/10 text-purple-400' :
                            t.color === 'amber' ? 'bg-amber-500/10 text-amber-400' :
                              'bg-teal-500/10 text-teal-400'
                      }`}>
                      {t.initial}
                    </div>
                    <div>
                      <div className="font-display font-semibold text-sm text-lentera-text">{t.name}</div>
                      <div className="text-[10px] text-lentera-muted font-bold uppercase tracking-widest">{t.university}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- Section: Pricing --- */}
      <section id="pricing" className="py-28 px-8 max-w-6xl mx-auto z-10 relative">
        <div className="reveal flex flex-col items-center text-center mb-16">
          <span className="bg-lentera-green-subtle border border-lentera-green-dim text-lentera-green text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            Gratis untuk NITRO 2026
          </span>
          <h2 className="font-display font-extrabold text-[clamp(28px,4vw,52px)] leading-tight mb-6">Coba LENTERA: sepenuhnya gratis</h2>
          <p className="text-lentera-text-secondary text-lg font-light leading-relaxed max-w-2xl">
            Tanpa akun. Tanpa pembayaran. Cukup tempel materi Anda dan mulailah belajar dalam bahasa budaya Anda.
          </p>
        </div>

        <div className="reveal bg-lentera-surface border-2 border-lentera-green-glow rounded-[40px] p-16 max-w-xl mx-auto shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-lentera-green/10 blur-3xl pointer-events-none group-hover:bg-lentera-green/20 transition-all" />

          <div className="relative text-center">
            <div className="font-display font-extrabold text-7xl text-lentera-green mb-2 tracking-tighter">GRATIS</div>
            <div className="text-lentera-muted text-xs uppercase font-bold tracking-[0.3em] mb-12">Selama Masa Uji Coba NITRO 2026</div>

            <ul className="space-y-4 mb-12 text-left inline-block">
              {[
                'Analisis tak terbatas',
                'Semua 50+ lensa budaya',
                'Pembuatan kuis mikro',
                'Input multimodal (gambar + audio)',
                'Teks-to-speech dengan 20+ suara',
                'Glosarium bilingual',
                'Riwayat disimpan lokal'
              ].map(f => (
                <li key={f} className="flex items-center gap-3 text-lentera-text-secondary font-light">
                  <span className="text-lentera-green">✓</span> {f}
                </li>
              ))}
            </ul>

            <div className="relative">
              <Link href="/app" className="block relative z-10 bg-lentera-green text-lentera-bg py-5 px-10 rounded-2xl font-display font-bold text-xl hover:-translate-y-1 hover:shadow-2xl hover:bg-green-300 transition-all duration-300">
                ✦ Buka LENTERA Sekarang
              </Link>
              <div className="absolute -right-8 -bottom-10 w-40 h-auto opacity-20 pointer-events-none z-0 animate-float" style={{ animationDelay: '1s' }}>
                <Gambar
                  src="/images/bagong.png"
                  alt=""
                  width={160}
                  height={200}
                  className="object-contain"
                />
              </div>
            </div>

            <p className="mt-8 text-[10px] text-lentera-muted font-bold uppercase tracking-widest">
              Dibangun oleh mahasiswa, untuk mahasiswa · 2026 LENTERA
            </p>
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="py-32 px-[5%] text-center relative z-10 overflow-hidden">
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-lentera-green/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="reveal max-w-[800px] mx-auto relative z-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lentera-surface border border-lentera-border text-lentera-green-text text-[11px] font-bold uppercase tracking-widest mb-10">
            🦅 Didukung oleh Gemini 2.5 Flash
          </div>

          <h2 className="font-display font-extrabold text-[clamp(34px,6vw,68px)] leading-[1.05] tracking-tight mb-8">
            Siap belajar layaknya<br />
            <span className="text-lentera-green">seorang juara</span> ?
          </h2>

          <p className="text-lentera-text-secondary text-lg font-light leading-relaxed mb-12 max-w-[600px] mx-auto">
            Tidak ada lagi kesulitan memahami buku teks yang padat. Biarkan LENTERA dan Bagong memandu Anda melalui subjek apa pun, dalam bahasa apa pun, melalui lensa budaya apa pun.
          </p>

          <div className="flex flex-wrap justify-center gap-6 font-display">
            <Link href="/app" className="bg-lentera-green text-lentera-bg px-10 py-5 rounded-xl font-bold text-lg hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
              ✦ Buka LENTERA Sekarang
            </Link>
            <a 
              href="https://github.com/galiihajiip/kalika" 
              target="_blank" 
              rel="noopener noreferrer"
              className="border border-lentera-border2 text-lentera-text px-10 py-5 rounded-xl font-bold text-lg hover:border-lentera-green/50 hover:bg-lentera-surface transition-all duration-300"
            >
              ↗ View on GitHub
            </a>
          </div>
        </div>

        <div className="absolute bottom-[-40px] right-[-20px] font-display font-extrabold text-[180px] text-lentera-green/5 pointer-events-none select-none">
          ಕಲಿಕೆ
        </div>

        {/* BAGONG MASCOT — Decorative background element restored to prominence */}
        <div className="absolute -right-16 -bottom-10 w-96 h-auto opacity-30 pointer-events-none z-0 animate-float">
          <Gambar
            src="/images/bagong.png"
            alt="Bagong Mascot"
            width={400}
            height={500}
            className="object-contain object-bottom w-full h-auto"
            aria-hidden="true"
          />
        </div>
      </section>

      <Footer />
    </div>
  )
}
