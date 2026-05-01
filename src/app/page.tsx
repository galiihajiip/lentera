/**
 * Halaman utama LENTERA — placeholder.
 *
 * Halaman ini akan diganti penuh di blok pengembangan UI berikutnya
 * (BLOK 3+). Sekarang hanya skeleton minimal yang memakai palette LENTERA
 * agar setup Tailwind v4 + globals.css terverifikasi.
 */
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-lentera-bg p-8 text-lentera-text">
      <span className="rounded-full border border-lentera-border bg-lentera-surface px-4 py-1 text-xs uppercase tracking-widest text-lentera-text-secondary">
        LENTERA · Setup berjalan
      </span>

      <h1 className="text-center text-4xl font-bold text-lentera-green sm:text-5xl">
        Pembelajaran Multi-Sensori Adaptif
      </h1>

      <p className="max-w-xl text-center text-base leading-relaxed text-lentera-text-secondary">
        Platform AI berlensa budaya Nusantara untuk mitigasi stres akademik —
        dari Sabang sampai Merauke. Halaman antarmuka aplikasi sedang
        disiapkan di blok berikutnya.
      </p>

      <div className="glass mt-4 rounded-lentera-lg px-6 py-3 text-sm text-lentera-text-secondary glow-green">
        BLOK 1 selesai · siap menuju state management & global layout
      </div>
    </main>
  );
}
