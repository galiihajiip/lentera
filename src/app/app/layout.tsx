import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard — LENTERA',
  description: 'Analisis materi akademik dengan lensa budaya Indonesia. Platform pembelajaran AI adaptif untuk mitigasi stres akademik.',
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
