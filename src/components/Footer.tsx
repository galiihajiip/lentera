import { Sparkles } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-lentera-border bg-lentera-surface py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-lentera-green" />
            <span className="font-display font-bold text-lentera-green tracking-wider">LENTERA</span>
            <span className="text-xs text-lentera-muted">|</span>
            <span className="text-xs text-lentera-muted">Platform Pembelajaran AI</span>
          </div>

          {/* Kompetisi */}
          <div className="text-center">
            <p className="text-xs text-lentera-muted">
              Dibangun untuk <span className="text-lentera-green-dim font-semibold">NITRO 2026</span>
            </p>
            <p className="text-[10px] text-lentera-muted/60 mt-1">
              Penyelenggara: HMTI FTS UMP
            </p>
          </div>

          {/* Tim */}
          <div className="text-right">
            <p className="text-xs text-lentera-text-secondary">
              UPN "Veteran" Jawa Timur
            </p>
            <p className="text-[10px] text-lentera-muted mt-1">
              Powered by Google Gemini 2.5 Flash
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-lentera-border text-center">
          <p className="text-[11px] text-lentera-muted/50">
            &copy; 2026 LENTERA. Dibangun dengan dedikasi untuk pembelajar Indonesia.
          </p>
        </div>
      </div>
    </footer>
  )
}
