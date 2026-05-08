export enum TweetType {
  Tweet = 0,
  Retweet = 1,
  Comment = 2,
  QuoteTweet = 3,
}

export enum TweetAudience {
  Everyone = 0,
  TwitterCircle = 1,
}

export interface Media {
  url: string
  type: 'image' | 'video'
}

export interface Tweet {
  _id: string
  user_id: string
  type: TweetType
  audience: TweetAudience
  content: string
  parent_id: string | null
  hashtags: string[]
  mentions: string[]
  medias: Media[]
  guest_views: number
  user_views: number
  created_at: string
  updated_at: string
  user?: {
    _id: string
    name: string
    username: string
    avatar: string
  }
  like_count?: number
  bookmark_count?: number
  retweet_count?: number
  comment_count?: number
  is_liked?: boolean
  is_bookmarked?: boolean
}

export interface CreateTweetBody {
  type: TweetType
  audience: TweetAudience
  content: string
  parent_id?: string | null
  hashtags?: string[]
  mentions?: string[]
  medias?: Media[]
}

export interface TimelineQuery {
  page?: number
  limit?: number
}
