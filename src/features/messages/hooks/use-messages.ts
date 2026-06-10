'use client'

import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { isAxiosError } from 'axios'
import { messagesService } from '../services/messages.service'
import { useSocket, useSocketEvent } from '@/shared/hooks/use-socket'
import type { Conversation, Message } from '../types'

export const messageKeys = {
  all: ['messages'] as const,
  conversations: () => [...messageKeys.all, 'conversations'] as const,
  conversation: (id: string) => [...messageKeys.all, 'conversation', id] as const,
  adminAll: () => [...messageKeys.all, 'admin', 'all'] as const,
  adminConversation: (id: string) => [...messageKeys.all, 'admin', 'conversation', id] as const,
}

export const useConversations = () =>
  useQuery({
    queryKey: messageKeys.conversations(),
    queryFn: () => messagesService.listConversations().then((r) => r.data),
    staleTime: 10_000,
  })

export const useConversation = (conversationId: string | null) =>
  useQuery({
    queryKey: messageKeys.conversation(conversationId ?? ''),
    queryFn: () => messagesService.listMessages(conversationId!).then((r) => r.data),
    enabled: !!conversationId,
    staleTime: 5_000,
  })

export const useSendMessage = (conversationId: string | null) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (content: string) => {
      if (!conversationId) throw new Error('No conversation selected')
      return messagesService.sendMessage(conversationId, content).then((r) => r.data.data)
    },
    onSuccess: (newMsg) => {
      queryClient.invalidateQueries({ queryKey: messageKeys.conversations() })
      // Patch the chat detail cache directly so the sender sees their own
      // message immediately without depending on the socket roundtrip. The
      // realtime handler deduplicates by _id so this won't double-render.
      if (conversationId) {
        queryClient.setQueryData(messageKeys.conversation(conversationId), (old: any) => {
          if (!old) return old
          const exists = old.data?.some((m: Message) => m._id === newMsg._id)
          if (exists) return old
          return { ...old, data: [...old.data, newMsg] }
        })
      }
    },
    onError: (err) => {
      const msg = isAxiosError(err)
        ? err.response?.data?.error?.message ?? err.message
        : 'Không gửi được'
      toast.error(msg)
    },
  })
}

export const useGetOrCreateDM = () =>
  useMutation({
    mutationFn: (peerId: string) =>
      messagesService.getOrCreateDM(peerId).then((r) => r.data.data),
  })

export const useMarkRead = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (conversationId: string) => messagesService.markRead(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.conversations() })
    },
  })
}

/**
 * Realtime: when a new message arrives via socket, push it into the messages
 * cache of its conversation and invalidate the conversations list so the
 * sidebar re-sorts and updates `unread_count`/`last_message`.
 */
export function useRealtimeMessages() {
  const queryClient = useQueryClient()

  useSocketEvent<Message>('message:new', (msg) => {
    queryClient.setQueryData(messageKeys.conversation(msg.conversation_id), (old: any) => {
      if (!old) return old
      const exists = old.data?.some((m: Message) => m._id === msg._id)
      if (exists) return old
      return { ...old, data: [...old.data, msg] }
    })
    queryClient.invalidateQueries({ queryKey: messageKeys.conversations() })
  })

  useSocketEvent('conversation:bump', () => {
    queryClient.invalidateQueries({ queryKey: messageKeys.conversations() })
  })
}

/**
 * Join/leave a conversation room while this hook is mounted.
 * Crucially: re-emits `conv:join` on EVERY socket reconnect, because
 * socket.io rooms are reset server-side when a connection is closed.
 * Without this, a transient disconnect (which happens often in dev
 * with Next.js HMR) silently drops the room membership and
 * message:new events stop reaching the chat panel.
 */
export function useJoinConversation(conversationId: string | null) {
  const { socket } = useSocket()
  useEffect(() => {
    if (!conversationId || !socket) return
    const join = () => socket.emit('conv:join', conversationId)
    if (socket.connected) join()
    // Re-emit on every reconnect — socket.io rooms reset server-side on
    // disconnect, so without this a transient drop silently breaks delivery.
    socket.on('connect', join)
    return () => {
      socket.off('connect', join)
      if (socket.connected) socket.emit('conv:leave', conversationId)
    }
  }, [conversationId, socket])
}

export const useAdminConversations = () =>
  useQuery({
    queryKey: messageKeys.adminAll(),
    queryFn: () => messagesService.adminListAll().then((r) => r.data),
    staleTime: 10_000,
  })

export function useAdminRealtimeFeed() {
  const queryClient = useQueryClient()
  useSocketEvent<{ conversation_id: string }>('admin:message', (msg) => {
    queryClient.invalidateQueries({ queryKey: messageKeys.adminAll() })
    if (msg?.conversation_id) {
      queryClient.invalidateQueries({
        queryKey: messageKeys.adminConversation(msg.conversation_id),
      })
    }
  })
}

export const useAdminConversationMessages = (conversationId: string | null) =>
  useQuery({
    queryKey: messageKeys.adminConversation(conversationId ?? ''),
    queryFn: () =>
      messagesService.adminListMessages(conversationId!).then((r) => r.data),
    enabled: !!conversationId,
    staleTime: 5_000,
  })

export type { Conversation }
