'use client'

import { useLenteraStore } from '@/store/useLenteraStore'

export default function Toast() {
  const { toasts, removeToast } = useLenteraStore()

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => {
        let colors = ''
        let icon = ''
        
        if (toast.type === 'success') {
          colors = 'bg-lentera-green-subtle border-lentera-green-dim text-lentera-green-text'
          icon = '✓'
        } else if (toast.type === 'error') {
          colors = 'bg-[#4c1d1d] border-red-500 text-red-200'
          icon = '⚠️'
        } else {
          colors = 'bg-lentera-surface2 border-lentera-border text-lentera-text'
          icon = 'ℹ️'
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 w-80 px-4 py-3 rounded-lg border shadow-lg backdrop-blur-md animate-fade-in-up ${colors}`}
          >
            <span className="text-sm shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-black/20">
              {icon}
            </span>
            <p className="text-xs font-semibold leading-relaxed flex-1 pt-[1px] font-body mr-1">
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-xs shrink-0 w-6 h-6 flex items-center justify-center rounded hover:bg-black/20 transition-colors opacity-70 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        )
      })}
    </div>
  )
}
