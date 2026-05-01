'use client'

import { useState, useCallback } from 'react'
import {
  Zap,
  Loader2,
  BookOpen,
  FileQuestion,
  History,
  HelpCircle,
  X,
  Sparkles,
  BrainCircuit,
} from 'lucide-react'
import { useLenteraStore } from '@/store/useLenteraStore'
import InputField from '@/components/InputField'
import LensSelector from '@/components/LensSelector'
import ResultCard from '@/components/ResultCard'
import QuizCard from '@/components/QuizCard'
import AudioPlayer from '@/components/AudioPlayer'
import HistoryPanel from '@/components/HistoryPanel'
import LoadingSpinner from '@/components/LoadingSpinner'
import type { ResultData, QuizItem, TabType } from '@/types'

// ─── Konstanta ──────────────────────────────────────────────
const MIN_TEXT = 50
const ANALYSIS_LABEL   = 'Sedang menganalisis materi…'
const ANALYSIS_SUBTITLE = 'Lensa budaya sedang memproses konten'

// ─── Empty State Output ──────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6 animate-fade-in">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-lentera-surface2 border border-lentera-border flex items-center justify-center">
          <BrainCircuit size={34} className="text-lentera-muted" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-lentera-green-subtle border border-lentera-green-glow flex items-center justify-center">
          <Sparkles size={11} className="text-lentera-green" />
        </div>
      </div>
      <div className="text-center max-w-[260px]">
        <p className="text-base font-semibold text-lentera-text-secondary font-display">
          Siap saat kamu siap
        </p>
        <p className="text-sm text-lentera-muted mt-1.5 leading-relaxed">
          Tempel materi di kiri, pilih lensa budaya, lalu tekan{' '}
          <span className="text-lentera-green font-medium">Analisis Sekarang</span>
        </p>
      </div>
      {/* Tips */}
      <div className="w-full max-w-[300px] rounded-[14px] border border-lentera-border bg-lentera-surface2 px-4 py-3.5 space-y-2">
        {[
          '🎓 Teks kuliah, slide PDF, atau catatan tangan',
          '🎙️ Rekaman audio kelas (transkrip otomatis)',
          '📷 Foto papan tulis atau soal ujian',
        ].map((tip, i) => (
          <p key={i} className="text-xs text-lentera-muted leading-relaxed">{tip}</p>
        ))}
      </div>
    </div>
  )
}

// ─── Modal Cara Pakai ────────────────────────────────────────
function CaraPakaiModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-lentera-border bg-lentera-surface shadow-2xl animate-fade-in-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-lentera-border">
          <h2 className="text-sm font-semibold text-lentera-text">Cara Pakai LENTERA</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-[6px] flex items-center justify-center text-lentera-muted hover:text-lentera-text hover:bg-lentera-surface2 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
        <div className="px-5 py-5 space-y-4">
          {[
            { step: '1', title: 'Tempel Materi', desc: 'Masukkan teks, upload gambar catatan, atau rekaman audio kuliah.' },
            { step: '2', title: 'Pilih Lensa Budaya', desc: 'Pilih suku/budaya yang paling dekat dengan konteks belajarmu.' },
            { step: '3', title: 'Analisis', desc: 'AI akan menjelaskan materi dalam bahasa ramah disleksia + analogi budaya.' },
            { step: '4', title: 'Kuis & Audio', desc: 'Uji pemahaman dengan kuis, atau dengarkan penjelasan dengan TTS.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex items-start gap-3.5">
              <div className="w-7 h-7 rounded-full bg-lentera-green-subtle border border-lentera-green-glow flex items-center justify-center shrink-0 text-xs font-bold text-lentera-green">
                {step}
              </div>
              <div>
                <p className="text-sm font-semibold text-lentera-text">{title}</p>
                <p className="text-xs text-lentera-muted mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 pb-5">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-[10px] bg-lentera-green text-lentera-bg text-sm font-semibold hover:bg-lentera-green-dim transition-colors"
          >
            Mengerti, mulai belajar!
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Halaman Utama ───────────────────────────────────────────
export default function DashboardPage() {
  // Store selectors
  const inputText    = useLenteraStore((s) => s.inputText)
  const selectedLens = useLenteraStore((s) => s.selectedLens)
  const isLoading    = useLenteraStore((s) => s.isLoading)
  const activeTab    = useLenteraStore((s) => s.activeTab)
  const resultData   = useLenteraStore((s) => s.resultData)
  const quizData     = useLenteraStore((s) => s.quizData)
  const history      = useLenteraStore((s) => s.history)

  const setLoading   = useLenteraStore((s) => s.setLoading)
  const setResult    = useLenteraStore((s) => s.setResult)
  const setQuiz      = useLenteraStore((s) => s.setQuiz)
  const setActiveTab = useLenteraStore((s) => s.setActiveTab)
  const addHistory   = useLenteraStore((s) => s.addHistory)
  const addToast     = useLenteraStore((s) => s.addToast)
  const resetSession = useLenteraStore((s) => s.resetSession)

  // Local UI state
  const [isHistoryOpen,  setIsHistoryOpen]  = useState(false)
  const [isCaraPakaiOpen, setIsCaraPakaiOpen] = useState(false)
  const [isQuizLoading,  setIsQuizLoading]  = useState(false)

  // ── Generate Analisis ──
  const handleGenerateAnalysis = useCallback(async () => {
    if (inputText.trim().length < MIN_TEXT) {
      addToast({ type: 'warning', message: `Teks minimal ${MIN_TEXT} karakter.` })
      return
    }

    setLoading(true)
    resetSession()

    try {
      const res = await fetch('/api/generate-lens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText.trim(), lens: selectedLens }),
      })

      const json = await res.json() as { success: boolean; data?: ResultData; error?: string }

      if (!json.success || !json.data) {
        throw new Error(json.error ?? 'Analisis gagal.')
      }

      setResult(json.data)
      setActiveTab('result')

      // Auto-save ke history
      addHistory({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        inputText: inputText.trim(),
        lens: selectedLens,
        result: json.data,
        timestamp: Date.now(),
      })

      addToast({ type: 'success', message: 'Analisis selesai! ✨' })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menganalisis materi.'
      addToast({ type: 'error', message: msg })
    } finally {
      setLoading(false)
    }
  }, [inputText, selectedLens, setLoading, resetSession, setResult, setActiveTab, addHistory, addToast])

  // ── Generate Kuis ──
  const handleGenerateQuiz = useCallback(async () => {
    if (inputText.trim().length < MIN_TEXT) {
      addToast({ type: 'warning', message: 'Tidak ada materi untuk dibuat kuis.' })
      return
    }

    setIsQuizLoading(true)

    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText.trim(), lens: selectedLens }),
      })

      const json = await res.json() as { success: boolean; data?: QuizItem[]; error?: string }

      if (!json.success || !json.data) {
        throw new Error(json.error ?? 'Kuis gagal dibuat.')
      }

      setQuiz(json.data)
      setActiveTab('quiz')
      addToast({ type: 'success', message: 'Kuis siap! 🎯' })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal membuat kuis.'
      addToast({ type: 'error', message: msg })
    } finally {
      setIsQuizLoading(false)
    }
  }, [inputText, selectedLens, setQuiz, setActiveTab, addToast])

  const isInputValid = inputText.trim().length >= MIN_TEXT

  return (
    <div className="flex flex-col h-screen bg-lentera-bg overflow-hidden">

      {/* ════════════════════════════════════
          TOPBAR
      ════════════════════════════════════ */}
      <header
        className="shrink-0 glass-strong z-30 flex items-center justify-between px-5 py-3"
        style={{ borderTop: '2px solid #4ade80' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[8px] bg-lentera-green-subtle border border-lentera-green-glow flex items-center justify-center">
            <Zap size={16} className="text-lentera-green" />
          </div>
          <div>
            <span className="text-sm font-bold text-lentera-text font-display tracking-wide">
              LENTERA
            </span>
            <span className="hidden sm:inline text-[10px] text-lentera-muted ml-2">
              Platform Pembelajaran AI
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            id="btn-cara-pakai"
            type="button"
            onClick={() => setIsCaraPakaiOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-medium text-lentera-muted hover:text-lentera-text hover:bg-lentera-surface2 border border-transparent hover:border-lentera-border transition-all"
          >
            <HelpCircle size={13} className="shrink-0" />
            <span className="hidden sm:inline">Cara Pakai</span>
          </button>

          <button
            id="btn-history"
            type="button"
            onClick={() => setIsHistoryOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-medium border border-lentera-border bg-lentera-surface2 text-lentera-text-secondary hover:border-lentera-border2 hover:text-lentera-text transition-all"
          >
            <History size={13} className="shrink-0" />
            <span className="hidden sm:inline">Riwayat</span>
            {history.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-lentera-green-subtle border border-lentera-green-glow text-[9px] font-bold text-lentera-green flex items-center justify-center">
                {history.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ════════════════════════════════════
          SPLIT VIEW (main)
      ════════════════════════════════════ */}
      <main className="flex-1 overflow-hidden flex flex-col lg:grid lg:grid-cols-[460px_1fr]">

        {/* ── KOLOM KIRI: Input Panel ── */}
        <section
          aria-label="Panel Input Materi"
          className="flex flex-col border-b lg:border-b-0 lg:border-r border-lentera-border bg-lentera-surface overflow-y-auto custom-scrollbar max-h-[50vh] lg:max-h-none"
        >
          <div className="p-5 flex flex-col gap-5">

            {/* ─ Materi ─ */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <BookOpen size={13} className="text-lentera-muted shrink-0" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-lentera-muted">
                  Materi untuk Dipelajari
                </h2>
              </div>
              <div className="rounded-lentera border border-lentera-border bg-lentera-bg overflow-hidden">
                <InputField />
              </div>
            </div>

            {/* ─ Lensa ─ */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-lentera-muted">🌏</span>
                <h2 className="text-xs font-bold uppercase tracking-widest text-lentera-muted">
                  Pilih Lensa Budaya
                </h2>
              </div>
              <LensSelector variant="dropdown" />
            </div>

            {/* ─ Tombol Analisis ─ */}
            <button
              id="btn-analyze"
              type="button"
              onClick={handleGenerateAnalysis}
              disabled={isLoading || !isInputValid}
              className={[
                'w-full flex items-center justify-center gap-2.5',
                'py-4 px-6 rounded-xl font-bold text-sm font-display',
                'transition-all duration-200 border',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lentera-green/50',
                isLoading || !isInputValid
                  ? 'bg-lentera-surface2 border-lentera-border text-lentera-muted cursor-not-allowed opacity-60'
                  : [
                      'bg-lentera-green border-lentera-green text-lentera-bg',
                      'hover:bg-lentera-green-dim hover:border-lentera-green-dim',
                      'hover:shadow-xl hover:shadow-lentera-green/25',
                      'active:scale-[0.98]',
                    ].join(' '),
              ].join(' ')}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin shrink-0" />
                  {ANALYSIS_LABEL}
                </>
              ) : (
                <>
                  <Zap size={16} className="shrink-0" />
                  ANALISIS SEKARANG
                </>
              )}
            </button>

            {!isInputValid && !isLoading && (
              <p className="text-center text-[11px] text-lentera-muted -mt-3">
                Butuh minimal {MIN_TEXT} karakter · sekarang {inputText.trim().length}
              </p>
            )}
          </div>
        </section>

        {/* ── KOLOM KANAN: Output Panel ── */}
        <section
          aria-label="Panel Output Hasil"
          className="flex flex-col bg-lentera-bg overflow-hidden"
        >
          {/* Tab Bar */}
          <div
            className="shrink-0 flex border-b border-lentera-border bg-lentera-surface px-5"
            role="tablist"
            aria-label="Tab hasil"
          >
            {(
              [
                { tab: 'result' as TabType, label: 'Hasil Analisis', icon: BookOpen },
                { tab: 'quiz'   as TabType, label: 'Kuis Mikro',     icon: FileQuestion },
              ] as const
            ).map(({ tab, label, icon: Icon }) => {
              const active = activeTab === tab
              return (
                <button
                  key={tab}
                  id={`output-tab-${tab}`}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  aria-controls={`output-panel-${tab}`}
                  onClick={() => setActiveTab(tab)}
                  disabled={tab === 'quiz' && !quizData && !isQuizLoading}
                  className={[
                    'flex items-center gap-1.5 px-4 py-3 text-sm font-medium',
                    'border-b-2 -mb-px transition-all duration-200',
                    'disabled:opacity-30 disabled:cursor-not-allowed',
                    active
                      ? 'text-lentera-green border-lentera-green'
                      : 'text-lentera-muted border-transparent hover:text-lentera-text-secondary hover:border-lentera-border2',
                  ].join(' ')}
                >
                  <Icon size={13} className="shrink-0" />
                  {label}
                  {tab === 'quiz' && quizData && (
                    <span className="w-4 h-4 rounded-full bg-lentera-green-subtle border border-lentera-green-glow text-[9px] font-bold text-lentera-green flex items-center justify-center">
                      {quizData.length}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Output Content */}
          <div
            id={`output-panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`output-tab-${activeTab}`}
            className="flex-1 overflow-y-auto custom-scrollbar px-5 py-5"
          >
            {/* ─ Loading ─ */}
            {isLoading && (
              <LoadingSpinner
                label={ANALYSIS_LABEL}
                subtitle={ANALYSIS_SUBTITLE}
              />
            )}

            {/* ─ Tab: Hasil Analisis ─ */}
            {!isLoading && activeTab === 'result' && (
              <>
                {resultData ? (
                  <div className="flex flex-col gap-5">
                    {/* AudioPlayer di atas ResultCard */}
                    <AudioPlayer
                      text={resultData.dyslexiaFriendlyText}
                      className="shrink-0"
                    />
                    <ResultCard
                      data={resultData}
                      onGenerateQuiz={handleGenerateQuiz}
                      isQuizLoading={isQuizLoading}
                    />
                  </div>
                ) : (
                  <EmptyState />
                )}
              </>
            )}

            {/* ─ Tab: Kuis Mikro ─ */}
            {!isLoading && activeTab === 'quiz' && (
              <>
                {isQuizLoading && (
                  <LoadingSpinner
                    label="Membuat kuis dari materi…"
                    subtitle="3 soal pilihan ganda sedang disiapkan"
                  />
                )}
                {!isQuizLoading && quizData && (
                  <QuizCard
                    items={quizData}
                    onFinish={(score, total) => {
                      addToast({
                        type: score === total ? 'success' : 'info',
                        message: `Kuis selesai! Skor kamu: ${score}/${total}`,
                      })
                    }}
                  />
                )}
                {!isQuizLoading && !quizData && (
                  <EmptyState />
                )}
              </>
            )}
          </div>
        </section>
      </main>

      {/* ════════════════════════════════════
          OVERLAY COMPONENTS
      ════════════════════════════════════ */}
      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

      {isCaraPakaiOpen && (
        <CaraPakaiModal onClose={() => setIsCaraPakaiOpen(false)} />
      )}
    </div>
  )
}
