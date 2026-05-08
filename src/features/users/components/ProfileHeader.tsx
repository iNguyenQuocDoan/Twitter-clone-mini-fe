'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { UserAvatar } from './UserAvatar'
import { useAuthStore } from '@/shared/stores/auth.store'
import { useFollow, useUnfollow } from '../hooks/use-profile'
import type { UserProfile } from '../types'

interface ProfileHeaderProps {
  profile: UserProfile
  isLoading?: boolean
}

export function ProfileHeaderSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-32 w-full" />
      <div className="px-4 space-y-2">
        <Skeleton className="size-16 rounded-full" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
  )
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const currentUser = useAuthStore((s) => s.user)
  const { mutate: follow, isPending: isFollowing } = useFollow()
  const { mutate: unfollow, isPending: isUnfollowing } = useUnfollow()

  const isOwner = currentUser?._id === profile._id

  return (
    <div>
      <div className="relative h-32 bg-muted">
        {profile.cover_photo && (
          <Image src={profile.cover_photo} alt="cover" fill className="object-cover" />
        )}
      </div>

      <div className="px-4 pb-4">
        <div className="flex items-end justify-between -mt-8 mb-3">
          <UserAvatar src={profile.avatar} name={profile.name} size="lg" className="border-4 border-background" />

          {!isOwner && currentUser && (
            <Button
              variant="outline"
              size="sm"
              disabled={isFollowing || isUnfollowing}
              onClick={() => unfollow(profile._id)}
            >
              Đang theo dõi
            </Button>
          )}
          {!isOwner && !currentUser && (
            <Button size="sm" disabled={isFollowing} onClick={() => follow(profile._id)}>
              Theo dõi
            </Button>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-xl">{profile.name}</h2>
            {profile.verify === 1 && <Badge variant="secondary">Verified</Badge>}
          </div>
          <p className="text-muted-foreground text-sm">@{profile.username || profile.email}</p>
          {profile.bio && <p className="text-sm mt-2">{profile.bio}</p>}

          <div className="flex gap-4 text-sm text-muted-foreground mt-2">
            {profile.location && <span>📍 {profile.location}</span>}
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                🔗 {profile.website}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
