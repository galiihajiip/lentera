'use client'

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react'
import {
  Play,
  Pause,
  Square,
  Volume2,
  ChevronDown,
  Mic2,
} from 'lucide-react'

// ─── Utils ──────────────────────────────────────────────────
/**
 * Pecah teks menjadi token kata + posisi karakter awal.
 * Whitespace tetap disimpan agar charIndex boundary cocok.
 */
function tokenize(text: string): { word: string; start: number; isSpace: boolean }[] {
  const tokens: { word: string; start: number; isSpace: boolean }[] = []
  let i = 0
  while (i < text.length) {
    // Kumpulkan whitespace
    if (/\s/.test(text[i])) {
      let j = i
      while (j < text.length && /\s/.test(text[j])) j++
      tokens.push({ word: text.slice(i, j), start: i, isSpace: true })
      i = j
    } else {
      // Kumpulkan kata (non-whitespace)
      let j = i
      while (j < text.length && !/\s/.test(text[j])) j++
      tokens.push({ word: text.slice(i, j), start: i, isSpace: false })
      i = j
    }
  }
  return tokens
}

/** Bersihkan markdown **bold** sebelum dibaca. */
function stripMarkdown(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, '$1')
}

// ─── Konstanta ──────────────────────────────────────────────
const SPEED_OPTIONS: { label: string; value: number }[] = [
  { label: '0.5×', value: 0.5 },
  { label: '0.75×', value: 0.75 },
  { label: '1×',   value: 1.0 },
  { label: '1.25×', value: 1.25 },
  { label: '1.5×', value: 1.5 },
  { label: '2×',   value: 2.0 },
]

// ─── Tipe ────────────────────────────────────────────────────
type PlayerState = 'idle' | 'playing' | 'paused'

// ─── Komponen Utama ─────────────────────────────────────────
interface AudioPlayerProps {
  /** Teks yang akan dibacakan. Markdown bold (**term**) otomatis dibersihkan. */
  text: string
  className?: string
}

export default function AudioPlayer({ text, className = '' }: AudioPlayerProps) {
  const [playerState, setPlayerState] = useState<PlayerState>('idle')
  const [activeWordIdx, setActiveWordIdx] = useState<number>(-1)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoiceUri, setSelectedVoiceUri] = useState<string>('')
  const [rate, setRate] = useState(0.85)
  const [showVoicePicker, setShowVoicePicker] = useState(false)
  const [showSpeedPicker, setShowSpeedPicker] = useState(false)
  const [isSupported, setIsSupported] = useState(true)

  const utterRef    = useRef<SpeechSynthesisUtterance | null>(null)
  const wordRefs    = useRef<(HTMLSpanElement | null)[]>([])
  const voiceRef    = useRef<HTMLDivElement>(null)
  const speedRef    = useRef<HTMLDivElement>(null)

  // ── Cek dukungan browser ──
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false)
    }
  }, [])

  // ── Muat daftar suara ──
  useEffect(() => {
    if (!isSupported) return

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices()
      if (!available.length) return

      // Prioritas: Indonesian → Malay → semua
      const sorted = [...available].sort((a, b) => {
        const aId = a.lang.startsWith('id') ? 0 : a.lang.startsWith('ms') ? 1 : 2
        const bId = b.lang.startsWith('id') ? 0 : b.lang.startsWith('ms') ? 1 : 2
        return aId - bId
      })

      setVoices(sorted)

      // Set default: suara Indonesia pertama, fallback suara pertama
      if (!selectedVoiceUri) {
        const preferred = sorted.find((v) => v.lang.startsWith('id')) ?? sorted[0]
        if (preferred) setSelectedVoiceUri(preferred.voiceURI)
      }
    }

    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
    return () => {
      window.speechSynthesis.onvoiceschanged = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSupported])

  // ── Cleanup saat unmount ──
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  // ── Tokenisasi teks (cleaned) ──
  const cleanText = useMemo(() => stripMarkdown(text), [text])
  const tokens = useMemo(() => tokenize(cleanText), [cleanText])
  // Hanya token bukan spasi untuk referensi word index
  const wordTokens = useMemo(() => tokens.filter((t) => !t.isSpace), [tokens])

  // ── Auto-scroll kata aktif ke tengah ──
  useEffect(() => {
    const el = wordRefs.current[activeWordIdx]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }, [activeWordIdx])

  // ── Tutup picker saat klik luar ──
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (voiceRef.current && !voiceRef.current.contains(e.target as Node)) setShowVoicePicker(false)
      if (speedRef.current && !speedRef.current.contains(e.target as Node)) setShowSpeedPicker(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // ── Play ──
  const handlePlay = useCallback(() => {
    if (!isSupported) return

    // Resume dari pause
    if (playerState === 'paused') {
      window.speechSynthesis.resume()
      setPlayerState('playing')
      return
    }

    window.speechSynthesis.cancel()
    setActiveWordIdx(-1)

    const utt = new SpeechSynthesisUtterance(cleanText)
    utt.rate  = rate
    utt.pitch = 1

    // Set suara
    const voice = voices.find((v) => v.voiceURI === selectedVoiceUri)
    if (voice) {
      utt.voice = voice
      utt.lang  = voice.lang
    } else {
      utt.lang = 'id-ID'
    }

    // ── Word boundary highlighting ──
    utt.onboundary = (event: SpeechSynthesisEvent) => {
      if (event.name !== 'word') return
      const charIdx = event.charIndex
      // Cari word token yang charStart paling dekat dengan charIdx
      const idx = wordTokens.findIndex(
        (t, i) =>
          t.start <= charIdx &&
          (i === wordTokens.length - 1 || wordTokens[i + 1].start > charIdx)
      )
      if (idx !== -1) setActiveWordIdx(idx)
    }

    utt.onstart = () => setPlayerState('playing')
    utt.onend   = () => {
      setPlayerState('idle')
      setActiveWordIdx(-1)
    }
    utt.onerror = (e) => {
      // 'interrupted' adalah normal saat stop dipanggil
      if (e.error !== 'interrupted') {
        console.error('[AudioPlayer] TTS error:', e.error)
      }
      setPlayerState('idle')
      setActiveWordIdx(-1)
    }

    utterRef.current = utt
    window.speechSynthesis.speak(utt)
  }, [isSupported, playerState, cleanText, rate, voices, selectedVoiceUri, wordTokens])

  // ── Pause ──
  const handlePause = useCallback(() => {
    if (!isSupported) return
    window.speechSynthesis.pause()
    setPlayerState('paused')
  }, [isSupported])

  // ── Stop ──
  const handleStop = useCallback(() => {
    if (!isSupported) return
    window.speechSynthesis.cancel()
    setPlayerState('idle')
    setActiveWordIdx(-1)
  }, [isSupported])

  // ── Ganti kecepatan: restart jika sedang main ──
  const handleRateChange = useCallback(
    (newRate: number) => {
      setRate(newRate)
      setShowSpeedPicker(false)
      if (playerState === 'playing' || playerState === 'paused') {
        window.speechSynthesis.cancel()
        setPlayerState('idle')
        setActiveWordIdx(-1)
      }
    },
    [playerState]
  )

  // ── Ganti suara: restart jika sedang main ──
  const handleVoiceChange = useCallback(
    (uri: string) => {
      setSelectedVoiceUri(uri)
      setShowVoicePicker(false)
      if (playerState === 'playing' || playerState === 'paused') {
        window.speechSynthesis.cancel()
        setPlayerState('idle')
        setActiveWordIdx(-1)
      }
    },
    [playerState]
  )

  const selectedVoice = voices.find((v) => v.voiceURI === selectedVoiceUri)
  const selectedSpeed = SPEED_OPTIONS.find((s) => s.value === rate) ?? SPEED_OPTIONS[2]

  // ── Tidak didukung ──
  if (!isSupported) {
    return (
      <div className={`rounded-lentera border border-lentera-border bg-lentera-surface p-4 text-center ${className}`}>
        <p className="text-sm text-lentera-muted">
          Browser Anda tidak mendukung fitur Text-to-Speech.
        </p>
      </div>
    )
  }

  return (
    <div className={`flex flex-col gap-3 rounded-2xl border border-lentera-border bg-lentera-surface overflow-hidden ${className}`}>

      {/* ── Kontrol Utama ── */}
      <div className="px-4 pt-4 flex items-center gap-3 flex-wrap">

        {/* Play / Pause / Stop */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Play / Pause */}
          <button
            id="tts-play-pause"
            type="button"
            onClick={playerState === 'playing' ? handlePause : handlePlay}
            aria-label={playerState === 'playing' ? 'Jeda' : 'Putar'}
            className={[
              'w-10 h-10 rounded-full flex items-center justify-center',
              'transition-all duration-200 active:scale-95 focus-visible:outline-none',
              'focus-visible:ring-2 focus-visible:ring-lentera-green/50',
              playerState === 'playing'
                ? 'bg-lentera-green text-lentera-bg hover:bg-lentera-green-dim shadow-lg shadow-lentera-green/25'
                : 'bg-lentera-green text-lentera-bg hover:bg-lentera-green-dim shadow-md shadow-lentera-green/20',
            ].join(' ')}
          >
            {playerState === 'playing'
              ? <Pause size={16} className="shrink-0" />
              : <Play size={16} className="shrink-0 ml-0.5" />
            }
          </button>

          {/* Stop */}
          <button
            id="tts-stop"
            type="button"
            onClick={handleStop}
            disabled={playerState === 'idle'}
            aria-label="Hentikan"
            className={[
              'w-9 h-9 rounded-full flex items-center justify-center',
              'border transition-all duration-200 active:scale-95',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lentera-border2',
              playerState === 'idle'
                ? 'border-lentera-border text-lentera-muted opacity-40 cursor-not-allowed'
                : 'border-lentera-border2 text-lentera-text-secondary hover:text-lentera-warning hover:border-lentera-warning/50 bg-lentera-surface2',
            ].join(' ')}
          >
            <Square size={12} className="shrink-0" />
          </button>
        </div>

        {/* Status */}
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          {playerState === 'playing' && (
            <>
              <Volume2 size={12} className="text-lentera-green animate-pulse shrink-0" />
              <span className="text-xs text-lentera-green">Sedang dibaca</span>
            </>
          )}
          {playerState === 'paused' && (
            <span className="text-xs text-lentera-muted">Dijeda</span>
          )}
          {playerState === 'idle' && (
            <span className="text-xs text-lentera-muted">Siap dibaca</span>
          )}
        </div>

        {/* Speed Picker */}
        <div ref={speedRef} className="relative shrink-0">
          <button
            id="tts-speed-trigger"
            type="button"
            onClick={() => { setShowSpeedPicker((p) => !p); setShowVoicePicker(false) }}
            className={[
              'flex items-center gap-1 px-2.5 py-1.5 rounded-[8px]',
              'border text-xs font-medium transition-all duration-150',
              'bg-lentera-surface2 border-lentera-border text-lentera-text-secondary',
              'hover:border-lentera-border2 hover:text-lentera-text',
            ].join(' ')}
          >
            {selectedSpeed.label}
            <ChevronDown size={10} className={`transition-transform duration-150 ${showSpeedPicker ? 'rotate-180' : ''}`} />
          </button>

          {showSpeedPicker && (
            <div className="absolute right-0 top-full mt-1 z-50 bg-lentera-surface border border-lentera-border rounded-[10px] shadow-xl shadow-black/40 py-1 min-w-[80px] animate-fade-in">
              {SPEED_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleRateChange(opt.value)}
                  className={[
                    'w-full px-3 py-1.5 text-left text-xs transition-colors',
                    opt.value === rate
                      ? 'text-lentera-green bg-lentera-green-subtle/30'
                      : 'text-lentera-text-secondary hover:bg-lentera-surface2 hover:text-lentera-text',
                  ].join(' ')}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Voice Picker */}
        {voices.length > 0 && (
          <div ref={voiceRef} className="relative shrink-0">
            <button
              id="tts-voice-trigger"
              type="button"
              onClick={() => { setShowVoicePicker((p) => !p); setShowSpeedPicker(false) }}
              className={[
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px]',
                'border text-xs transition-all duration-150 max-w-[140px]',
                'bg-lentera-surface2 border-lentera-border text-lentera-text-secondary',
                'hover:border-lentera-border2 hover:text-lentera-text',
              ].join(' ')}
            >
              <Mic2 size={10} className="shrink-0 text-lentera-muted" />
              <span className="truncate">
                {selectedVoice?.name.split(' ')[0] ?? 'Suara'}
              </span>
              <ChevronDown size={10} className={`shrink-0 transition-transform duration-150 ${showVoicePicker ? 'rotate-180' : ''}`} />
            </button>

            {showVoicePicker && (
              <div className="absolute right-0 top-full mt-1 z-50 bg-lentera-surface border border-lentera-border rounded-[10px] shadow-xl shadow-black/40 py-1 w-[220px] max-h-[200px] overflow-y-auto custom-scrollbar animate-fade-in">
                {voices.map((v) => (
                  <button
                    key={v.voiceURI}
                    type="button"
                    onClick={() => handleVoiceChange(v.voiceURI)}
                    className={[
                      'w-full px-3 py-2 text-left transition-colors',
                      v.voiceURI === selectedVoiceUri
                        ? 'bg-lentera-green-subtle/30'
                        : 'hover:bg-lentera-surface2',
                    ].join(' ')}
                  >
                    <div className={`text-xs font-medium truncate ${v.voiceURI === selectedVoiceUri ? 'text-lentera-green' : 'text-lentera-text-secondary'}`}>
                      {v.name}
                    </div>
                    <div className="text-[10px] text-lentera-muted mt-0.5">
                      {v.lang}{v.localService ? ' · Lokal' : ' · Online'}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Word Display (Highlight) ── */}
      <div
        id="tts-word-display"
        aria-live="polite"
        aria-label="Teks yang sedang dibacakan"
        className={[
          'mx-4 mb-4 px-4 py-4 rounded-[14px]',
          'bg-lentera-bg border border-lentera-border',
          'text-base leading-loose font-body',
          'max-h-[220px] overflow-y-auto custom-scrollbar',
          'select-none',
        ].join(' ')}
      >
        {wordTokens.length === 0 ? (
          <span className="text-lentera-muted text-sm italic">Tidak ada teks untuk dibacakan.</span>
        ) : (
          // Render semua token (kata + spasi) agar layout natural
          tokens.map((token, i) => {
            if (token.isSpace) {
              return <span key={i}>{token.word}</span>
            }
            // Cari indeks dalam wordTokens
            const wordIdx = wordTokens.findIndex((w) => w.start === token.start)
            const isActive = wordIdx !== -1 && wordIdx === activeWordIdx

            return (
              <span
                key={i}
                ref={(el) => { if (wordIdx !== -1) wordRefs.current[wordIdx] = el }}
                className={[
                  'transition-all duration-100 rounded-[3px]',
                  isActive ? 'tts-highlight' : 'text-lentera-text-secondary',
                ].join(' ')}
              >
                {token.word}
              </span>
            )
          })
        )}
      </div>

    </div>
  )
}
