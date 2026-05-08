'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { likesService } from '../services/likes.service'
import { tweetKeys } from '@/features/tweets/hooks/use-tweets'

export const useLike = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (tweetId: string) => likesService.like(tweetId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tweetKeys.all }),
  })
}

export const useUnlike = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (tweetId: string) => likesService.unlike(tweetId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tweetKeys.all }),
  })
}
