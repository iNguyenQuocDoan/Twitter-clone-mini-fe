export interface UserProfile {
  _id: string
  name: string
  email: string
  username: string
  avatar: string
  cover_photo: string
  bio: string
  location: string
  website: string
  verify: number
  created_at: string
  updated_at: string
}

export interface UpdateMeBody {
  name?: string
  date_of_birth?: string
  bio?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string
}

export interface ChangePasswordBody {
  old_password: string
  password: string
  confirm_password: string
}

export interface FollowBody {
  followed_user_id: string
}
