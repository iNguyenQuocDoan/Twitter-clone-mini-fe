'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Link2, Calendar, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { UserAvatar } from './UserAvatar'
import { useAuthStore } from '@/shared/stores/auth.store'
import { useFollow, useUnfollow } from '../hooks/use-profile'
import { formatCount } from '@/shared/utils/format'
import { UserRole, type UserProfile } from '../types'

interface ProfileHeaderProps {
  profile: UserProfile
}

export function ProfileHeaderSkeleton() {
  return (
    <div>
      <Skeleton className="h-40 w-full rounded-none" />
      <div className="px-4 pb-4 space-y-3">
        <div className="flex items-end justify-between -mt-12">
          <Skeleton className="size-24 rounded-full border-4 border-background" />
          <Skeleton className="h-9 w-28" />
        </div>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  )
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const currentUser = useAuthStore((s) => s.user)
  const { mutate: follow, isPending: isFollowing } = useFollow()
  const { mutate: unfollow, isPending: isUnfollowing } = useUnfollow()

  const isOwner = currentUser?._id === profile._id
  const isFollowed = !!profile.is_followed
  const followBusy = isFollowing || isUnfollowing

  return (
    <div>
      <div className="relative h-40 bg-muted">
        {profile.cover_photo && (
          <Image
            src={profile.cover_photo}
            alt=""
            fill
            className="object-cover"
            sizes="640px"
          />
        )}
      </div>

      <div className="px-4 pb-4">
        <div className="flex items-end justify-between -mt-12 mb-3">
          <UserAvatar
            src={profile.avatar}
            name={profile.name}
            size="lg"
            className="size-24 border-4 border-background"
          />

          {isOwner ? (
            <Link href="/settings">
              <Button variant="outline" size="sm">
                Chỉnh sửa hồ sơ
              </Button>
            </Link>
          ) : !currentUser ? null : isFollowed ? (
            <Button
              variant="outline"
              size="sm"
              disabled={followBusy}
              onClick={() => unfollow(profile._id)}
              className="min-w-28"
            >
              {isUnfollowing ? '...' : 'Đang theo dõi'}
            </Button>
          ) : (
            <Button
              size="sm"
              disabled={followBusy}
              onClick={() => follow(profile._id)}
              className="min-w-28 font-semibold"
            >
              {isFollowing ? '...' : 'Theo dõi'}
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-bold text-xl tracking-tight">{profile.name}</h2>
            {profile.verify === 1 && <Badge variant="secondary">Verified</Badge>}
            {profile.role === UserRole.Admin && (
              <Badge className="bg-amber-500/15 text-amber-500 hover:bg-amber-500/20 border-amber-500/30">
                <Shield className="size-3" aria-hidden />
                Admin
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm">
            @{profile.username || profile.email.split('@')[0]}
          </p>

          {profile.bio && <p className="text-[15px] leading-snug">{profile.bio}</p>}

          <div className="flex gap-x-4 gap-y-1 flex-wrap text-sm text-muted-foreground">
            {profile.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3.5" aria-hidden />
                {profile.location}
              </span>
            )}
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-foreground hover:underline"
              >
                <Link2 className="size-3.5" aria-hidden />
                {profile.website.replace(/^https?:\/\//, '')}
              </a>
            )}
            {profile.created_at && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="size-3.5" aria-hidden />
                Tham gia {new Date(profile.created_at).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long' })}
              </span>
            )}
          </div>

          <div className="flex gap-4 text-sm pt-1">
            <span>
              <strong className="text-foreground">{formatCount(profile.following_count ?? 0)}</strong>{' '}
              <span className="text-muted-foreground">Đang theo dõi</span>
            </span>
            <span>
              <strong className="text-foreground">{formatCount(profile.followers_count ?? 0)}</strong>{' '}
              <span className="text-muted-foreground">Người theo dõi</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
