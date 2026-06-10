import apiClient from '@/shared/services/api-client'
import { ApiResponse, PaginatedApiResponse } from '@/shared/types'
import type { AdminConversation, Conversation, Message, MessagePeer } from '../types'

export const messagesService = {
  getOrCreateDM: (peerId: string) =>
    apiClient.post<ApiResponse<Conversation>>('/conversations', { peer_id: peerId }),

  listConversations: (page = 1, limit = 20) =>
    apiClient.get<PaginatedApiResponse<Conversation>>('/conversations', {
      params: { page, limit },
    }),

  listMessages: (conversationId: string, page = 1, limit = 30) =>
    apiClient.get<PaginatedApiResponse<Message>>(`/conversations/${conversationId}/messages`, {
      params: { page, limit },
    }),

  sendMessage: (conversationId: string, content: string) =>
    apiClient.post<ApiResponse<Message>>(`/conversations/${conversationId}/messages`, {
      content,
    }),

  markRead: (conversationId: string) =>
    apiClient.post(`/conversations/${conversationId}/read`),

  adminListAll: (page = 1, limit = 30) =>
    apiClient.get<PaginatedApiResponse<AdminConversation>>('/admin/conversations', {
      params: { page, limit },
    }),

  adminListMessages: (conversationId: string, page = 1, limit = 50) =>
    apiClient.get<
      PaginatedApiResponse<Message> & {
        meta: { conversation: AdminConversation & { member_users: MessagePeer[] } }
      }
    >(`/admin/conversations/${conversationId}/messages`, { params: { page, limit } }),
}
