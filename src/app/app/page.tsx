'use client'

import { useState } from 'react'
import Link from 'next/link'
import Gambar from 'next/image'
import LogoMark from '@/components/LogoMark'
import InputField from '@/components/InputField'
import LensSelector from '@/components/LensSelector'
import ResultCard from '@/components/ResultCard'
import QuizCard from '@/components/QuizCard'
import HistoryPanel from '@/components/HistoryPanel'
import HowToUseModal from '@/components/HowToUseModal'
import { useLenteraStore } from '@/store/useLenteraStore'
import { LENS_ITEMS } from '@/components/LensSelector'

type Tab = 'result' | 'quiz'

export default function HomePage() {
  const { 
    isLoading, resultData, quizData, activeTab, setActiveTab, 
    history, inputTeks, selectedLens, addToast, setResult, 
    setLoading, addHistory, setQuiz, setSelectedLens
  } = useLenteraStore()

  const [historyOpen, setHistoryOpen] = useState(false)
  const [howToOpen, setHowToOpen] = useState(false)
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false)

  const handleGenerate = async () => {
    if (!inputTeks || inputTeks.length < 50) return
    setLoading(true)

    try {
      const res = await fetch('/api/generate-lens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputTeks, lens: selectedLens }),
      })

      if (!res.ok) {
        const errJson = await res.json()
        throw new Error(errJson.error ?? 'Failed to generate analysis')
      }

      const json = await res.json()
      setResult(json.data)
      setQuiz(null) // Clear old quiz on new material
      
      addHistory({
        id: `hist-${Date.now()}`,
        inputTeks,
        lens: selectedLens,
        result: json.data,
        timestamp: Date.now()
      })

      setActiveTab('result')
    } catch(err: any) {
      addToast({ message: err.message || 'Server error', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateQuiz = async () => {
    if (!inputTeks) return
    setIsGeneratingQuiz(true)

    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputTeks, lens: selectedLens }),
      })

      if (!res.ok) {
        const errJson = await res.json()
        throw new Error(errJson.error ?? 'Failed to generate quiz')
      }

      const json = await res.json()
      setQuiz(json.data)
      setActiveTab('quiz')
      addToast({ message: 'Quiz successfully generated!', type: 'success' })
    } catch(err: any) {
      addToast({ message: err.message || 'Failed to generate quiz', type: 'error' })
    } finally {
      setIsGeneratingQuiz(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-lentera-bg text-lentera-text">
      
      {/* ── TOPBAR ── */}
      <header className="bg-lentera-surface border-t-2 border-lentera-green border-b border-lentera-border h-[72px] px-8 flex items-center justify-between sticky top-0 z-40">
        <Link href="/landing" className="flex items-center gap-4 group">
          <LogoMark />
          <div className="flex flex-col">
            <h1 className="font-display font-bold text-lentera-green text-[20px] tracking-wider leading-none">
              LENTERA
            </h1>
            <p className="text-xs text-lentera-muted mt-0.5">
              AI Study Companion · Powered by Gemini 2.5 Flash
            </p>
          </div>
        </Link>
        
        <div className="flex items-center gap-6">
          <p className="hidden md:block text-xs text-lentera-muted font-medium bg-lentera-bg/50 px-3 py-1.5 rounded-full border border-lentera-border">
            Belajar melalui <span className="text-lentera-green-dim font-bold">lensa budaya</span> pilihan Anda
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setHowToOpen(true)}
              className="text-xs font-semibold text-lentera-muted hover:text-lentera-green transition-colors px-4 py-2 rounded-lg border border-transparent hover:border-lentera-border"
            >
              Cara Pakai
            </button>
            <button 
              id="btn-history-panel"
              onClick={() => setHistoryOpen(true)}
              className="text-xs font-bold text-lentera-muted hover:text-lentera-green transition-colors px-4 py-2 rounded-lg border border-lentera-border hover:bg-lentera-surface2"
            >
              Riwayat {history.length > 0 && `(${history.length})`}
            </button>
          </div>
        </div>
      </header>

      {/* ── PAGE LAYOUT ── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[460px_1fr]">
        
        {/* LEFT COLUMN: Input */}
        <aside className="bg-lentera-surface border-r border-lentera-border p-8 flex flex-col gap-8 relative z-10 custom-scrollbar overflow-y-auto">
          
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold tracking-wider text-lentera-muted uppercase">
              Materi untuk Dipelajari
            </h2>
            <InputField />
          </div>

          <div className="flex flex-col gap-3 flex-1">
            <h2 className="text-sm font-semibold tracking-wider text-lentera-muted uppercase mt-2">
              Pilih Lensa Budaya
            </h2>
            <LensSelector />
          </div>

          <div className="mt-8 pt-6 border-t border-lentera-border">
            <button
              id="btn-generate"
              onClick={handleGenerate}
              disabled={isLoading || inputTeks.length < 50}
              className="w-full bg-lentera-green text-lentera-bg rounded-xl py-5 text-base font-bold font-display tracking-wider hover:bg-green-300 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-lentera-green/10"
            >
              {isLoading ? 'MENGANALISIS...' : <><span>✦</span> ANALISIS SEKARANG</>}
            </button>
          </div>
        </aside>

        {/* RIGHT COLUMN: Output */}
        <main className="bg-lentera-bg relative flex flex-col min-h-[500px]">
          
          {/* Output Tabs */}
          {(resultData || isLoading) && (
            <div className="flex border-b border-lentera-border sticky top-0 bg-lentera-bg/90 backdrop-blur-md z-20">
              <button
                onClick={() => setActiveTab('result')}
                className={`flex-1 py-4 px-6 text-sm cursor-pointer text-center flex items-center justify-center gap-2 border-b-2 transition-all duration-200
                  ${activeTab === 'result' 
                    ? 'text-lentera-green border-lentera-green font-semibold' 
                    : 'text-lentera-muted border-transparent font-medium hover:text-lentera-text-secondary'}`}
              >
                📄 Hasil Analisis
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`flex-1 py-4 px-6 text-sm cursor-pointer text-center flex items-center justify-center gap-2 border-b-2 transition-all duration-200
                  ${activeTab === 'quiz' 
                    ? 'text-lentera-green border-lentera-green font-semibold' 
                    : 'text-lentera-muted border-transparent font-medium hover:text-lentera-text-secondary'}`}
              >
                🎮 Kuis Mikro
                {quizData && quizData.length > 0 && (
                  <span className="ml-1.5 bg-lentera-green-subtle text-lentera-green text-[10px] px-1.5 py-0.5 rounded-full border border-lentera-green-glow">
                    {quizData.length}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Output Content */}
          <div className="p-6 md:p-10 flex-1 overflow-auto relative custom-scrollbar">
            {!resultData && !isLoading && (
              <div className="flex flex-col items-center justify-center h-full min-h-96 gap-8 py-16 px-8 animate-fade-up">
                {/* Large mascot placeholder */}
                <div className="w-32 h-32 relative opacity-80">
                  <Gambar 
                    src="/images/bagong.png"
                    alt="Bagong waiting"
                    width={128}
                    height={128}
                    className="object-contain drop-shadow-2xl"
                  />
                </div>

                <div className="text-center max-w-sm">
                  <h3 className="font-display font-bold text-xl text-lentera-text mb-3">
                    Siap saat kamu siap
                  </h3>
                  <p className="text-lentera-text-secondary text-base leading-relaxed">
                    Tempel materi belajarmu di sebelah kiri, pilih lensa budaya, 
                    dan klik ANALISIS SEKARANG untuk memulai.
                  </p>
                </div>

                {/* Quick lens suggestions */}
                <div className="flex flex-wrap justify-center gap-3">
                  {['🌴 Coba Nusantara', '⛩ Coba Japanese', '⚡ Coba Viking', '🎮 Coba Gamer'].map(s => (
                    <button key={s}
                      onClick={() => {
                        const label = s.split('Coba ')[1].toLowerCase()
                        const id = LENS_ITEMS.find(l => l.label.toLowerCase() === label)?.id
                        if (id) setSelectedLens(id)
                      }}
                      className="px-5 py-2.5 rounded-full border border-lentera-border2 text-sm text-lentera-text-secondary hover:border-lentera-green-glow hover:text-lentera-green bg-lentera-surface/30 hover:bg-lentera-surface transition-all active:scale-95"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex flex-col gap-8 animate-pulse">
                <div className="bg-lentera-surface border border-lentera-border rounded-2xl p-8 mb-4">
                  <div className="h-5 bg-lentera-surface2 rounded-full w-3/4 mb-5" />
                  <div className="h-5 bg-lentera-surface2 rounded-full w-1/2" />
                </div>
                <div className="h-56 bg-lentera-surface border border-lentera-border rounded-2xl" />
              </div>
            )}

            {!isLoading && resultData && activeTab === 'result' && (
              <div className="flex flex-col gap-6">
                <ResultCard 
                  onGenerateQuiz={handleGenerateQuiz} 
                  isGeneratingQuiz={isGeneratingQuiz} 
                />
              </div>
            )}

            {!isLoading && activeTab === 'quiz' && (
              quizData && quizData.length > 0 ? (
                <QuizCard quiz={quizData} lens={selectedLens} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-5 text-lentera-muted py-24 animate-fade-in-up">
                  <div className="text-6xl mb-2">🎮</div>
                  <p className="text-base font-semibold text-lentera-text-secondary">Belum ada kuis</p>
                  <p className="text-sm text-center max-w-[280px] leading-relaxed">
                    Buat analisis terlebih dahulu, lalu klik "Buat Kuis Mikro" di panel hasil.
                  </p>
                  {resultData && (
                    <button
                      onClick={handleGenerateQuiz}
                      disabled={isGeneratingQuiz}
                      className="mt-6 bg-lentera-green text-lentera-bg px-8 py-3.5 rounded-xl text-base font-bold shadow-lg shadow-lentera-green/10 hover:bg-green-300 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {isGeneratingQuiz ? '⟳ Generating...' : '✦ Buat Kuis Sekarang'}
                    </button>
                  )}
                </div>
              )
            )}
          </div>
        </main>
      </div>

      <HistoryPanel isOpen={historyOpen} onClose={() => setHistoryOpen(false)} />
      <HowToUseModal isOpen={howToOpen} onClose={() => setHowToOpen(false)} />
    </div>
  )
}
