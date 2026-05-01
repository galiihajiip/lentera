import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard — LENTERA',
  description: 'Analisis materi akademik dengan lensa budaya Indonesia. Platform pembelajaran AI adaptif untuk mitigasi stres akademik.',
}

/**
 * Layout khusus /app — tidak merender Navbar & Footer global
 * karena halaman dashboard punya topbar sendiri yang sticky.
 * ToastContainer di-render di dalam page.tsx.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
