'use client'

import { io, type Socket } from 'socket.io-client'
import { getToken } from './api-client'

const URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9990'

let socket: Socket | null = null

export function getSocket(): Socket | null {
  return socket
}

/**
 * Idempotent singleton getter — returns the SAME Socket instance forever
 * (until disconnectSocket() is explicitly called on logout). socket.io's
 * Manager handles reconnects internally on this single instance, so any
 * listener attached via socket.on(...) survives every reconnect.
 *
 * Previous versions either:
 *  - killed any not-yet-connected socket on subsequent calls (caused 7×
 *    "WebSocket closed before handshake" warnings), or
 *  - rebuilt the socket whenever it was disconnected (orphaned every
 *    listener and silently broke message:new delivery).
 */
export function connectSocket(): Socket {
  if (socket) return socket
  socket = io(URL, {
    autoConnect: true,
    transports: ['websocket', 'polling'],
    auth: { token: getToken() ?? '' },
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 500,
    reconnectionDelayMax: 5000,
  })
  return socket
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
