import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuthUser {
  _id: string
  name: string
  email: string
  username: string
  avatar: string
  cover_photo: string
  bio: string
  location: string
  website: string
  verify: number
}

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  setUser: (user: AuthUser) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      clearAuth: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage', partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }) }
  )
)
