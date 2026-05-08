import apiClient from '@/shared/services/api-client'

export const likesService = {
  like: (tweetId: string) => apiClient.post('/likes', { tweet_id: tweetId }),
  unlike: (tweetId: string) => apiClient.delete(`/likes/tweets/${tweetId}`),
}
