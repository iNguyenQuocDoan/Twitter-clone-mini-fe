'use client'

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { tweetsService } from '../services/tweets.service'
import type { CreateTweetBody } from '../types'

export const tweetKeys = {
  all: ['tweets'] as const,
  timeline: () => [...tweetKeys.all, 'timeline'] as const,
  detail: (id: string) => [...tweetKeys.all, id] as const,
}

export const useTimeline = () =>
  useInfiniteQuery({
    queryKey: tweetKeys.timeline(),
    queryFn: ({ pageParam = 1 }) =>
      tweetsService
        .getTimeline({ page: pageParam as number, limit: 10 })
        .then((r) => r.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.total_pages ? lastPage.meta.page + 1 : undefined,
  })

export const useTweet = (tweetId: string) =>
  useQuery({
    queryKey: tweetKeys.detail(tweetId),
    queryFn: () => tweetsService.getTweet(tweetId).then((r) => r.data.data),
    enabled: !!tweetId,
  })

export const useCreateTweet = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateTweetBody) => tweetsService.createTweet(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tweetKeys.timeline() })
      toast.success('Tweet đã được đăng!')
    },
    onError: () => toast.error('Không thể đăng tweet'),
  })
}
