'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLenteraStore } from '@/store/useLenteraStore'
import { motion, AnimatePresence } from 'framer-motion'
import LogoMark from '@/components/LogoMark'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useLenteraStore()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Small delay to wait for hydrated store from localStorage
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.push('/login')
      } else {
        setIsChecking(false)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [isAuthenticated, router])

  if (isChecking) {
    return (
      <div className="fixed inset-0 bg-lentera-bg flex flex-col items-center justify-center z-[9999]">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-6"
        >
          <LogoMark size={64} />
        </motion.div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-lentera-muted animate-pulse">
          Memverifikasi Sesi...
        </p>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="app-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
