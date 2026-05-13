'use client'

import { use } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  ProfileHeader,
  ProfileHeaderSkeleton,
  ProfileTweets,
  useProfile,
} from '@/features/users'

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params)
  const router = useRouter()
  const { data: profile, isLoading, isError } = useProfile(username)

  return (
    <>
      <header className="sticky top-0 z-10 bg-background/70 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          aria-label="Quay lại"
          className="size-8"
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div className="min-w-0">
          <h1 className="text-[15px] font-semibold tracking-tight truncate">
            {profile?.name || (isLoading ? 'Đang tải…' : 'Hồ sơ')}
          </h1>
          {profile && (
            <p className="text-xs text-muted-foreground">
              {profile.tweets_count ?? 0} tweet
            </p>
          )}
        </div>
      </header>

      {isLoading && <ProfileHeaderSkeleton />}
      {isError && (
        <div className="px-6 py-12 text-center text-sm text-muted-foreground">
          Không tìm thấy người dùng này.
        </div>
      )}
      {profile && (
        <>
          <ProfileHeader profile={profile} />
          <div className="border-t border-border" />
          <ProfileTweets username={profile.username} />
        </>
      )}
    </>
  )
}
