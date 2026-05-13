'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield } from 'lucide-react'
import { useAuthStore, UserRole } from '@/shared/stores/auth.store'

/**
 * Wrap admin pages. Mirrors AuthGuard: wait for rehydration, then enforce role.
 * - Not logged in → /login
 * - Logged in but not admin → /home (graceful, with toast handled upstream if needed)
 * - Admin → render
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => setHydrated(true), [])

  useEffect(() => {
    if (!hydrated) return
    if (!user) {
      router.replace('/login')
      return
    }
    if (user.role !== UserRole.Admin) {
      router.replace('/home')
    }
  }, [hydrated, user, router])

  if (!hydrated) {
    return (
      <div className="min-h-screen grid place-items-center text-muted-foreground">
        <Shield className="size-6 animate-pulse" aria-hidden />
      </div>
    )
  }
  if (!user || user.role !== UserRole.Admin) return null

  return <>{children}</>
}
