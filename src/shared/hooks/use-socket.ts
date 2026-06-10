'use client'

import { useEffect, useRef, useState } from 'react'
import type { Socket } from 'socket.io-client'
import { connectSocket, disconnectSocket } from '@/shared/services/socket-client'
import { useAuthStore } from '@/shared/stores/auth.store'

/**
 * Establish (or reuse) the singleton socket while a logged-in user exists.
 * Returns `{ socket, connected }`. The socket survives navigation between
 * pages because it lives in the module-level singleton.
 */
export function useSocket() {
  const user = useAuthStore((s) => s.user)
  const [connected, setConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!user) {
      disconnectSocket()
      socketRef.current = null
      setConnected(false)
      return
    }

    const s = connectSocket()
    socketRef.current = s
    setConnected(s.connected)

    const onConnect = () => setConnected(true)
    const onDisconnect = () => setConnected(false)
    s.on('connect', onConnect)
    s.on('disconnect', onDisconnect)

    return () => {
      s.off('connect', onConnect)
      s.off('disconnect', onDisconnect)
      // Do NOT disconnect here — other components may still need the socket.
      // Disconnect happens on logout (via clearAuth flow) or unmount of provider.
    }
  }, [user])

  return { socket: socketRef.current, connected }
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
