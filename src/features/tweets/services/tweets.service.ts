import apiClient from '@/shared/services/api-client'
import { ApiResponse, PaginatedResult } from '@/shared/types'
import type { Tweet, CreateTweetBody, TimelineQuery } from '../types'

export const tweetsService = {
  createTweet: (body: CreateTweetBody) =>
    apiClient.post<ApiResponse<Tweet>>('/tweets', body),

  getTweet: (tweetId: string) =>
    apiClient.get<ApiResponse<Tweet>>(`/tweets/${tweetId}`),

  getTimeline: (query: TimelineQuery = {}) =>
    apiClient.get<ApiResponse<PaginatedResult<Tweet>>>('/tweets/timeline', { params: query }),
}
