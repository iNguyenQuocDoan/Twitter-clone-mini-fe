'use client'

import { AdminMessagesView } from '@/features/admin'
import { useSocket } from '@/shared/hooks/use-socket'

export default function AdminMessagesPage() {
  // Ensure socket is connected so realtime feed works on admin side too
  useSocket()
  return <AdminMessagesView />
}
