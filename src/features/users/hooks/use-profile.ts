'use client'

import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { usersService } from '../services/users.service'

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
