'use client'

import { io, type Socket } from 'socket.io-client'
import { getToken } from './api-client'

const URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9990'

let socket: Socket | null = null

/**
 * Singleton socket.io client. Reconnects automatically.
 * Token attached lazily — caller should re-call `connectSocket()` after login
 * to ensure the freshest token is used.
 */
export function getSocket(): Socket | null {
  return socket
}

export function connectSocket(): Socket {
  if (socket && socket.connected) return socket
  if (socket) {
    socket.disconnect()
  }
  socket = io(URL, {
    autoConnect: true,
    transports: ['websocket', 'polling'],
    auth: { token: getToken() ?? '' },
  })
  return socket
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
