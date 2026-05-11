'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/shared/stores/auth.store'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => setHydrated(true), [])

  useEffect(() => {
    if (hydrated && !user) router.replace('/')
  }, [hydrated, user, router])

  // Trước khi store rehydrate, render rỗng để tránh flash UI rồi redirect
  if (!hydrated || !user) return null

  return <>{children}</>
}
