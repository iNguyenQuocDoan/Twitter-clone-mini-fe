'use client'

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bookmarksService } from '../services/bookmarks.service'
import { tweetKeys } from '@/features/tweets/hooks/use-tweets'

export const bookmarkKeys = {
  all: ['bookmarks'] as const,
  list: () => [...bookmarkKeys.all, 'list'] as const,
}

export const useBookmarks = () =>
  useInfiniteQuery({
    queryKey: bookmarkKeys.list(),
    queryFn: ({ pageParam = 1 }) =>
      bookmarksService.list({ page: pageParam as number, limit: 10 }).then((r) => r.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.total_pages ? lastPage.meta.page + 1 : undefined,
  })

export const useBookmark = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (tweetId: string) => bookmarksService.bookmark(tweetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tweetKeys.all })
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.all })
    },
  })
}

export const useUnbookmark = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (tweetId: string) => bookmarksService.unbookmark(tweetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tweetKeys.all })
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.all })
    },
  })
}
