'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { usersService } from '../services/users.service'

export const profileKeys = {
  me: ['me'] as const,
  profile: (username: string) => ['profile', username] as const,
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

export const useFollow = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => usersService.follow({ followed_user_id: userId }),
    onSuccess: () => {
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
      queryClient.invalidateQueries({ queryKey: profileKeys.me })
      toast.success('Đã hủy theo dõi!')
    },
  })
}
