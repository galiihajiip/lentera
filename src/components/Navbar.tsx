'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, BookOpen, Home, Info, Sparkles } from 'lucide-react'

const NAV_LINKS = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/app', label: 'Mulai Belajar', icon: BookOpen },
  { href: '#tentang', label: 'Tentang', icon: Info },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <header className="glass sticky top-0 z-50 border-t-2 border-lentera-green border-b border-lentera-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-[72px]">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-lentera-green-subtle border border-lentera-green-glow flex items-center justify-center group-hover:glow-green transition-all">
                <Sparkles className="w-5 h-5 text-lentera-green" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lentera-green text-lg tracking-wider leading-none">
                  LENTERA
                </span>
                <span className="text-[10px] text-lentera-muted mt-0.5 hidden sm:block">
                  Platform Pembelajaran AI
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                      ${isActive
                        ? 'text-lentera-green bg-lentera-green-subtle/50 border border-lentera-green-glow'
                        : 'text-lentera-text-secondary hover:text-lentera-green hover:bg-lentera-surface2 border border-transparent'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            {/* CTA Desktop */}
            <div className="hidden md:flex items-center gap-3">
              <p className="text-xs text-lentera-muted font-medium bg-lentera-bg/50 px-3 py-1.5 rounded-full border border-lentera-border">
                Belajar lewat <span className="text-lentera-green-dim font-bold">lensa budaya</span>
              </p>
            </div>

            {/* Hamburger Mobile */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-xl border border-lentera-border text-lentera-muted hover:text-lentera-green hover:border-lentera-green-glow transition-all"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setIsOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          
          {/* Drawer */}
          <div
            className="absolute right-0 top-0 h-full w-72 bg-lentera-surface border-l border-lentera-border animate-slide-in flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-lentera-border">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-lentera-green" />
                <span className="font-display font-bold text-lentera-green tracking-wider">LENTERA</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-lentera-muted hover:text-lentera-green transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Links */}
            <nav className="flex-1 p-4 flex flex-col gap-2">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                      ${isActive
                        ? 'text-lentera-green bg-lentera-green-subtle/50 border border-lentera-green-glow'
                        : 'text-lentera-text-secondary hover:text-lentera-green hover:bg-lentera-surface2 border border-transparent'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-lentera-border">
              <p className="text-xs text-lentera-muted text-center">
                NITRO 2026 — HMTI FTS UMP
              </p>
              <p className="text-[10px] text-lentera-muted/60 text-center mt-1">
                Powered by Google Gemini 2.5 Flash
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
