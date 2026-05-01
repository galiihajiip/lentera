'use client'

import { useLenteraStore } from '@/store/useLenteraStore'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

const TOAST_ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
}

const TOAST_COLORS = {
  success: 'border-lentera-green bg-lentera-green-subtle/20 text-lentera-green-text',
  error: 'border-red-500/50 bg-red-900/20 text-red-200',
  info: 'border-blue-500/50 bg-blue-900/20 text-blue-200',
  warning: 'border-lentera-warning-soft/50 bg-yellow-900/20 text-yellow-200',
}

export default function ToastContainer() {
  const { toasts, removeToast } = useLenteraStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm">
      {toasts.map((toast) => {
        const Icon = TOAST_ICONS[toast.type]
        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl animate-slide-in shadow-2xl ${TOAST_COLORS[toast.type]}`}
          >
            <Icon className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium flex-1 leading-relaxed">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
