'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { bookmarksService } from '../services/bookmarks.service'
import { tweetKeys } from '@/features/tweets/hooks/use-tweets'

export const useBookmark = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (tweetId: string) => bookmarksService.bookmark(tweetId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tweetKeys.all }),
  })
}

export const useUnbookmark = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (tweetId: string) => bookmarksService.unbookmark(tweetId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tweetKeys.all }),
  })
}
