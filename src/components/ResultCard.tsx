'use client'

import { useState } from 'react'
import { useLenteraStore } from '@/store/useLenteraStore'
import AudioPlayer from './AudioPlayer'

interface ResultCardProps {
  onGenerateQuiz: () => void
  isGeneratingQuiz: boolean
}

export default function ResultCard({ onGenerateQuiz, isGeneratingQuiz }: ResultCardProps) {
  const { resultData: result, selectedLens } = useLenteraStore()
  const [ttsTeks, setTtsTeks] = useState<string | null>(null)
  const [showPlayer, setShowPlayer] = useState(false)

  if (!result) return null

  const handleListen = (text: string) => {
    setTtsTeks(text)
    setShowPlayer(true)
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in-up pb-20">
      {/* 1. DYSLEXIA FRIENDLY TEXT */}
      <section className="bg-lentera-surface border border-lentera-border rounded-2xl overflow-hidden shadow-lg">
        <div className="bg-lentera-surface2 px-6 py-5 border-b border-lentera-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🧠</span>
            <h3 className="text-sm font-bold text-lentera-text uppercase tracking-widest leading-none">
              Konsep Sederhana
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleListen(result.dyslexiaFriendlyTeks)}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-lentera-border text-lentera-muted hover:border-lentera-green-glow hover:text-lentera-green transition-all active:scale-95 flex items-center gap-2 bg-lentera-bg/50"
            >
              <span>🔊</span> Dengarkan
            </button>
            <div className="hidden sm:block text-[10px] bg-lentera-green-glow/20 text-lentera-green px-3 py-1.5 rounded-lg border border-lentera-green-glow/30 font-extrabold tracking-wider">
              RAMAH DISLEKSIA
            </div>
          </div>
        </div>
        <div className="p-8 md:p-10">
          <ul className="space-y-4">
            {result.dyslexiaFriendlyTeks.split('\n').filter(line => line.trim()).map((line, i) => (
              <li key={i} className="flex items-start gap-4 group">
                <span className="mt-2.5 w-2 h-2 rounded-full bg-lentera-green shrink-0 group-hover:scale-125 transition-transform shadow-[0_0_8px_rgba(74,222,128,0.4)]" />
                <p className="text-base md:text-lg leading-[1.8] text-lentera-text-secondary font-medium">
                  {line.replace(/^- /, '')}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 2. CULTURAL ANALOGY */}
      <section className="bg-lentera-surface border border-lentera-border rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-lentera-surface2 px-6 py-5 border-b border-lentera-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🎭</span>
            <h3 className="text-sm font-bold text-lentera-text uppercase tracking-widest leading-none">
              Lensa {selectedLens.replace('_', ' ').toUpperCase()}
            </h3>
          </div>
          <button 
            onClick={() => handleListen(result.culturalAnalogy)}
            className="px-4 py-2 rounded-xl text-xs font-bold border border-lentera-border text-lentera-muted hover:border-lentera-green-glow hover:text-lentera-green transition-all active:scale-95 flex items-center gap-2 bg-lentera-bg/50"
          >
            <span>🔊</span> Dengarkan
          </button>
        </div>
        <div className="p-8 md:p-10">
          <div className="bg-lentera-surface2 border border-lentera-green-glow/30 p-8 rounded-2xl relative group shadow-inner shadow-black/20">
            <div className="absolute -top-4 -left-4 text-4xl filter drop-shadow-xl group-hover:rotate-12 transition-transform select-none">💡</div>
            <p className="text-base md:text-lg italic text-lentera-text leading-loose whitespace-pre-wrap font-medium">
              {result.culturalAnalogy}
            </p>
          </div>
          
          {/* Exam Boundary Notes */}
          <div className="flex gap-4 items-start bg-yellow-500/[0.04] border border-yellow-500/20 rounded-xl p-6 mt-8 animate-fade-in shadow-sm">
            <span className="text-2xl mt-0.5 filter drop-shadow-sm select-none">🔥</span>
            <div>
              <p className="text-sm font-bold text-yellow-500 uppercase tracking-widest mb-1">Catatan Batasan Ujian</p>
              <p className="text-sm md:text-base text-yellow-200/90 leading-relaxed italic font-medium">
                {result.examBoundary}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BILINGUAL GLOSSARY */}
      <section className="bg-lentera-surface border border-lentera-border rounded-2xl overflow-hidden shadow-lg mb-8">
        <div className="bg-lentera-surface2 px-6 py-5 border-b border-lentera-border">
          <div className="flex items-center gap-3">
            <span className="text-xl">📚</span>
            <h3 className="text-sm font-bold text-lentera-text uppercase tracking-widest leading-none">
              Glosarium Bilingual
            </h3>
          </div>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-lentera-bg/50">
                <th className="py-5 px-8 text-xs font-extrabold text-lentera-muted uppercase tracking-[0.2em] border-b border-lentera-border">Istilah Akademik</th>
                <th className="py-5 px-8 text-xs font-extrabold text-lentera-muted uppercase tracking-[0.2em] border-b border-lentera-border">Definisi (Level B1)</th>
                <th className="py-5 px-8 text-xs font-extrabold text-lentera-muted uppercase tracking-[0.2em] border-b border-lentera-border">Konteks Lokal</th>
              </tr>
            </thead>
            <tbody>
              {result.bilingualGlossary.map((row, i) => (
                <tr key={i} className="border-b border-lentera-border/30 hover:bg-lentera-surface2/40 transition-colors group">
                  <td className="py-5 px-8 text-base font-bold text-lentera-green whitespace-nowrap">
                    <span className="group-hover:translate-x-1 transition-transform inline-block">{row.term}</span>
                  </td>
                  <td className="py-5 px-8 text-sm md:text-base text-lentera-text-secondary leading-relaxed font-medium">
                    {row.englishB1}
                  </td>
                  <td className="py-5 px-8 text-sm md:text-base text-lentera-text-secondary italic font-medium leading-relaxed opacity-80">
                    {row.localContext}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. GENERATE QUIZ CTA */}
      <div className="mt-4 mb-10 flex flex-col items-center gap-6 p-10 border-2 border-dashed border-lentera-border rounded-3xl bg-lentera-surface/30 backdrop-blur-sm group hover:border-lentera-green-glow transition-all duration-300">
        <div className="text-center max-w-sm">
          <h4 className="text-xl font-bold font-display text-lentera-text mb-2 transition-colors group-hover:text-lentera-green">Sudah menguasai materi?</h4>
          <p className="text-base text-lentera-muted leading-relaxed">Uji pemahaman konsep inti Anda dengan kuis mini berkonteks.</p>
        </div>
        <button
          onClick={onGenerateQuiz}
          disabled={isGeneratingQuiz}
          className="bg-lentera-green text-lentera-bg px-12 py-5 rounded-2xl text-lg font-bold shadow-2xl shadow-lentera-green/20 hover:bg-green-300 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-4 group/btn"
        >
          {isGeneratingQuiz ? (
            <>
              <div className="w-5 h-5 border-3 border-lentera-bg border-t-transparent rounded-full animate-spin" />
              <span>MEMBUAT...</span>
            </>
          ) : (
            <>
              <span className="text-2xl group-hover/btn:rotate-12 transition-transform">🎮</span> 
              <span>BUAT KUIS MINI</span>
            </>
          )}
        </button>
      </div>

      {/* MULTILINGUAL AUDIO PLAYER OVERLAY (STICKY) */}
      {showPlayer && ttsTeks && (
        <div className="fixed bottom-0 left-0 right-0 p-4 md:p-0 md:bg-transparent z-50 animate-fade-in-up">
          <div className="w-full md:max-w-md md:ml-auto md:mr-8 md:mb-8 bg-lentera-surface2 border-2 border-lentera-border rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] px-7 py-6 group backdrop-blur-xl">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-lentera-green animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                <span className="text-[10px] text-lentera-muted uppercase tracking-[0.25em] font-extrabold">
                  LENTERA : Asisten Audio
                </span>
              </div>
              <button 
                onClick={() => {
                  setShowPlayer(false)
                  window.speechSynthesis.cancel()
                }}
                className="w-8 h-8 rounded-full border border-lentera-border flex items-center justify-center text-lentera-muted hover:text-red-400 hover:border-red-500/30 transition-all active:scale-90"
              >
                ✕
              </button>
            </div>
            <AudioPlayer textToRead={ttsTeks} />
            
            <p className="mt-5 text-[9px] text-center text-lentera-muted italic leading-tight px-4 opacity-60 group-hover:opacity-100 transition-opacity">
              Catatan: Anda dapat mengubah bahasa dan kecepatan di pengaturan.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
