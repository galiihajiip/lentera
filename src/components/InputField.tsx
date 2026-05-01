'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { FileText, Image as ImageIcon, Mic, Upload, X, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react'
import { useLenteraStore } from '@/store/useLenteraStore'
import type { InputMode } from '@/types'

// ─── Konstanta ──────────────────────────────────────────────
const MIN_CHARS = 50
const MAX_CHARS = 5000
const WARN_CHARS = 4500          // mulai kuning di sini
const MAX_FILE_SIZE = 6 * 1024 * 1024  // 6MB

const ACCEPTED_IMAGE = ['image/png', 'image/jpeg', 'image/webp']
const ACCEPTED_AUDIO = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm']

const TAB_META: { mode: InputMode; label: string; icon: React.ElementType }[] = [
  { mode: 'text',  label: 'Teks',   icon: FileText   },
  { mode: 'image', label: 'Gambar', icon: ImageIcon  },
  { mode: 'audio', label: 'Audio',  icon: Mic        },
]

// ─── Utils ──────────────────────────────────────────────────
function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getCounterColor(len: number): string {
  if (len < MIN_CHARS)  return 'text-lentera-warning'
  if (len >= WARN_CHARS) return 'text-lentera-warning-soft'
  return 'text-lentera-green-dim'
}

// ─── Komponen Utama ─────────────────────────────────────────
interface InputFieldProps {
  className?: string
}

export default function InputField({ className = '' }: InputFieldProps) {
  const inputText    = useLenteraStore((s) => s.inputText)
  const inputMode    = useLenteraStore((s) => s.inputMode)
  const isLoading    = useLenteraStore((s) => s.isLoading)
  const setInputText = useLenteraStore((s) => s.setInputText)
  const setInputMode = useLenteraStore((s) => s.setInputMode)
  const addToast     = useLenteraStore((s) => s.addToast)

  const [isExtracting, setIsExtracting] = useState(false)
  const [isDragging,   setIsDragging]   = useState(false)
  const [previewUrl,   setPreviewUrl]   = useState<string | null>(null)
  const [previewFile,  setPreviewFile]  = useState<File | null>(null)
  const [extractOk,    setExtractOk]    = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Auto-resize textarea ──
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = `${Math.min(ta.scrollHeight, 400)}px`
  }, [inputText])

  // ── Reset preview saat ganti mode ──
  useEffect(() => {
    setPreviewUrl(null)
    setPreviewFile(null)
    setExtractOk(false)
    setIsDragging(false)
  }, [inputMode])

  // ── Cleanup object URL ──
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  // ── Proses upload ke /api/process-multimodal ──
  const handleFileProcess = useCallback(
    async (file: File) => {
      const allowed = inputMode === 'image' ? ACCEPTED_IMAGE : ACCEPTED_AUDIO
      if (!allowed.includes(file.type)) {
        addToast({
          type: 'error',
          message: `Format tidak didukung: ${file.type}. Gunakan ${allowed.join(', ')}.`,
        })
        return
      }
      if (file.size > MAX_FILE_SIZE) {
        addToast({ type: 'error', message: 'Ukuran file melebihi batas 6 MB.' })
        return
      }

      // Set preview
      if (inputMode === 'image') {
        setPreviewUrl(URL.createObjectURL(file))
      }
      setPreviewFile(file)
      setExtractOk(false)

      // Kirim ke API
      setIsExtracting(true)
      try {
        const form = new FormData()
        form.append('file', file)
        form.append('type', inputMode)

        const res = await fetch('/api/process-multimodal', { method: 'POST', body: form })
        const json = await res.json() as { success: boolean; extractedText?: string; error?: string }

        if (!json.success || !json.extractedText) {
          throw new Error(json.error ?? 'Ekstraksi gagal.')
        }

        setInputText(json.extractedText)
        setExtractOk(true)
        addToast({ type: 'success', message: 'Teks berhasil diekstrak dari file.' })
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Gagal memproses file.'
        addToast({ type: 'error', message: msg })
      } finally {
        setIsExtracting(false)
      }
    },
    [inputMode, setInputText, addToast]
  )

  // ── Drag & drop handlers ──
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])
  const onDragLeave = useCallback(() => setIsDragging(false), [])
  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFileProcess(file)
    },
    [handleFileProcess]
  )
  const onFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFileProcess(file)
      e.target.value = ''
    },
    [handleFileProcess]
  )

  const clearFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setPreviewFile(null)
    setExtractOk(false)
    setInputText('')
  }

  const charLen = inputText.length

  return (
    <div className={`flex flex-col gap-0 ${className}`}>
      {/* ── Tab Bar ── */}
      <div
        className="flex border-b border-lentera-border"
        role="tablist"
        aria-label="Mode input"
      >
        {TAB_META.map(({ mode, label, icon: Icon }) => {
          const active = inputMode === mode
          return (
            <button
              key={mode}
              id={`input-tab-${mode}`}
              role="tab"
              type="button"
              aria-selected={active}
              aria-controls={`input-panel-${mode}`}
              onClick={() => setInputMode(mode)}
              disabled={isLoading || isExtracting}
              className={[
                'flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium',
                'border-b-2 -mb-px transition-all duration-200',
                'disabled:opacity-40 disabled:cursor-not-allowed',
                active
                  ? 'text-lentera-green border-lentera-green'
                  : 'text-lentera-muted border-transparent hover:text-lentera-text-secondary hover:border-lentera-border2',
              ].join(' ')}
            >
              <Icon size={14} className="shrink-0" />
              {label}
            </button>
          )
        })}
      </div>

      {/* ── Panel Teks ── */}
      {inputMode === 'text' && (
        <div
          id="input-panel-text"
          role="tabpanel"
          aria-labelledby="input-tab-text"
          className="relative"
        >
          <textarea
            ref={textareaRef}
            id="input-textarea"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder="Masukkan materi akademik yang ingin dipelajari... (minimal 50 karakter)"
            rows={5}
            maxLength={MAX_CHARS}
            className={[
              'w-full px-4 pt-4 pb-10 resize-none overflow-hidden',
              'bg-lentera-bg border-0 rounded-b-lentera',
              'text-sm text-lentera-text placeholder-lentera-muted font-body',
              'focus:outline-none focus:ring-1 focus:ring-lentera-green/30',
              'transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'min-h-[140px] max-h-[400px]',
            ].join(' ')}
          />

          {/* Counter */}
          <div className="absolute bottom-3 right-4 flex items-center gap-2 pointer-events-none">
            {charLen > 0 && charLen < MIN_CHARS && (
              <span className="flex items-center gap-1 text-[10px] text-lentera-warning">
                <AlertCircle size={10} />
                min {MIN_CHARS}
              </span>
            )}
            <span
              className={`text-[11px] tabular-nums font-mono transition-colors duration-200 ${getCounterColor(charLen)}`}
            >
              {charLen.toLocaleString('id-ID')} / {MAX_CHARS.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      )}

      {/* ── Panel Gambar ── */}
      {inputMode === 'image' && (
        <div
          id="input-panel-image"
          role="tabpanel"
          aria-labelledby="input-tab-image"
          className="p-4"
        >
          {previewFile ? (
            <ImagePreview
              file={previewFile}
              previewUrl={previewUrl}
              extractOk={extractOk}
              isExtracting={isExtracting}
              onClear={clearFile}
            />
          ) : (
            <DropZone
              icon={ImageIcon}
              isDragging={isDragging}
              isExtracting={isExtracting}
              accept={ACCEPTED_IMAGE}
              acceptLabel="PNG, JPEG, WebP"
              hint="Foto catatan, slide, atau soal ujian"
              inputId="file-input-image"
              fileInputRef={fileInputRef}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onFileInput={onFileInput}
              onClick={() => fileInputRef.current?.click()}
            />
          )}
        </div>
      )}

      {/* ── Panel Audio ── */}
      {inputMode === 'audio' && (
        <div
          id="input-panel-audio"
          role="tabpanel"
          aria-labelledby="input-tab-audio"
          className="p-4"
        >
          {previewFile ? (
            <AudioPreview
              file={previewFile}
              extractOk={extractOk}
              isExtracting={isExtracting}
              onClear={clearFile}
            />
          ) : (
            <DropZone
              icon={Mic}
              isDragging={isDragging}
              isExtracting={isExtracting}
              accept={ACCEPTED_AUDIO}
              acceptLabel="MP3, WAV, OGG, WebM"
              hint="Rekaman kuliah atau penjelasan dosen"
              inputId="file-input-audio"
              fileInputRef={fileInputRef}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onFileInput={onFileInput}
              onClick={() => fileInputRef.current?.click()}
            />
          )}
        </div>
      )}

      {/* ── Info teks terekstrak ── */}
      {(inputMode === 'image' || inputMode === 'audio') && extractOk && charLen > 0 && (
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-lentera-muted">Teks terekstrak:</span>
            <span className={`tabular-nums font-mono ${getCounterColor(charLen)}`}>
              {charLen.toLocaleString('id-ID')} karakter
            </span>
          </div>
          <div className="mt-1.5 max-h-[80px] overflow-y-auto custom-scrollbar text-xs text-lentera-text-secondary bg-lentera-surface2 rounded-[8px] px-3 py-2 border border-lentera-border">
            {inputText}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Sub: Drop Zone ──────────────────────────────────────────
interface DropZoneProps {
  icon: React.ElementType
  isDragging: boolean
  isExtracting: boolean
  accept: string[]
  acceptLabel: string
  hint: string
  inputId: string
  fileInputRef: React.RefObject<HTMLInputElement | null>
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: () => void
  onDrop: (e: React.DragEvent) => void
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClick: () => void
}

function DropZone({
  icon: Icon,
  isDragging,
  isExtracting,
  accept,
  acceptLabel,
  hint,
  inputId,
  fileInputRef,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileInput,
  onClick,
}: DropZoneProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Unggah file ${acceptLabel}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className={[
        'flex flex-col items-center justify-center gap-3',
        'rounded-lentera border-2 border-dashed',
        'py-10 px-6 cursor-pointer',
        'transition-all duration-200 group',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lentera-green/40',
        isDragging
          ? 'border-lentera-green bg-lentera-green-subtle/30 scale-[1.01]'
          : 'border-lentera-border hover:border-lentera-green-glow hover:bg-lentera-surface2',
        isExtracting ? 'pointer-events-none opacity-60' : '',
      ].join(' ')}
    >
      <input
        ref={fileInputRef}
        id={inputId}
        type="file"
        accept={accept.join(',')}
        className="hidden"
        onChange={onFileInput}
      />

      {isExtracting ? (
        <Loader2 size={32} className="text-lentera-green animate-spin" />
      ) : (
        <div
          className={[
            'w-14 h-14 rounded-full flex items-center justify-center',
            'border border-lentera-border transition-all duration-200',
            'group-hover:border-lentera-green-glow group-hover:bg-lentera-green-subtle/20',
            isDragging ? 'border-lentera-green bg-lentera-green-subtle/30' : 'bg-lentera-surface2',
          ].join(' ')}
        >
          <Icon
            size={22}
            className={`transition-colors duration-200 ${
              isDragging ? 'text-lentera-green' : 'text-lentera-muted group-hover:text-lentera-green'
            }`}
          />
        </div>
      )}

      <div className="text-center">
        <p className="text-sm font-medium text-lentera-text-secondary group-hover:text-lentera-text transition-colors">
          {isExtracting
            ? 'Mengekstrak teks dari file...'
            : isDragging
            ? 'Lepaskan file di sini'
            : 'Seret & lepas file di sini'}
        </p>
        {!isExtracting && (
          <>
            <p className="mt-1 text-xs text-lentera-muted">
              atau{' '}
              <span className="text-lentera-green underline underline-offset-2">
                klik untuk pilih file
              </span>
            </p>
            <p className="mt-2 text-[11px] text-lentera-muted">
              {acceptLabel} · maks. 6 MB
            </p>
            <p className="mt-0.5 text-[11px] text-lentera-muted/70">{hint}</p>
          </>
        )}
      </div>

      {isDragging && (
        <div className="absolute inset-0 rounded-lentera bg-lentera-green/5 pointer-events-none" />
      )}
    </div>
  )
}

// ─── Sub: Image Preview ──────────────────────────────────────
function ImagePreview({
  file,
  previewUrl,
  extractOk,
  isExtracting,
  onClear,
}: {
  file: File
  previewUrl: string | null
  extractOk: boolean
  isExtracting: boolean
  onClear: () => void
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lentera border border-lentera-border bg-lentera-surface2">
      {/* Thumbnail */}
      <div className="relative shrink-0 w-20 h-20 rounded-[8px] overflow-hidden border border-lentera-border bg-lentera-bg">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon size={24} className="text-lentera-muted" />
          </div>
        )}
        {isExtracting && (
          <div className="absolute inset-0 bg-lentera-bg/70 flex items-center justify-center">
            <Loader2 size={18} className="text-lentera-green animate-spin" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-lentera-text truncate">{file.name}</p>
        <p className="text-xs text-lentera-muted mt-0.5">
          {file.type} · {formatBytes(file.size)}
        </p>

        {isExtracting && (
          <p className="flex items-center gap-1.5 text-xs text-lentera-green mt-2">
            <Loader2 size={11} className="animate-spin" />
            Mengekstrak teks...
          </p>
        )}
        {extractOk && !isExtracting && (
          <p className="flex items-center gap-1.5 text-xs text-lentera-green mt-2">
            <CheckCircle2 size={11} />
            Teks berhasil diekstrak
          </p>
        )}
      </div>

      {/* Remove */}
      {!isExtracting && (
        <button
          type="button"
          aria-label="Hapus file"
          onClick={onClear}
          className="shrink-0 p-1 rounded-[6px] text-lentera-muted hover:text-lentera-warning hover:bg-lentera-surface transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}

// ─── Sub: Audio Preview ──────────────────────────────────────
function AudioPreview({
  file,
  extractOk,
  isExtracting,
  onClear,
}: {
  file: File
  extractOk: boolean
  isExtracting: boolean
  onClear: () => void
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lentera border border-lentera-border bg-lentera-surface2">
      {/* Icon */}
      <div
        className={[
          'shrink-0 w-12 h-12 rounded-[8px] flex items-center justify-center',
          'border border-lentera-border',
          isExtracting ? 'bg-lentera-green-subtle/20 border-lentera-green-glow' : 'bg-lentera-bg',
        ].join(' ')}
      >
        {isExtracting ? (
          <Loader2 size={20} className="text-lentera-green animate-spin" />
        ) : extractOk ? (
          <CheckCircle2 size={20} className="text-lentera-green" />
        ) : (
          <Upload size={20} className="text-lentera-muted" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-lentera-text truncate">{file.name}</p>
        <p className="text-xs text-lentera-muted mt-0.5">
          {file.type} · {formatBytes(file.size)}
        </p>
        {isExtracting && (
          <p className="flex items-center gap-1.5 text-xs text-lentera-green mt-1">
            <Loader2 size={10} className="animate-spin" />
            Mentranskrip audio...
          </p>
        )}
        {extractOk && !isExtracting && (
          <p className="flex items-center gap-1.5 text-xs text-lentera-green mt-1">
            <CheckCircle2 size={10} />
            Transkripsi selesai
          </p>
        )}
      </div>

      {/* Remove */}
      {!isExtracting && (
        <button
          type="button"
          aria-label="Hapus file"
          onClick={onClear}
          className="shrink-0 p-1 rounded-[6px] text-lentera-muted hover:text-lentera-warning hover:bg-lentera-surface transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
