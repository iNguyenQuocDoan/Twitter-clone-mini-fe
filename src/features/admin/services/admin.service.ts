import apiClient from '@/shared/services/api-client'
import { ApiResponse, PaginatedApiResponse } from '@/shared/types'
import type { AdminStats, AdminUserRow, ListUsersQuery, UpdateUserBody } from '../types'

export const adminService = {
  getStats: () => apiClient.get<ApiResponse<AdminStats>>('/admin/stats'),

  listUsers: (query: ListUsersQuery = {}) =>
    apiClient.get<PaginatedApiResponse<AdminUserRow>>('/admin/users', { params: query }),

  updateUser: (id: string, body: UpdateUserBody) =>
    apiClient.patch<ApiResponse<AdminUserRow>>(`/admin/users/${id}`, body),
}
