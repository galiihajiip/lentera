'use client'

import { useRef, useEffect, useCallback, useState, DragEvent, ChangeEvent } from 'react'
import { useLenteraStore } from '@/store/useLenteraStore'
import type { InputMode } from '@/types'

const MAX_CHARS = 5000
const MIN_CHARS = 50
const MAX_AUDIO_BYTES = 5 * 1024 * 1024

const TABS: { mode: InputMode; label: string; icon: string }[] = [
  { mode: 'text',  label: 'Teks',   icon: '📄' },
  { mode: 'image', label: 'Gambar', icon: '🖼️' },
  { mode: 'audio', label: 'Audio',  icon: '🎙️' },
]

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function TeksMode() {
  const { inputTeks, setInputTeks } = useLenteraStore()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(Math.max(el.scrollHeight, 200), 500)}px`
  }, [inputTeks])

  const charCount = inputTeks.length
  const isOverLimit = charCount > MAX_CHARS
  
  // Character counter color feedback
  const getCounterColor = () => {
    if (charCount > 0 && charCount < 50) return 'text-red-400'
    if (charCount >= 50 && charCount < 1000) return 'text-lentera-muted'
    if (charCount >= 1000 && charCount < 4000) return 'text-lentera-green'
    if (charCount >= 4000) return 'text-yellow-400'
    return 'text-lentera-muted'
  }

  const getCounterLabel = () => {
    if (charCount > 0 && charCount < 50) return 'Too short'
    return null
  }

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={inputTeks}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInputTeks(e.target.value)}
        placeholder="Tempel catatan kuliah, materi belajar, atau kutipan buku teks di sini... Minimal 50 karakter. Anda juga bisa mengunggah gambar atau audio di atas."
        maxLength={MAX_CHARS + 100}
        className={`w-full min-h-[200px] bg-lentera-bg border rounded-xl p-6 text-base leading-relaxed text-lentera-text-secondary placeholder-lentera-muted resize-none focus:outline-none focus:border-lentera-green-glow focus:ring-1 focus:ring-lentera-green-glow transition-all duration-150 custom-scrollbar
          ${isOverLimit ? 'border-red-500/50' : 'border-lentera-border'}`}
        style={{ minHeight: 200, maxHeight: 500 }}
      />
      <div className={`text-xs absolute bottom-3 right-4 px-2 py-1 flex items-center gap-2 rounded-md bg-lentera-surface/80 backdrop-blur-sm border border-lentera-border ${getCounterColor()}`}>
        {getCounterLabel() && <span className="font-bold border-r border-lentera-border pr-2">{getCounterLabel()}</span>}
        <span className="font-mono">
          {charCount.toLocaleString('en-US')} / {MAX_CHARS.toLocaleString('en-US')}
        </span>
      </div>
    </div>
  )
}

function DropZone({ mode, accept, onFile, error, isExtracting, previewFile, onClear }: any) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onFile(file)
  }, [onFile])

  const icon = mode === 'image' ? '🖼️' : '🎙️'

  return (
    <div className="flex flex-col gap-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !previewFile && inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed px-8 py-12 text-center cursor-pointer transition-all duration-150 min-h-[200px]
          ${isDragging ? 'border-lentera-green bg-lentera-green-subtle/10' : 'border-lentera-border bg-lentera-bg hover:border-lentera-green-glow shadow-inner shadow-black/20'}
          ${previewFile ? 'pointer-events-none opacity-80' : ''}`}
      >
        <span className="text-3xl opacity-60 filter grayscale group-hover:grayscale-0 transition-all">{icon}</span>
        <div>
          <p className="text-sm font-semibold text-lentera-text-secondary group-hover:text-lentera-green transition-colors">Drag & drop your file here</p>
          <p className="text-xs text-lentera-muted mt-1.5 px-3 py-1 bg-lentera-surface2 rounded-full border border-lentera-border">or click to browse local files</p>
        </div>
        <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => { if (e.target.files?.[0]) onFile(e.target.files[0]); e.target.value = '' }} />
      </div>

      {previewFile && (
        <div className="flex items-center justify-between p-4 rounded-xl bg-lentera-surface2 border border-lentera-border shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xl">{icon}</span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-lentera-text-secondary truncate">{previewFile.name}</p>
              <p className="text-xs text-lentera-muted">{formatBytes(previewFile.size)}</p>
            </div>
          </div>
          {isExtracting ? (
            <span className="text-xs font-bold text-lentera-green animate-pulse flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-lentera-green" /> Mengekstrak...
            </span>
          ) : (
            <button type="button" onMouseDown={(e) => { e.stopPropagation(); onClear() }} className="text-xs font-bold px-3 py-1.5 rounded-lg border border-lentera-border text-lentera-muted hover:text-red-400 hover:border-red-500/30 transition-all pointer-events-auto">
              Hapus
            </button>
          )}
        </div>
      )}
      
      {error && <p className="text-xs font-medium text-red-400 mt-2 px-1 flex items-center gap-2">
        <span>⚠️</span> {error}
      </p>}
    </div>
  )
}

export default function InputField() {
  const { inputMode, setInputMode, setInputTeks } = useLenteraStore()
  const [imageFile, setGambarFile] = useState<File | null>(null)
  const [imageErr, setGambarErr] = useState<string | null>(null)
  const [imgExtract, setImgExtract] = useState(false)
  
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioErr, setAudioErr] = useState<string | null>(null)
  const [audExtract, setAudExtract] = useState(false)

  async function uploadExtr(file: File, type: 'image'|'audio') {
    const isImg = type === 'image'; const _setFile = isImg ? setGambarFile : setAudioFile;
    const _setErr = isImg ? setGambarErr : setAudioErr; const _setExt = isImg ? setImgExtract : setAudExtract;
    _setFile(file); _setErr(null); _setExt(true);
    try {
      const fd = new FormData(); fd.append('file', file); fd.append('type', type);
      const res = await fetch('/api/process-multimodal', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed')
      setInputTeks(json.extractedTeks); setInputMode('text')
    } catch (e: any) { _setErr(e.message) } finally { _setExt(false) }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Container Tabs */}
      <div className="flex bg-lentera-bg rounded-xl p-1.5 border border-lentera-border shadow-sm">
        {TABS.map(({ mode, label, icon }) => (
          <button key={mode} onClick={() => setInputMode(mode)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-center text-sm font-semibold rounded-lg cursor-pointer transition-all duration-300
            ${inputMode === mode 
              ? 'bg-lentera-green-subtle text-lentera-green border border-lentera-green-glow shadow-md shadow-lentera-green/10' 
              : 'text-lentera-muted border border-transparent hover:text-lentera-text-secondary'}`}
          >
            <span className="text-lg opacity-80">{icon}</span> {label}
          </button>
        ))}
      </div>

      {inputMode === 'text' && <TeksMode />}
      {inputMode === 'image' && <DropZone mode="image" accept="image/*" onFile={(f:any)=>uploadExtr(f,'image')} error={imageErr} isExtracting={imgExtract} previewFile={imageFile} onClear={()=>setGambarFile(null)} />}
      {inputMode === 'audio' && <DropZone mode="audio" accept="audio/*" onFile={(f:any)=>uploadExtr(f,'audio')} error={audioErr} isExtracting={audExtract} previewFile={audioFile} onClear={()=>setAudioFile(null)} />}
    </div>
  )
}
