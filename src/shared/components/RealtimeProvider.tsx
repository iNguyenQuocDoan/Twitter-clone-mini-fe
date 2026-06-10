'use client'

import { useSocket } from '@/shared/hooks/use-socket'
import { useRealtimeMessages } from '@/features/messages'

/**
 * Mount once near the root of authenticated routes to:
 * 1. Establish the singleton socket connection
 * 2. Subscribe to message:new + conversation:bump so caches stay fresh
 *    everywhere (unread badges, conversation list ordering, etc.)
 */
export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  useSocket()
  useRealtimeMessages()
  return <>{children}</>
}
