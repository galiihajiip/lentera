interface LoadingSpinnerProps {
  /** Teks utama. Default: "LENTERA sedang menganalisis..." */
  label?: string
  /** Teks kecil di bawah label. Default: "Mengolah materi dengan lensa budaya pilihan kamu" */
  subtitle?: string
}

export default function LoadingSpinner({
  label = 'LENTERA sedang menganalisis...',
  subtitle = 'Mengolah materi dengan lensa budaya pilihan kamu',
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6 animate-fade-in">
      {/* Spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-lentera-border rounded-full" />
        <div className="absolute inset-0 border-4 border-transparent border-t-lentera-green rounded-full animate-spin" />
        <div
          className="absolute inset-2 border-2 border-transparent border-t-lentera-green/40 rounded-full animate-spin"
          style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}
        />
      </div>

      {/* Text */}
      <div className="text-center">
        <p className="font-display font-semibold text-lentera-green text-sm tracking-wider">
          {label}
        </p>
        <p className="text-xs text-lentera-muted mt-2">
          {subtitle}
        </p>
      </div>

      {/* Pulse dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-lentera-green animate-pulse-slow"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </div>
    </div>
  )
}
