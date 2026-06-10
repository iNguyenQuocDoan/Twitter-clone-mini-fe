'use client'

import { useEffect, useState } from 'react'
import type { Socket } from 'socket.io-client'
import { connectSocket, disconnectSocket } from '@/shared/services/socket-client'
import { useAuthStore } from '@/shared/stores/auth.store'

/**
 * Establish (or reuse) the singleton socket while a logged-in user exists.
 * Returns `{ socket, connected }`. Both pieces of state are tracked via
 * useState — using a ref for the socket made consumers miss the moment the
 * socket became available because ref mutations don't trigger re-renders.
 */
export function useSocket() {
  const user = useAuthStore((s) => s.user)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (!user) {
      disconnectSocket()
      setSocket(null)
      setConnected(false)
      return
    }

    const s = connectSocket()
    setSocket(s)
    setConnected(s.connected)

    const onConnect = () => setConnected(true)
    const onDisconnect = () => setConnected(false)
    s.on('connect', onConnect)
    s.on('disconnect', onDisconnect)

    return () => {
      s.off('connect', onConnect)
      s.off('disconnect', onDisconnect)
    }
  }, [user])

  return { socket, connected }
}

/** Subscribe to a socket event for the lifetime of the calling component. */
export function useSocketEvent<T = unknown>(
  event: string,
  handler: (payload: T) => void,
  deps: React.DependencyList = [],
) {
  const { socket } = useSocket()
  useEffect(() => {
    if (!socket) return
    socket.on(event, handler)
    return () => {
      socket.off(event, handler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, event, ...deps])
}
