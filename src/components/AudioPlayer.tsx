'use client'

import { useState, useEffect, useRef } from 'react'

interface Props {
  textToRead: string
}

export default function AudioPlayer({ textToRead }: Props) {
  const [supported, setSupported]     = useState(false)
  const [voices, setVoices]           = useState<SpeechSynthesisVoice[]>([])
  const [voiceIdx, setVoiceIdx]       = useState(0)
  const [rate, setRate]               = useState(1)
  const [playing, setPlaying]         = useState(false)
  const [paused, setPaused]           = useState(false)
  const [wordIdx, setWordIdx]         = useState(-1)
  const [showPicker, setShowPicker]   = useState(false)
  const words = textToRead.trim().split(/\s+/).filter(Boolean)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('speechSynthesis' in window)) return
    setSupported(true)

    const load = () => {
      const all = window.speechSynthesis.getVoices()
      if (!all.length) return

      // Priority order for multilingual support
      const priority = [
        'Google Bahasa Indonesia', 'Microsoft Andika', 'Google Melayu', 'Microsoft Rizwan',
        'id-ID', 'id_ID', 'ms-MY', 'ms_MY', 'Indonesian', 'Bahasa Indonesia', 'Malay', 'Melayu'
      ]

      const sorted = [...all].sort((a, b) => {
        const ai = priority.findIndex(p => a.name.includes(p))
        const bi = priority.findIndex(p => b.name.includes(p))
        if (ai >= 0 && bi >= 0) return ai - bi
        if (ai >= 0) return -1
        if (bi >= 0) return 1
        
        const isALocal = a.lang.startsWith('id') || a.lang.startsWith('ms')
        const isBLocal = b.lang.startsWith('id') || b.lang.startsWith('ms')
        
        if (isALocal && !isBLocal) return -1
        if (isBLocal && !isALocal) return 1
        return 0
      })

      setVoices(sorted)

      // Auto-detect Indonesian
      const idWords = ['yang','adalah','dan','untuk','ini','itu','dari','dengan','pada','tidak','juga']
      const tokens  = textToRead.toLowerCase().split(/\s+/)
      const idRatio = tokens.filter(t => idWords.includes(t)).length / tokens.length
      // Priority to Indonesian/Malay voices for LENTERA
      const bestIdx = sorted.findIndex(v => 
        v.lang.startsWith('id') || 
        v.lang.startsWith('ms') || 
        v.name.toLowerCase().includes('indonesian') || 
        v.name.toLowerCase().includes('bahasa') ||
        v.name.toLowerCase().includes('malay')
      )
      setVoiceIdx(bestIdx < 0 ? 0 : bestIdx)
    }

    load()
    window.speechSynthesis.onvoiceschanged = load
    return () => { window.speechSynthesis.cancel() }
  }, [textToRead])

  useEffect(() => {
    window.speechSynthesis?.cancel()
    setPlaying(false)
    setPaused(false)
    setWordIdx(-1)
  }, [textToRead])

  const speak = () => {
    if (!supported || voices.length === 0) return
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(textToRead)
    utt.voice  = voices[voiceIdx]
    utt.rate   = rate
    utt.onboundary = (e) => {
      if (e.name !== 'word') return
      const idx = textToRead.slice(0, e.charIndex).trim().split(/\s+/).length - 1
      setWordIdx(idx)
    }
    utt.onend   = () => { setPlaying(false); setPaused(false); setWordIdx(-1) }
    utt.onerror = () => { setPlaying(false); setWordIdx(-1) }
    window.speechSynthesis.speak(utt)
    setPlaying(true)
    setPaused(false)
  }

  const pause  = () => { window.speechSynthesis.pause();  setPaused(true);  setPlaying(false) }
  const resume = () => { window.speechSynthesis.resume(); setPaused(false); setPlaying(true)  }
  const stop   = () => { window.speechSynthesis.cancel(); setPlaying(false); setPaused(false); setWordIdx(-1) }

  if (!supported) return (
    <p className="text-sm text-lentera-muted py-2">
      Teks-to-speech is not supported in this browser. Try Chrome or Edge.
    </p>
  )

  const langFlag: Record<string, string> = {
    id:'🇮🇩', en:'🇺🇸', ar:'🇸🇦', zh:'🇨🇳', ja:'🇯🇵',
    ko:'🇰🇷', fr:'🇫🇷', de:'🇩🇪', es:'🇪🇸', pt:'🇧🇷',
    hi:'🇮🇳', th:'🇹🇭', vi:'🇻🇳', ms:'🇲🇾', ru:'🇷🇺',
  }
  const flag = (v: SpeechSynthesisVoice) =>
    langFlag[v.lang.split('-')[0].toLowerCase()] ?? '🌐'

  return (
    <div className="flex flex-col gap-4 w-full">
      
      {/* ── Word highlight ── */}
      <div className="rounded-xl border border-lentera-border 
                      bg-lentera-bg p-4 text-sm leading-loose 
                      text-lentera-text-secondary max-h-36 overflow-y-auto">
        {words.map((w, i) => (
          <span key={i}
            className={i === wordIdx
              ? 'bg-yellow-300 text-black rounded px-0.5 font-semibold'
              : ''}>
            {w}{' '}
          </span>
        ))}
      </div>

      {/* ── Controls ── */}
      <div className="flex items-center gap-3 flex-wrap">

        {/* Play / Pause / Stop */}
        <div className="flex items-center gap-2">
          <button onClick={playing ? pause : paused ? resume : speak}
            className="w-10 h-10 rounded-full bg-lentera-green text-black 
                       font-bold text-sm flex items-center justify-center
                       hover:opacity-80 transition-opacity">
            {playing ? '⏸' : '▶'}
          </button>
          {(playing || paused) && (
            <button onClick={stop}
              className="w-10 h-10 rounded-full border border-lentera-border2
                         text-lentera-muted text-sm flex items-center justify-center
                         hover:border-red-500 hover:text-red-400 transition-colors">
              ⏹
            </button>
          )}
        </div>

        {/* Speed */}
        <div className="flex gap-1">
          {[0.75, 1, 1.25, 1.5, 2].map(s => (
            <button key={s} onClick={() => setRate(s)}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold
                          transition-colors ${rate === s
                ? 'bg-lentera-green-subtle text-lentera-green border-lentera-green-glow'
                : 'border-lentera-border text-lentera-muted hover:border-lentera-border2'
              }`}>
              {s}x
            </button>
          ))}
        </div>

        {/* Voice selector button */}
        {voices.length > 0 && (
          <button onClick={() => setShowPicker(v => !v)}
            className="ml-auto flex items-center gap-2 px-3 py-2 rounded-lg
                       border border-lentera-border2 text-xs text-lentera-text-secondary
                       hover:border-lentera-green-glow hover:text-lentera-green transition-colors
                       max-w-48 truncate">
            <span>{flag(voices[voiceIdx])}</span>
            <span className="truncate">{voices[voiceIdx]?.name ?? 'Pilih suara'}</span>
            <span className="flex-shrink-0">{showPicker ? '▲' : '▼'}</span>
          </button>
        )}
      </div>

      {/* ── Voice Picker ── */}
      {showPicker && voices.length > 0 && (
        <div className="rounded-xl border border-lentera-border2 
                        bg-lentera-surface overflow-hidden">
          <p className="px-4 py-2 bg-lentera-surface2 border-b border-lentera-border
                        text-xs text-lentera-muted uppercase tracking-wider font-semibold">
            {voices.length} voices available
          </p>
          <div className="max-h-56 overflow-y-auto">
            {voices.map((v, i) => (
              <button key={i}
                onClick={() => { setVoiceIdx(i); setShowPicker(false) }}
                className={`w-full text-left px-4 py-3 flex items-center gap-3
                            text-sm border-b border-lentera-border last:border-0
                            hover:bg-lentera-surface2 transition-colors ${
                  i === voiceIdx
                    ? 'bg-lentera-green-subtle text-lentera-green'
                    : 'text-lentera-text-secondary'
                }`}>
                <span className="text-base w-5 flex-shrink-0">{flag(v)}</span>
                <div className="min-w-0">
                  <p className="font-medium truncate">{v.name}</p>
                  <p className="text-xs text-lentera-muted">{v.lang}</p>
                </div>
                {i === voiceIdx && (
                  <span className="ml-auto text-xs text-lentera-green flex-shrink-0">
                    Active
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
