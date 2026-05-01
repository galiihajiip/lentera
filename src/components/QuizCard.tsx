'use client'

import { useState, useCallback } from 'react'
import {
  Trophy,
  Target,
  RotateCcw,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  BookOpen,
} from 'lucide-react'
import type { QuizItem, CorrectAnswer, Difficulty } from '@/types'

// ─── Konstanta ──────────────────────────────────────────────
const LETTER_TO_INDEX: Record<CorrectAnswer, number> = { A: 0, B: 1, C: 2, D: 3 }

const DIFFICULTY_META: Record<Difficulty, { label: string; color: string }> = {
  mudah:  { label: 'Mudah',  color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50' },
  sedang: { label: 'Sedang', color: 'text-amber-400   bg-amber-950/40   border-amber-800/50'  },
  sulit:  { label: 'Sulit',  color: 'text-rose-400    bg-rose-950/40    border-rose-800/50'   },
}

const ANSWER_LETTERS: CorrectAnswer[] = ['A', 'B', 'C', 'D']

// ─── Utils ──────────────────────────────────────────────────
function getOptionLabel(option: string): string {
  // Hapus prefix "A) ", "B) " dll jika ada
  return option.replace(/^[A-D]\)\s*/, '')
}

// ─── Komponen Utama ─────────────────────────────────────────
interface QuizCardProps {
  items: QuizItem[]
  onFinish?: (score: number, total: number) => void
}

export default function QuizCard({ items, onFinish }: QuizCardProps) {
  const [currentIndex, setCurrentIndex]     = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<CorrectAnswer | null>(null)
  const [isAnswered, setIsAnswered]         = useState(false)
  const [score, setScore]                   = useState(0)
  const [showFinished, setShowFinished]     = useState(false)
  const [animKey, setAnimKey]               = useState(0)   // re-mount untuk animasi per soal

  const total        = items.length
  const currentItem  = items[currentIndex]
  const progress     = ((currentIndex + (isAnswered ? 1 : 0)) / total) * 100

  // ── Pilih jawaban ──
  const handleSelect = useCallback(
    (letter: CorrectAnswer) => {
      if (isAnswered) return
      setSelectedAnswer(letter)
      setIsAnswered(true)
      if (letter === currentItem.correctAnswer) {
        setScore((s) => s + 1)
      }
    },
    [isAnswered, currentItem]
  )

  // ── Lanjut ke soal berikutnya ──
  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= total) {
      // Hitung skor final di sini untuk menghindari stale closure
      const finalScore = score
      setShowFinished(true)
      onFinish?.(finalScore, total)
    } else {
      setCurrentIndex((i) => i + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
      setAnimKey((k) => k + 1)
    }
  }, [currentIndex, total, score, onFinish])

  // ── Ulangi kuis ──
  const handleReset = useCallback(() => {
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setScore(0)
    setShowFinished(false)
    setAnimKey((k) => k + 1)
  }, [])

  // ── Layar Selesai ──
  if (showFinished) {
    return <FinishedScreen score={score} total={total} onReset={handleReset} />
  }

  const difficulty = currentItem.difficulty as Difficulty
  const diffMeta   = DIFFICULTY_META[difficulty] ?? DIFFICULTY_META.sedang
  const correctIdx = LETTER_TO_INDEX[currentItem.correctAnswer]

  return (
    <div className="flex flex-col gap-4 animate-fade-in-up">

      {/* ── Header: Progress ── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-lentera-muted font-medium">
            Pertanyaan {currentIndex + 1} dari {total}
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-[6px] border ${diffMeta.color}`}>
            {diffMeta.label}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 rounded-full bg-lentera-border overflow-hidden">
          <div
            className="h-full rounded-full bg-lentera-green transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ── Pertanyaan ── */}
      <div
        key={`question-${animKey}`}
        className="rounded-2xl border border-lentera-border bg-lentera-surface px-5 py-5 animate-fade-in-up"
      >
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-[8px] bg-lentera-green-subtle border border-lentera-green-glow flex items-center justify-center shrink-0 mt-0.5">
            <BookOpen size={13} className="text-lentera-green" />
          </div>
          <p className="text-base font-semibold text-lentera-text leading-snug font-body">
            {currentItem.question}
          </p>
        </div>
      </div>

      {/* ── Opsi Jawaban ── */}
      <div
        key={`options-${animKey}`}
        className="flex flex-col gap-2.5"
      >
        {ANSWER_LETTERS.map((letter, idx) => {
          const optionText = getOptionLabel(currentItem.options[idx])
          const isCorrect  = idx === correctIdx
          const isSelected = selectedAnswer === letter
          const isWrong    = isAnswered && isSelected && !isCorrect

          // ── State visual setelah dijawab ──
          let stateClass = ''
          if (isAnswered) {
            if (isCorrect) {
              // Jawaban benar selalu highlight
              stateClass = 'border-lentera-green bg-lentera-green-subtle text-lentera-green-text'
            } else if (isWrong) {
              // Yang dipilih tapi salah
              stateClass = 'border-rose-700 bg-rose-900/10 text-rose-300'
            } else {
              // Pilihan lain yang tidak relevan
              stateClass = 'border-lentera-border/40 opacity-40 grayscale text-lentera-muted'
            }
          } else {
            // Belum dijawab: hover interaktif
            stateClass = [
              'border-lentera-border bg-lentera-surface text-lentera-text',
              'hover:border-lentera-border2 hover:bg-lentera-surface2 cursor-pointer',
              'active:scale-[0.99]',
            ].join(' ')
          }

          return (
            <button
              key={letter}
              id={`quiz-option-${letter}`}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`Pilihan ${letter}: ${optionText}`}
              onClick={() => handleSelect(letter)}
              disabled={isAnswered}
              className={[
                'flex items-center gap-3 px-4 py-3.5 rounded-[14px] border',
                'text-left w-full transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lentera-green/40',
                'disabled:cursor-default',
                stateClass,
              ].join(' ')}
              style={{
                animationDelay: `${idx * 60}ms`,
                animationFillMode: 'both',
              }}
            >
              {/* Letter badge */}
              <span
                className={[
                  'w-7 h-7 rounded-[8px] flex items-center justify-center text-xs font-bold shrink-0',
                  'transition-all duration-200',
                  isAnswered && isCorrect
                    ? 'bg-lentera-green text-lentera-bg'
                    : isAnswered && isWrong
                    ? 'bg-rose-700/60 text-rose-200'
                    : isAnswered
                    ? 'bg-lentera-surface2 text-lentera-muted'
                    : 'bg-lentera-surface2 text-lentera-text-secondary group-hover:bg-lentera-border2',
                ].join(' ')}
              >
                {letter}
              </span>

              {/* Teks opsi */}
              <span className="flex-1 text-sm leading-snug font-body">{optionText}</span>

              {/* Icon feedback */}
              {isAnswered && isCorrect && (
                <CheckCircle2 size={16} className="shrink-0 text-lentera-green" />
              )}
              {isAnswered && isWrong && (
                <XCircle size={16} className="shrink-0 text-rose-400" />
              )}
            </button>
          )
        })}
      </div>

      {/* ── Penjelasan Kultural (muncul setelah jawab) ── */}
      {isAnswered && (
        <div className="rounded-[14px] border border-lentera-border bg-lentera-surface2 px-4 py-4 animate-fade-in">
          <div className="flex items-start gap-2.5">
            <Sparkles size={14} className="text-lentera-green shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-lentera-muted mb-1.5">
                Penjelasan Budaya
              </p>
              <p className="text-sm italic leading-relaxed text-lentera-text-secondary font-body">
                {currentItem.culturalExplanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Tombol Lanjut ── */}
      {isAnswered && (
        <button
          id="quiz-next-btn"
          type="button"
          onClick={handleNext}
          className={[
            'w-full flex items-center justify-center gap-2',
            'px-5 py-3.5 rounded-2xl font-semibold text-sm',
            'bg-lentera-green text-lentera-bg border border-lentera-green',
            'hover:bg-lentera-green-dim hover:border-lentera-green-dim',
            'hover:shadow-lg hover:shadow-lentera-green/20',
            'active:scale-[0.98] transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lentera-green/50',
            'animate-fade-in-up',
          ].join(' ')}
        >
          {currentIndex + 1 >= total ? (
            <>
              <Trophy size={15} className="shrink-0" />
              Lihat Skor
            </>
          ) : (
            <>
              Soal Berikutnya
              <ChevronRight size={15} className="shrink-0" />
            </>
          )}
        </button>
      )}
    </div>
  )
}

// ─── Layar Selesai ───────────────────────────────────────────
function FinishedScreen({
  score,
  total,
  onReset,
}: {
  score: number
  total: number
  onReset: () => void
}) {
  const isPerfect    = score === total
  const percentage   = Math.round((score / total) * 100)

  // Pesan berdasarkan skor
  const message = isPerfect
    ? 'Luar biasa! Kamu menguasai semua materi!'
    : score >= Math.ceil(total / 2)
    ? 'Bagus! Terus tingkatkan pemahamanmu.'
    : 'Jangan menyerah — coba lagi untuk hasil lebih baik!'

  return (
    <div className="flex flex-col items-center gap-6 py-6 animate-fade-in-up">

      {/* Icon skor */}
      <div
        className={[
          'w-20 h-20 rounded-full flex items-center justify-center',
          'border-2 transition-all',
          isPerfect
            ? 'border-lentera-green bg-lentera-green-subtle shadow-lg shadow-lentera-green/30'
            : 'border-lentera-border2 bg-lentera-surface2',
        ].join(' ')}
      >
        {isPerfect ? (
          <Trophy size={36} className="text-lentera-green" />
        ) : (
          <Target size={36} className="text-lentera-text-secondary" />
        )}
      </div>

      {/* Judul */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-lentera-text font-display mb-1">
          Kuis Selesai! 🎉
        </h3>
        <p className="text-lentera-muted text-sm">{message}</p>
      </div>

      {/* Skor display */}
      <div className="w-full max-w-[280px] rounded-2xl border border-lentera-border bg-lentera-surface px-6 py-5 flex flex-col items-center gap-3">
        <p className="text-sm text-lentera-muted">Skor kamu</p>

        {/* Angka besar */}
        <div className="flex items-baseline gap-1">
          <span
            className={`text-6xl font-bold font-display ${
              isPerfect ? 'text-lentera-green' : 'text-lentera-text'
            }`}
          >
            {score}
          </span>
          <span className="text-2xl text-lentera-muted font-display">/{total}</span>
        </div>

        {/* Persentase */}
        <span
          className={[
            'text-sm font-semibold px-3 py-1 rounded-full border',
            isPerfect
              ? 'text-lentera-green border-lentera-green-glow bg-lentera-green-subtle'
              : percentage >= 50
              ? 'text-amber-400 border-amber-800/50 bg-amber-950/30'
              : 'text-rose-400 border-rose-800/50 bg-rose-950/30',
          ].join(' ')}
        >
          {percentage}%
        </span>

        {/* Mini progress bar */}
        <div className="w-full h-2 rounded-full bg-lentera-border overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              isPerfect ? 'bg-lentera-green' : percentage >= 50 ? 'bg-amber-400' : 'bg-rose-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Breakdown per soal */}
        <div className="flex gap-1.5 mt-1">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-[8px] flex items-center justify-center text-xs font-bold border ${
                i < score
                  ? 'bg-lentera-green-subtle border-lentera-green-glow text-lentera-green'
                  : 'bg-lentera-surface2 border-lentera-border text-lentera-muted'
              }`}
            >
              {i < score ? '✓' : '✗'}
            </div>
          ))}
        </div>
      </div>

      {/* Tombol Ulangi */}
      <button
        id="quiz-reset-btn"
        type="button"
        onClick={onReset}
        className={[
          'flex items-center gap-2 px-6 py-3.5 rounded-2xl',
          'font-semibold text-sm transition-all duration-200',
          'bg-lentera-green text-lentera-bg border border-lentera-green',
          'hover:bg-lentera-green-dim hover:border-lentera-green-dim',
          'hover:shadow-lg hover:shadow-lentera-green/20',
          'active:scale-[0.98]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lentera-green/50',
        ].join(' ')}
      >
        <RotateCcw size={14} className="shrink-0" />
        Ulangi Kuis
      </button>
    </div>
  )
}
