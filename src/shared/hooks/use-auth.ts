'use client'

import { useAuthStore } from '@/shared/stores/auth.store'
import { clearTokens } from '@/shared/services/api-client'
import { useRouter } from 'next/navigation'

export const useAuth = () => {
  const { user, isAuthenticated, setUser, clearAuth } = useAuthStore()
  const router = useRouter()

  const logout = () => {
    clearTokens()
    clearAuth()
    router.push('/login')
  }

  return { user, isAuthenticated, setUser, logout }
}
