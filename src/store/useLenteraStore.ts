import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  LensType,
  InputMode,
  TabType,
  ResultData,
  QuizItem,
  HistoryEntry,
  Toast,
} from '@/types'

const MAX_HISTORY = 10

// ─── State Shape ─────────────────────────────────────────────
interface LenteraState {
  // Input
  inputText: string
  selectedLens: LensType
  inputMode: InputMode

  // UI
  isLoading: boolean
  activeTab: TabType
  toasts: Toast[]
  isMobileMenuOpen: boolean
  isSidebarOpen: boolean

  // Data
  resultData: ResultData | null
  quizData: QuizItem[] | null

  // Persisted
  history: HistoryEntry[]
}

// ─── Actions Shape ───────────────────────────────────────────
interface LenteraActions {
  setInputText: (text: string) => void
  setSelectedLens: (lens: LensType) => void
  setInputMode: (mode: InputMode) => void
  setLoading: (loading: boolean) => void
  setActiveTab: (tab: TabType) => void
  setResult: (result: ResultData | null) => void
  setQuiz: (quiz: QuizItem[] | null) => void
  addHistory: (entry: HistoryEntry) => void
  clearHistory: () => void
  removeHistoryItem: (id: string) => void
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  toggleMobileMenu: () => void
  toggleSidebar: () => void
  resetSession: () => void
}

type LenteraStore = LenteraState & LenteraActions

// ─── Initial State ───────────────────────────────────────────
const initialState: LenteraState = {
  inputText: '',
  selectedLens: 'nusantara',
  inputMode: 'text',
  isLoading: false,
  activeTab: 'result',
  toasts: [],
  isMobileMenuOpen: false,
  isSidebarOpen: true,
  resultData: null,
  quizData: null,
  history: [],
}

// ─── Store ───────────────────────────────────────────────────
export const useLenteraStore = create<LenteraStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ── Input ──
      setInputText: (text) => set({ inputText: text }),
      setSelectedLens: (lens) => set({ selectedLens: lens }),
      setInputMode: (mode) => set({ inputMode: mode }),

      // ── UI ──
      setLoading: (loading) => set({ isLoading: loading }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
      toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),

      // ── Data ──
      setResult: (result) => set({ resultData: result }),
      setQuiz: (quiz) => set({ quizData: quiz }),

      // ── History ──
      addHistory: (entry) => {
        const current = get().history
        const updated = [entry, ...current].slice(0, MAX_HISTORY)
        set({ history: updated })
      },
      clearHistory: () => set({ history: [] }),
      removeHistoryItem: (id) => {
        set((s) => ({ history: s.history.filter((h) => h.id !== id) }))
      },

      // ── Toasts ──
      addToast: (toast) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
        const newToast: Toast = { id, duration: 4000, ...toast }
        set((state) => ({ toasts: [...state.toasts, newToast] }))
        setTimeout(() => {
          get().removeToast(id)
        }, newToast.duration)
      },
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),

      // ── Reset ──
      resetSession: () =>
        set({
          inputText: '',
          resultData: null,
          quizData: null,
          activeTab: 'result',
          isLoading: false,
        }),
    }),
    {
      name: 'lentera-history',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ history: state.history }),
    }
  )
)
