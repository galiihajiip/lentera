'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Trash2, BookOpen, History, AlertTriangle, Clock } from 'lucide-react'
import { useLenteraStore } from '@/store/useLenteraStore'
import { LENS_ITEMS } from '@/components/LensSelector'
import type { HistoryEntry } from '@/types'

// ─── Relative time (Bahasa Indonesia) ───────────────────────
function relativeTime(timestamp: number): string {
  const diffMs  = Date.now() - timestamp
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHr  = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr  / 24)

  if (diffSec < 60)  return 'Baru saja'
  if (diffMin < 60)  return `${diffMin} menit yang lalu`
  if (diffHr  < 24)  return `${diffHr} jam yang lalu`
  if (diffDay === 1) return 'Kemarin'
  if (diffDay < 7)   return `${diffDay} hari yang lalu`
  if (diffDay < 30)  return `${Math.floor(diffDay / 7)} minggu yang lalu`
  return `${Math.floor(diffDay / 30)} bulan yang lalu`
}

function truncate(text: string, max = 90): string {
  if (text.length <= max) return text
  return text.slice(0, max).trimEnd() + '…'
}

// ─── Komponen Utama ─────────────────────────────────────────
interface HistoryPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function HistoryPanel({ isOpen, onClose }: HistoryPanelProps) {
  const history         = useLenteraStore((s) => s.history)
  const removeHistoryItem = useLenteraStore((s) => s.removeHistoryItem)
  const clearHistory    = useLenteraStore((s) => s.clearHistory)
  const setResult       = useLenteraStore((s) => s.setResult)
  const setActiveTab    = useLenteraStore((s) => s.setActiveTab)

  const [confirmClear, setConfirmClear] = useState(false)
  // Mounted: delay render agar animasi masuk terlihat
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setMounted(true)
      // Cegah scroll body saat drawer terbuka
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      // Delay unmount sampai animasi keluar selesai
      const t = setTimeout(() => setMounted(false), 300)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  // ── Klik item → load hasil ──
  const handleLoadEntry = useCallback(
    (entry: HistoryEntry) => {
      setResult(entry.result)
      setActiveTab('result')
      onClose()
    },
    [setResult, setActiveTab, onClose]
  )

  // ── Hapus semua ──
  const handleClearAll = useCallback(() => {
    if (!confirmClear) {
      setConfirmClear(true)
      setTimeout(() => setConfirmClear(false), 3000) // auto-reset
      return
    }
    clearHistory()
    setConfirmClear(false)
  }, [confirmClear, clearHistory])

  // ── Tutup dengan Escape ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!mounted) return null

  return (
    <>
      {/* ── Overlay ── */}
      <div
        role="presentation"
        className={[
          'fixed inset-0 z-40 bg-black/60 backdrop-blur-sm',
          'transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        ].join(' ')}
        onClick={onClose}
      />

      {/* ── Drawer ── */}
      <aside
        id="history-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Riwayat Belajar"
        className={[
          'fixed right-0 top-0 bottom-0 z-50',
          'w-80 md:w-96',
          'flex flex-col',
          'bg-lentera-surface border-l border-lentera-border',
          'shadow-2xl shadow-black/60',
          'transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-lentera-border shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[8px] bg-lentera-surface2 border border-lentera-border flex items-center justify-center">
              <History size={14} className="text-lentera-text-secondary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-lentera-text leading-none">
                Riwayat Belajar
              </h2>
              <p className="text-[10px] text-lentera-muted mt-0.5">
                {history.length} sesi tersimpan
              </p>
            </div>
          </div>

          <button
            id="history-close-btn"
            type="button"
            onClick={onClose}
            aria-label="Tutup panel riwayat"
            className="w-8 h-8 rounded-[8px] flex items-center justify-center text-lentera-muted hover:text-lentera-text hover:bg-lentera-surface2 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* ── List ── */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-3 space-y-2">
          {history.length === 0 ? (
            <EmptyState />
          ) : (
            history.map((entry) => (
              <HistoryItem
                key={entry.id}
                entry={entry}
                onLoad={handleLoadEntry}
                onRemove={removeHistoryItem}
              />
            ))
          )}
        </div>

        {/* ── Footer ── */}
        {history.length > 0 && (
          <div className="shrink-0 px-4 py-3 border-t border-lentera-border">
            <button
              id="history-clear-btn"
              type="button"
              onClick={handleClearAll}
              className={[
                'w-full flex items-center justify-center gap-2',
                'px-4 py-2.5 rounded-[10px] text-sm font-medium',
                'border transition-all duration-200',
                confirmClear
                  ? 'bg-rose-900/20 border-rose-700 text-rose-400 animate-pulse-slow'
                  : 'bg-lentera-surface2 border-lentera-border text-lentera-muted hover:border-rose-800 hover:text-rose-400 hover:bg-rose-950/20',
              ].join(' ')}
            >
              {confirmClear ? (
                <>
                  <AlertTriangle size={13} className="shrink-0" />
                  Konfirmasi hapus semua?
                </>
              ) : (
                <>
                  <Trash2 size={13} className="shrink-0" />
                  Bersihkan Semua
                </>
              )}
            </button>
            {confirmClear && (
              <p className="text-center text-[10px] text-lentera-muted mt-1.5 animate-fade-in">
                Klik sekali lagi untuk konfirmasi. Auto-batal dalam 3 detik.
              </p>
            )}
          </div>
        )}
      </aside>
    </>
  )
}

// ─── Item Riwayat ────────────────────────────────────────────
function HistoryItem({
  entry,
  onLoad,
  onRemove,
}: {
  entry: HistoryEntry
  onLoad: (entry: HistoryEntry) => void
  onRemove: (id: string) => void
}) {
  const [showDelete, setShowDelete] = useState(false)

  const lensItem = LENS_ITEMS.find((l) => l.id === entry.lens)
  const lensLabel = lensItem ? `${lensItem.emoji} ${lensItem.label}` : String(entry.lens)

  return (
    <div
      className="group relative rounded-xl border border-lentera-border bg-lentera-bg hover:border-lentera-green-glow/60 transition-all duration-200"
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      {/* ── Konten utama (klik untuk load) ── */}
      <button
        type="button"
        onClick={() => onLoad(entry)}
        aria-label={`Muat sesi: ${truncate(entry.inputText, 40)}`}
        className="w-full text-left px-3.5 py-3 pr-10 rounded-xl focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-lentera-green/40"
      >
        {/* Cuplikan teks */}
        <p className="text-xs leading-relaxed text-lentera-text-secondary line-clamp-2 mb-2 font-body">
          {truncate(entry.inputText, 120)}
        </p>

        {/* Meta: lensa + waktu */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-[6px] bg-lentera-green-subtle/40 text-lentera-green-text border border-lentera-green-glow/30 truncate max-w-[60%]">
            {lensLabel}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-lentera-muted shrink-0">
            <Clock size={9} />
            {relativeTime(entry.timestamp)}
          </span>
        </div>
      </button>

      {/* ── Tombol hapus ── */}
      <button
        type="button"
        aria-label="Hapus entri riwayat ini"
        onClick={(e) => {
          e.stopPropagation()
          onRemove(entry.id)
        }}
        className={[
          'absolute top-2 right-2',
          'w-6 h-6 rounded-[6px] flex items-center justify-center',
          'text-lentera-muted hover:text-rose-400 hover:bg-rose-950/30',
          'transition-all duration-150',
          showDelete ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
      >
        <Trash2 size={11} />
      </button>
    </div>
  )
}

// ─── Empty State ─────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="w-14 h-14 rounded-full bg-lentera-surface2 border border-lentera-border flex items-center justify-center">
        <BookOpen size={22} className="text-lentera-muted" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-lentera-text-secondary">
          Belum ada riwayat
        </p>
        <p className="text-xs text-lentera-muted mt-1">
          Hasil analisis akan tersimpan otomatis di sini
        </p>
      </div>
    </div>
  )
}
