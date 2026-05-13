import apiClient from '@/shared/services/api-client'
import { PaginatedApiResponse } from '@/shared/types'
import type { Tweet, TimelineQuery } from '@/features/tweets/types'

export const bookmarksService = {
  list: (query: TimelineQuery = {}) =>
    apiClient.get<PaginatedApiResponse<Tweet>>('/bookmarks', { params: query }),
  bookmark: (tweetId: string) => apiClient.post('/bookmarks', { tweet_id: tweetId }),
  unbookmark: (tweetId: string) => apiClient.delete(`/bookmarks/tweets/${tweetId}`),
}
