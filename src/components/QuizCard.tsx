'use client'

import { useState } from 'react'
import Gambar from 'next/image'
import type { QuizItem, LensType } from '@/types'

interface QuizCardProps {
  quiz: QuizItem[]
  lens: LensType
}

export default function QuizCard({ quiz, lens }: QuizCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [showFinished, setShowFinished] = useState(false)

  const currentQuestion = quiz[currentIndex]

  const handleAnswer = (option: string) => {
    if (isAnswered) return
    
    setSelectedAnswer(option)
    setIsAnswered(true)
    
    if (option === currentQuestion.correctAnswer) {
      setScore(s => s + 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < quiz.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
    } else {
      setShowFinished(true)
    }
  }

  const handleReset = () => {
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setScore(0)
    setShowFinished(false)
  }

  if (showFinished) {
    return (
      <div className="bg-lentera-surface border border-lentera-border rounded-xl p-8 flex flex-col items-center justify-center text-center animate-fade-in-up">
        <div className="w-20 h-20 rounded-full bg-lentera-green-subtle border border-lentera-green-glow flex items-center justify-center text-3xl mb-4">
          {score === quiz.length ? '🏆' : '💪'}
        </div>
        <h3 className="font-display text-2xl font-bold text-lentera-green mb-2">Kuis Selesai!</h3>
        <p className="text-lentera-text-secondary mb-6">
          Skor Anda <span className="text-lentera-green font-bold">{score}/{quiz.length}</span>
        </p>
        
        {score === quiz.length && (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-32 h-32 relative">
              <Gambar
                src="/images/bagong.png"
                alt="Bagong merayakan skor sempurna Anda!"
                width={128}
                height={128}
                className="object-contain animate-bounce"
              />
            </div>
            <p className="text-sm font-medium text-lentera-green-text">Skor sempurna! Bagong bangga padamu! 🦅</p>
            <div className="bg-lentera-green-subtle text-lentera-green border border-lentera-green-glow px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest mb-4">
              Master Budaya: {lens}
            </div>
          </div>
        )}

        <div className="flex gap-4 w-full max-w-xs">
          <button 
            onClick={handleReset}
            className="flex-1 bg-lentera-green text-lentera-bg font-bold py-3 rounded-xl hover:bg-green-300 transition-all active:scale-95"
          >
            Ulangi Kuis
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-lentera-muted uppercase tracking-widest">
          Pertanyaan {currentIndex + 1} dari {quiz.length}
        </span>
        <div className="flex h-1.5 w-32 bg-lentera-border rounded-full overflow-hidden">
          <div 
            className="h-full bg-lentera-green transition-all duration-500" 
            style={{ width: `${((currentIndex + 1) / quiz.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-lentera-surface border border-lentera-border rounded-2xl p-6 md:p-8">
        <h4 className="font-display text-lg md:text-xl font-bold text-lentera-text leading-relaxed mb-8">
          {currentQuestion.question}
        </h4>

        <div className="grid grid-cols-1 gap-3">
          {['A', 'B', 'C', 'D'].map((letter, idx) => {
            const optionTeks = currentQuestion.options[idx]
            const isCorrect = letter === currentQuestion.correctAnswer
            const isSelected = selectedAnswer === letter
            
            let btnClass = 'border-lentera-border bg-lentera-bg hover:border-lentera-green-glow text-lentera-text-secondary'
            if (isAnswered) {
              if (isCorrect) btnClass = 'border-lentera-green bg-lentera-green-subtle text-lentera-green-text'
              else if (isSelected) btnClass = 'border-red-900 bg-red-900/10 text-red-100'
              else btnClass = 'border-lentera-border opacity-40 grayscale'
            }

            return (
              <button
                key={letter}
                onClick={() => handleAnswer(letter)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-4 ${btnClass}`}
              >
                <span className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-extrabold shrink-0 border
                  ${isAnswered && isCorrect ? 'bg-lentera-green border-lentera-green text-lentera-bg' : 'border-current'}`}>
                  {isAnswered && isCorrect ? '✓' : letter}
                </span>
                <span className="text-sm font-medium">{optionTeks}</span>
              </button>
            )
          })}
        </div>
      </div>

      {isAnswered && (
        <div className="bg-lentera-surface2 border border-lentera-border rounded-xl p-5 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-2 text-lentera-green font-bold text-xs uppercase tracking-widest">
            <span>🎭</span> Wawasan Budaya
          </div>
          <p className="text-xs text-lentera-text-secondary leading-relaxed">
            {currentQuestion.culturalExplanation}
          </p>
          
          <button 
            onClick={handleNext}
            className="mt-6 w-full bg-lentera-green text-lentera-bg font-bold py-3 rounded-xl hover:bg-green-300 transition-all flex items-center justify-center gap-2 group"
          >
            {currentIndex < quiz.length - 1 ? 'Pertanyaan Berikutnya' : 'Lihat Skor Akhir'}
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      )}
    </div>
  )
}
