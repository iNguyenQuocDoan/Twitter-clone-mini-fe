'use client'

import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { isAxiosError } from 'axios'
import { usersService } from '../services/users.service'
import { useAuthStore } from '@/shared/stores/auth.store'
import type { ChangePasswordBody, UpdateMeBody } from '../types'

export const profileKeys = {
  me: ['me'] as const,
  profile: (username: string) => ['profile', username] as const,
  tweets: (username: string) => ['profile', username, 'tweets'] as const,
}

export const useMe = () =>
  useQuery({
    queryKey: profileKeys.me,
    queryFn: () => usersService.getMe().then((r) => r.data.data),
  })

export const useProfile = (username: string) =>
  useQuery({
    queryKey: profileKeys.profile(username),
    queryFn: () => usersService.getProfile(username).then((r) => r.data.data),
    enabled: !!username,
  })

export const useUserTweets = (username: string) =>
  useInfiniteQuery({
    queryKey: profileKeys.tweets(username),
    queryFn: ({ pageParam = 1 }) =>
      usersService.getUserTweets(username, { page: pageParam as number, limit: 10 }).then((r) => r.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.total_pages ? lastPage.meta.page + 1 : undefined,
    enabled: !!username,
  })

export const useFollow = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => usersService.follow({ followed_user_id: userId }),
    onSuccess: () => {
      // invalidate any cached profile view so is_followed + counts refresh
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: profileKeys.me })
      toast.success('Đã theo dõi!')
    },
  })
}

export const useUnfollow = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => usersService.unfollow(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: profileKeys.me })
      toast.success('Đã hủy theo dõi!')
    },
  })
}

export const useUpdateMe = () => {
  const queryClient = useQueryClient()
  const setUser = useAuthStore((s) => s.setUser)
  return useMutation({
    mutationFn: (body: UpdateMeBody) => usersService.updateMe(body).then((r) => r.data.data),
    onSuccess: (me) => {
      setUser(me)
      queryClient.invalidateQueries({ queryKey: profileKeys.me })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success('Đã cập nhật hồ sơ')
    },
    onError: (err) => {
      const msg = isAxiosError(err)
        ? err.response?.data?.error?.message ?? err.message
        : 'Cập nhật thất bại'
      toast.error(msg)
    },
  })
}

export const useChangePassword = () =>
  useMutation({
    mutationFn: (body: ChangePasswordBody) => usersService.changePassword(body),
    onSuccess: () => toast.success('Đổi mật khẩu thành công'),
    onError: (err) => {
      const msg = isAxiosError(err)
        ? err.response?.data?.error?.message ?? err.message
        : 'Đổi mật khẩu thất bại'
      toast.error(msg)
    },
  })
