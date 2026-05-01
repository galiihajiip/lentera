import type { Metadata, Viewport } from 'next'
import { Sora, Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ToastContainer from '@/components/Toast'
import './globals.css'

// ─── Font Setup ──────────────────────────────────────────────
const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-sora',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

// ─── Metadata ────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'LENTERA — Platform Pembelajaran AI',
  description:
    'Platform Pembelajaran Multi-Sensori Adaptif Berbasis AI & Lensa Budaya untuk Mitigasi Stres Akademik. Dibangun oleh Tim UPN Veteran Jawa Timur untuk NITRO 2026.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'LENTERA',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/icons/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#4ade80',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

// ─── Root Layout ─────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${sora.variable} ${inter.variable} scroll-smooth`}>
      <body className="bg-lentera-bg text-lentera-text min-h-screen antialiased font-body">
        <Navbar />
        {children}
        <Footer />
        <ToastContainer />
      </body>
    </html>
  )
}
