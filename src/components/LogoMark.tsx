'use client'

import Gambar from 'next/image'
import { useState } from 'react'

export default function LogoMark({ size = 36 }: { size?: number }) {
  const [imgError, setImgError] = useState(false)
  
  if (imgError) {
    return (
      <div 
        style={{ width: size, height: size }}
        className="rounded-xl bg-lentera-green-subtle 
                      border border-lentera-green-glow
                      flex items-center justify-center 
                      font-display font-bold text-lentera-green shadow-[0_0_12px_rgba(34,197,94,0.15)] group-hover:scale-110 transition-transform"
      >
        L
      </div>
    )
  }
  
  return (
    <div 
      style={{ width: size, height: size }}
      className="rounded-xl overflow-hidden border border-lentera-green-glow group-hover:scale-110 transition-transform shadow-[0_0_12px_rgba(34,197,94,0.15)] bg-lentera-surface"
    >
      <Gambar
        src="/logo-lentera.jpeg"
        alt="LENTERA logo"
        width={size}
        height={size}
        className="object-cover w-full h-full"
        onError={() => setImgError(true)}
      />
    </div>
  )
}
