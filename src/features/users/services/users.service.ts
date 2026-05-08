import apiClient from '@/shared/services/api-client'
import { ApiResponse } from '@/shared/types'
import type { UserProfile, UpdateMeBody, ChangePasswordBody, FollowBody } from '../types'

export const usersService = {
  getMe: () => apiClient.get<ApiResponse<UserProfile>>('/users/me'),

  getProfile: (username: string) =>
    apiClient.get<ApiResponse<UserProfile>>(`/users/${username}`),

  updateMe: (body: UpdateMeBody) =>
    apiClient.patch<ApiResponse<UserProfile>>('/users/me', body),

  changePassword: (body: ChangePasswordBody) =>
    apiClient.put('/users/change-password', body),

  follow: (body: FollowBody) =>
    apiClient.post('/users/follow', body),

  unfollow: (userId: string) =>
    apiClient.delete(`/users/follow/${userId}`),
}
