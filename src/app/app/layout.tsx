import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard — LENTERA',
  description: 'Analisis materi akademik dengan lensa budaya Indonesia. Platform pembelajaran AI adaptif untuk mitigasi stres akademik.',
}

/**
 * Layout khusus /app.
 * Catatan: Navbar & Footer di-render secara eksklusif di Landing Page (src/app/page.tsx),
 * sehingga tidak mengganggu layout dashboard ini.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
