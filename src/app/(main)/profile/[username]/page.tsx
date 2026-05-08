'use client'

import { use } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ProfileHeader, ProfileHeaderSkeleton, useProfile } from '@/features/users'

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params)
  const router = useRouter()
  const { data: profile, isLoading, isError } = useProfile(username)

  return (
    <div>
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b px-4 py-3 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="font-bold text-xl">{profile?.name || 'Hồ sơ'}</h1>
      </div>

      {isLoading && <ProfileHeaderSkeleton />}
      {isError && (
        <div className="p-8 text-center text-muted-foreground">
          <p>Không tìm thấy người dùng này.</p>
        </div>
      )}
      {profile && <ProfileHeader profile={profile} />}
    </div>
  )
}
