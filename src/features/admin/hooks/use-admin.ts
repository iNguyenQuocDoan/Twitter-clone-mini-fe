'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { isAxiosError } from 'axios'
import { adminService } from '../services/admin.service'
import type { ListUsersQuery, UpdateUserBody } from '../types'

export const adminKeys = {
  all: ['admin'] as const,
  stats: () => [...adminKeys.all, 'stats'] as const,
  users: (query: ListUsersQuery) => [...adminKeys.all, 'users', query] as const,
}

export const useAdminStats = () =>
  useQuery({
    queryKey: adminKeys.stats(),
    queryFn: () => adminService.getStats().then((r) => r.data.data),
    staleTime: 30_000,
  })

export const useAdminUsers = (query: ListUsersQuery) =>
  useQuery({
    queryKey: adminKeys.users(query),
    queryFn: () => adminService.listUsers(query).then((r) => r.data),
    staleTime: 10_000,
    placeholderData: (prev) => prev,
  })

export const useUpdateAdminUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateUserBody }) =>
      adminService.updateUser(id, body).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all })
      // a profile somewhere may show this user — invalidate generically
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success('Đã cập nhật user')
    },
    onError: (err) => {
      const msg = isAxiosError(err)
        ? err.response?.data?.error?.message ?? err.message
        : 'Có lỗi xảy ra'
      toast.error(msg)
    },
  })
}
