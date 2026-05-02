'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLenteraStore } from '@/store/useLenteraStore'
import LogoMark from '@/components/LogoMark'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, isAuthenticated } = useLenteraStore()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/app')
    }
  }, [isAuthenticated, router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Demo Account Logic
    if (username === 'demo' && password === 'lentera2026') {
      login()
      router.push('/app')
    } else {
      setError('Username atau password salah. Gunakan akun demo (demo/lentera2026).')
    }
  }

  return (
    <main className="min-h-screen bg-lentera-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-lentera-green/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-lentera-green/5 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-lentera-surface border border-lentera-border p-10 rounded-3xl shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="mb-6 transform hover:scale-110 transition-transform duration-300">
            <LogoMark size={64} />
          </div>
          <h1 className="text-3xl font-display font-extrabold text-lentera-text tracking-tight mb-2">Selamat Datang</h1>
          <p className="text-lentera-text-secondary text-sm font-medium opacity-70">Masuk ke Dashboard LENTERA</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-lentera-muted ml-1">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username demo"
              className="w-full bg-lentera-bg border border-lentera-border2 rounded-xl px-5 py-4 text-lentera-text focus:outline-none focus:border-lentera-green-glow focus:ring-1 focus:ring-lentera-green-glow transition-all placeholder:opacity-30"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-lentera-muted ml-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-lentera-bg border border-lentera-border2 rounded-xl px-5 py-4 text-lentera-text focus:outline-none focus:border-lentera-green-glow focus:ring-1 focus:ring-lentera-green-glow transition-all placeholder:opacity-30"
              required
            />
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs font-bold text-red-400 text-center bg-red-400/5 py-3 rounded-lg border border-red-400/20"
            >
              ⚠️ {error}
            </motion.p>
          )}

          <button 
            type="submit"
            className="w-full bg-lentera-green text-lentera-bg font-display font-bold py-4 rounded-xl hover:bg-green-300 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-lentera-green/20"
          >
            Masuk Sekarang →
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-lentera-border text-center">
          <p className="text-xs text-lentera-muted font-medium mb-3">Gunakan Akun Demo untuk Uji Coba:</p>
          <div className="inline-flex gap-4 bg-lentera-bg/50 px-4 py-2 rounded-full border border-lentera-border2">
            <span className="text-[10px] text-lentera-text-secondary">User: <span className="text-lentera-green font-bold">demo</span></span>
            <span className="text-[10px] text-lentera-text-secondary">Pass: <span className="text-lentera-green font-bold">lentera2026</span></span>
          </div>
        </div>
      </motion.div>
    </main>
  )
}
