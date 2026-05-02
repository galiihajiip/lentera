import Link from 'next/link'
import LogoMark from './LogoMark'

export default function Footer() {
  return (
    <footer className="bg-lentera-surface border-t border-lentera-border py-20 px-[5%] font-display relative z-20">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center group">
              <LogoMark size={32} isWide={true} />
            </div>
            <p className="text-sm text-lentera-text-secondary leading-relaxed font-body max-w-[300px]">
              Pendamping Belajar AI yang Adaptif Secara Budaya. Menyederhanakan materi akademik melalui konteks Nusantara yang relevan.
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-[10px] text-lentera-muted font-bold uppercase tracking-[0.2em] mb-2">Dikembangkan oleh</p>
                <div className="flex flex-col gap-1.5">
                  <p className="text-xs text-lentera-text-secondary font-body font-bold">
                    Galih Aji Pangestu
                  </p>
                  <p className="text-xs text-lentera-text-secondary font-body font-bold">
                    Sabrina Nurlita Dwi Oktaviani
                  </p>
                  <p className="text-xs text-lentera-text-secondary font-body font-bold">
                    Muhammad Reza Fakhriansah
                  </p>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-lentera-muted font-bold uppercase tracking-[0.2em] mb-2">Universitas</p>
                <p className="text-xs text-lentera-text-secondary font-body">UPN "Veteran" Jawa Timur</p>
              </div>
              <p className="text-[11px] text-lentera-green font-bold pt-4 tracking-wide">
                © 2026 LENTERA : NITRO 2026
              </p>
            </div>
          </div>

          {/* MIDDLE COLUMNS (Product & Learn More) */}
          <div className="grid grid-cols-2 col-span-1 md:col-span-1 lg:col-span-2 gap-12 lg:pl-16">
            <div className="flex flex-col gap-6">
              <h4 className="text-[10px] font-extrabold text-lentera-muted uppercase tracking-[0.3em] border-b border-lentera-border pb-2 inline-block w-fit">Produk</h4>
              <ul className="flex flex-col gap-3">
                {['Buka Aplikasi', 'Lensa Budaya', 'Kuis Mikro', 'Teks ke Suara', 'Input Multimodal'].map(item => (
                  <li key={item}>
                    <Link href={item === 'Buka Aplikasi' ? '/app' : '#'} className="text-sm text-lentera-text-secondary hover:text-lentera-green transition-all hover:translate-x-1 inline-block font-body">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-6">
              <h4 className="text-[10px] font-extrabold text-lentera-muted uppercase tracking-[0.3em] border-b border-lentera-border pb-2 inline-block w-fit">Pelajari Lebih Lanjut</h4>
              <ul className="flex flex-col gap-3">
                {['Tentang LENTERA', 'Cara Kerja', 'Untuk Siapa', 'Repositori GitHub', 'Info Hackathon'].map(item => (
                  <li key={item}>
                    <a 
                      href={item === 'Repositori GitHub' ? 'https://github.com/galiihajiip/lentera' : '#'} 
                      target={item === 'Repositori GitHub' ? '_blank' : undefined}
                      rel={item === 'Repositori GitHub' ? 'noopener noreferrer' : undefined}
                      className="text-sm text-lentera-text-secondary hover:text-lentera-green transition-all hover:translate-x-1 inline-block font-body"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[10px] font-extrabold text-lentera-muted uppercase tracking-[0.3em] border-b border-lentera-border pb-2 inline-block w-fit">Dibangun Dengan</h4>
            <div className="flex flex-wrap gap-2 pt-2">
              {['Next.js', 'Gemini 2.5 Flash', 'TypeScript', 'Tailwind CSS', 'Vercel'].map(tech => (
                <div key={tech} className="px-3 py-1.5 bg-lentera-surface border border-lentera-border2 rounded-lg font-mono text-[10px] text-lentera-text-secondary hover:border-lentera-green/50 transition-all cursor-default shadow-sm">
                  {tech}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* BOTTOM STRIP */}
        <div className="pt-10 border-t border-lentera-border flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-lentera-muted font-bold uppercase tracking-widest">© 2026 LENTERA. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-6">
             <Link href="#" className="text-[10px] text-lentera-muted hover:text-lentera-green transition-colors uppercase font-bold tracking-widest">Kebijakan Privasi</Link>
             <Link href="#" className="text-[10px] text-lentera-muted hover:text-lentera-green transition-colors uppercase font-bold tracking-widest">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
