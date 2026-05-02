'use client'

import { useEffect, useState } from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function HowToUseModal({ isOpen, onClose }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isOpen) return null

  const steps = [
    {
      icon: '📝',
      title: 'Siapkan Materi',
      desc: 'Ketik atau tempel teks akademik (min. 50 karakter). Anda juga bisa menggunakan ikon multimodal untuk mengekstrak teks dari gambar atau audio.'
    },
    {
      icon: '🌍',
      title: 'Pilih Lensa Budaya',
      desc: 'Pilih dari 50+ konteks budaya. Ini menentukan analogi dan cara LENTERA menjelaskan materi tersebut.'
    },
    {
      icon: '✦',
      title: 'Buat Analisis',
      desc: 'Klik tombol untuk mendapatkan penjelasan ramah disleksia, analogi budaya, dan glosarium teknis.'
    },
    {
      icon: '🎮',
      title: 'Uji Kemampuanmu',
      desc: 'Pindah ke tab "Kuis Mikro" untuk membuat kuis kustom berisi 3 pertanyaan berdasarkan materi belajarmu.'
    }
  ]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-lentera-surface border border-lentera-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-up">
        <div className="bg-lentera-surface2 px-6 py-4 border-b border-lentera-border flex items-center justify-between">
          <h3 className="font-display font-bold text-lentera-green tracking-wide">CARA PAKAI LENTERA</h3>
          <button 
            onClick={onClose}
            className="text-lentera-muted hover:text-lentera-text transition-colors p-1"
          >
            ✕
          </button>
        </div>

        <div className="p-8 flex flex-col gap-8">
          <p className="text-sm text-lentera-text-secondary leading-relaxed italic">
            "Perjalanan menuju pemahaman dimulai di sini. Ikuti langkah sederhana ini untuk menguasai materi apa pun."
          </p>

          <div className="space-y-6">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-lentera-green/10 border border-lentera-green/20 flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-lentera-green/20 transition-colors">
                  {step.icon}
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-bold text-lentera-text">{step.title}</h4>
                  <p className="text-xs text-lentera-muted leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={onClose}
            className="mt-4 w-full bg-lentera-green text-lentera-bg py-3 rounded-xl font-bold font-display hover:bg-green-300 transition-all active:scale-[0.98]"
          >
            MASUK KE DASHBOARD
          </button>
        </div>
      </div>
    </div>
  )
}
