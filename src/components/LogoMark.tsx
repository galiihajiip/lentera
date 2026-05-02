'use client'

import Gambar from 'next/image'
import { useState } from 'react'

export default function LogoMark({ size = 36, isWide = false }: { size?: number, isWide?: boolean }) {
  const [imgError, setImgError] = useState(false)
  
  if (imgError) {
    return (
      <div 
        style={{ width: isWide ? size * 3 : size, height: size }}
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
      style={{ width: isWide ? 'auto' : size, height: size }}
      className={`rounded-xl overflow-hidden ${!isWide && 'border border-lentera-green-glow shadow-[0_0_12px_rgba(34,197,94,0.15)] bg-lentera-surface'} group-hover:scale-110 transition-transform`}
    >
      <Gambar
        src={isWide ? "/logo-lentera.jpeg" : "/logo-square.jpeg"}
        alt="LENTERA logo"
        width={isWide ? size * 4 : size}
        height={size}
        className={isWide ? "object-contain h-full w-auto" : "object-cover w-full h-full"}
        onError={() => setImgError(true)}
      />
    </div>
  )
}
