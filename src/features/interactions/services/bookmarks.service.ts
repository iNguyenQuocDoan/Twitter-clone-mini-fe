import apiClient from '@/shared/services/api-client'

export const bookmarksService = {
  bookmark: (tweetId: string) => apiClient.post('/bookmarks', { tweet_id: tweetId }),
  unbookmark: (tweetId: string) => apiClient.delete(`/bookmarks/tweets/${tweetId}`),
}
