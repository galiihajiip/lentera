'use client'

import { useState, useCallback, useRef } from 'react'
import {
  Brain,
  Globe,
  AlertTriangle,
  BookOpen,
  Sparkles,
  Volume2,
  VolumeX,
  Loader2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { useLenteraStore } from '@/store/useLenteraStore'
import { LENS_ITEMS } from '@/components/LensSelector'
import type { ResultData, GlossaryItem } from '@/types'

// ─── TTS Hook ───────────────────────────────────────────────
function useTTS() {
  const [speakingId, setSpeakingId] = useState<string | null>(null)
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null)

  const speak = useCallback((text: string, id: string) => {
    if (!('speechSynthesis' in window)) return

    // Stop jika sedang bicara
    if (speakingId === id) {
      window.speechSynthesis.cancel()
      setSpeakingId(null)
      return
    }

    window.speechSynthesis.cancel()

    const utt = new SpeechSynthesisUtterance(
      // Bersihkan markdown bold sebelum TTS
      text.replace(/\*\*(.*?)\*\*/g, '$1')
    )
    utt.lang = 'id-ID'
    utt.rate = 0.85
    utt.pitch = 1
    utt.onend = () => setSpeakingId(null)
    utt.onerror = () => setSpeakingId(null)

    utterRef.current = utt
    window.speechSynthesis.speak(utt)
    setSpeakingId(id)
  }, [speakingId])

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    setSpeakingId(null)
  }, [])

  return { speakingId, speak, stop }
}

// ─── Render teks dengan markdown bold ────────────────────────
function RichText({ text, className = '' }: { text: string; className?: string }) {
  const parts = text.split(/(\*\*.*?\*\*)/g)
  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i} className="text-lentera-text font-semibold">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  )
}

// ─── Teks disleksia: pecah per baris/bullet ──────────────────
function DyslexiaText({ text }: { text: string }) {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  return (
    <div className="space-y-3">
      {lines.map((line, i) => {
        const isBullet = line.startsWith('-') || line.startsWith('•') || line.startsWith('*') && !line.startsWith('**')
        const clean = isBullet ? line.replace(/^[-•*]\s*/, '') : line

        return isBullet ? (
          <div key={i} className="flex items-start gap-2.5">
            <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-lentera-green shrink-0" />
            <p className="text-lg leading-loose text-lentera-text-secondary font-body">
              <RichText text={clean} />
            </p>
          </div>
        ) : (
          <p key={i} className="text-lg leading-loose text-lentera-text-secondary font-body">
            <RichText text={clean} />
          </p>
        )
      })}
    </div>
  )
}

// ─── Section wrapper ─────────────────────────────────────────
function Section({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
  return (
    <div
      className="rounded-2xl border border-lentera-border bg-lentera-surface overflow-hidden animate-fade-in-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      {children}
    </div>
  )
}

// ─── TTS Button ──────────────────────────────────────────────
function TTSButton({
  text,
  id,
  speakingId,
  onSpeak,
}: {
  text: string
  id: string
  speakingId: string | null
  onSpeak: (text: string, id: string) => void
}) {
  const active = speakingId === id
  return (
    <button
      type="button"
      onClick={() => onSpeak(text, id)}
      aria-label={active ? 'Hentikan audio' : 'Dengarkan teks'}
      className={[
        'flex items-center gap-1.5 px-3 py-1.5 rounded-[8px]',
        'text-xs font-medium transition-all duration-200 border',
        active
          ? 'bg-lentera-green-subtle border-lentera-green-glow text-lentera-green animate-pulse-slow'
          : 'bg-lentera-surface2 border-lentera-border text-lentera-muted hover:text-lentera-text hover:border-lentera-border2',
      ].join(' ')}
    >
      {active ? <Volume2 size={12} className="shrink-0" /> : <VolumeX size={12} className="shrink-0" />}
      {active ? 'Hentikan' : 'Dengarkan'}
    </button>
  )
}

// ─── Badge ───────────────────────────────────────────────────
function Badge({ children, variant = 'green' }: { children: React.ReactNode; variant?: 'green' | 'amber' | 'blue' }) {
  const colors = {
    green: 'bg-lentera-green-subtle text-lentera-green-text border-lentera-green-glow',
    amber: 'bg-amber-950/40 text-amber-300 border-amber-800/50',
    blue:  'bg-sky-950/40 text-sky-300 border-sky-800/50',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-[6px] text-[10px] font-bold uppercase tracking-widest border ${colors[variant]}`}>
      {children}
    </span>
  )
}

// ─── Komponen Utama ─────────────────────────────────────────
interface ResultCardProps {
  data: ResultData
  onGenerateQuiz: () => void
  isQuizLoading?: boolean
}

export default function ResultCard({ data, onGenerateQuiz, isQuizLoading = false }: ResultCardProps) {
  const selectedLens  = useLenteraStore((s) => s.selectedLens)
  const { speakingId, speak } = useTTS()

  const lensItem = LENS_ITEMS.find((l) => l.id === selectedLens)
  const lensLabel = lensItem ? `${lensItem.emoji} ${lensItem.label}` : selectedLens

  const [glossaryOpen, setGlossaryOpen] = useState(true)

  return (
    <div className="flex flex-col gap-5">

      {/* ── 1. Teks Ramah Disleksia ── */}
      <Section delay={0}>
        <div className="px-5 py-4 border-b border-lentera-border flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[8px] bg-lentera-green-subtle border border-lentera-green-glow flex items-center justify-center shrink-0">
              <Brain size={15} className="text-lentera-green" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-lentera-text leading-none">Penjelasan</span>
              <Badge variant="green">Ramah Disleksia</Badge>
            </div>
          </div>
          <TTSButton
            text={data.dyslexiaFriendlyText}
            id="dyslexia"
            speakingId={speakingId}
            onSpeak={speak}
          />
        </div>
        <div className="px-5 py-5">
          <DyslexiaText text={data.dyslexiaFriendlyText} />
        </div>
      </Section>

      {/* ── 2. Analogi Budaya ── */}
      <Section delay={80}>
        <div className="px-5 py-4 border-b border-lentera-border flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[8px] bg-sky-950/40 border border-sky-800/50 flex items-center justify-center shrink-0">
              <Globe size={15} className="text-sky-400" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-lentera-text leading-none">Analogi Budaya</span>
              <Badge variant="blue">{lensLabel}</Badge>
            </div>
          </div>
          <TTSButton
            text={data.culturalAnalogy}
            id="analogy"
            speakingId={speakingId}
            onSpeak={speak}
          />
        </div>
        <div className="px-5 py-5">
          {/* Glassmorphism quote box */}
          <div className="glass rounded-[14px] px-5 py-4 border border-lentera-border/60">
            <div className="space-y-3">
              {data.culturalAnalogy
                .split('\n')
                .map((l) => l.trim())
                .filter(Boolean)
                .map((para, i) => (
                  <p
                    key={i}
                    className="text-base leading-relaxed italic text-lentera-text-secondary font-body"
                  >
                    <RichText text={para} />
                  </p>
                ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── 3. Peringatan Batas Ujian ── */}
      <Section delay={160}>
        <div className="px-5 py-4 border-b border-amber-800/30 flex items-center gap-2.5 bg-amber-950/20">
          <div className="w-8 h-8 rounded-[8px] bg-amber-950/50 border border-amber-800/50 flex items-center justify-center shrink-0">
            <AlertTriangle size={15} className="text-amber-400" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold text-lentera-text leading-none">Batas Ujian</span>
            <Badge variant="amber">⚠️ Peringatan Penting</Badge>
          </div>
        </div>
        <div className="px-5 py-5 bg-amber-950/10">
          <div className="space-y-2.5">
            {data.examBoundary
              .split('\n')
              .map((l) => l.trim())
              .filter(Boolean)
              .map((line, i) => {
                const isBullet = line.startsWith('-') || line.startsWith('•')
                const clean = isBullet ? line.replace(/^[-•]\s*/, '') : line
                return isBullet ? (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    <p className="text-sm leading-relaxed text-amber-200/80 font-body">
                      <RichText text={clean} />
                    </p>
                  </div>
                ) : (
                  <p key={i} className="text-sm leading-relaxed text-amber-200/80 font-body">
                    <RichText text={clean} />
                  </p>
                )
              })}
          </div>
        </div>
      </Section>

      {/* ── 4. Glosarium Bilingual ── */}
      <Section delay={240}>
        <button
          type="button"
          onClick={() => setGlossaryOpen((p) => !p)}
          className="w-full px-5 py-4 flex items-center justify-between gap-3 border-b border-lentera-border hover:bg-lentera-surface2/50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[8px] bg-lentera-surface2 border border-lentera-border flex items-center justify-center shrink-0">
              <BookOpen size={15} className="text-lentera-text-secondary" />
            </div>
            <div className="text-left flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-lentera-text leading-none">Glosarium</span>
              <span className="text-[10px] text-lentera-muted">
                {data.bilingualGlossary.length} istilah · Indonesia–Inggris B1–Konteks Lokal
              </span>
            </div>
          </div>
          {glossaryOpen
            ? <ChevronUp size={14} className="text-lentera-muted shrink-0" />
            : <ChevronDown size={14} className="text-lentera-muted shrink-0" />
          }
        </button>

        {glossaryOpen && (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full min-w-[460px] text-sm">
              <thead>
                <tr className="border-b border-lentera-border bg-lentera-surface2/50">
                  <th className="px-5 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-lentera-muted w-[30%]">
                    Istilah
                  </th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-lentera-muted w-[30%]">
                    English B1
                  </th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-widest text-lentera-muted">
                    Konteks Lokal
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.bilingualGlossary.map((item: GlossaryItem, i: number) => (
                  <tr
                    key={i}
                    className={[
                      'border-b border-lentera-border/50 transition-colors',
                      'hover:bg-lentera-surface2/30',
                      i % 2 === 0 ? '' : 'bg-lentera-surface2/20',
                    ].join(' ')}
                  >
                    <td className="px-5 py-3 font-semibold text-lentera-green-text text-sm align-top">
                      {item.term}
                    </td>
                    <td className="px-4 py-3 text-lentera-text-secondary align-top">
                      {item.englishB1}
                    </td>
                    <td className="px-4 py-3 text-lentera-muted text-[13px] italic align-top leading-relaxed">
                      {item.localContext}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* ── 5. CTA: Buat Kuis ── */}
      <div
        className="animate-fade-in-up"
        style={{ animationDelay: '320ms', animationFillMode: 'both' }}
      >
        <button
          id="btn-generate-quiz"
          type="button"
          onClick={onGenerateQuiz}
          disabled={isQuizLoading}
          className={[
            'w-full flex items-center justify-center gap-2.5',
            'px-6 py-4 rounded-2xl font-semibold text-sm',
            'border transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lentera-green/40',
            isQuizLoading
              ? 'bg-lentera-surface border-lentera-border text-lentera-muted cursor-not-allowed'
              : [
                  'bg-lentera-green-subtle border-lentera-green-glow text-lentera-green-text',
                  'hover:bg-lentera-green hover:text-lentera-bg hover:border-lentera-green',
                  'hover:shadow-lg hover:shadow-lentera-green/20',
                  'active:scale-[0.98]',
                ].join(' '),
          ].join(' ')}
        >
          {isQuizLoading ? (
            <>
              <Loader2 size={16} className="animate-spin shrink-0" />
              Membuat kuis...
            </>
          ) : (
            <>
              <Sparkles size={16} className="shrink-0" />
              Buat Kuis dari Materi Ini
            </>
          )}
        </button>
        <p className="mt-2 text-center text-[11px] text-lentera-muted">
          3 soal pilihan ganda dengan analogi budaya {lensItem ? lensItem.label : 'Nusantara'}
        </p>
      </div>

    </div>
  )
}
