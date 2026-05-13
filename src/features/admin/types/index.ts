import type { UserProfile, UserRole } from '@/features/users/types'

export interface AdminStats {
  total_users: number
  total_admins: number
  total_banned: number
  total_tweets: number
  total_likes: number
  total_bookmarks: number
  new_users_today: number
  new_tweets_today: number
}

export type AdminUserRow = UserProfile

export interface UpdateUserBody {
  role?: UserRole
  verify?: number
}

export interface ListUsersQuery {
  page?: number
  limit?: number
  search?: string
}
