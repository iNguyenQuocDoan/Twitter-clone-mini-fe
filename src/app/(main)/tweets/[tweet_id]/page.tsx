'use client'

import { use } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { TweetCard, TweetCardSkeleton, useTweet } from '@/features/tweets'
import { MainContentContainer } from '@/shared/components/MainContentContainer'

export default function TweetDetailPage({ params }: { params: Promise<{ tweet_id: string }> }) {
  const { tweet_id } = use(params)
  const router = useRouter()
  const { data: tweet, isLoading, isError } = useTweet(tweet_id)

  return (
    <MainContentContainer>
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b px-4 py-3 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="font-bold text-xl">Tweet</h1>
      </div>

      {isLoading && <TweetCardSkeleton />}
      {isError && (
        <div className="p-8 text-center text-muted-foreground">
          <p>Tweet không tìm thấy hoặc đã bị xóa.</p>
        </div>
      )}
      {tweet && <TweetCard tweet={tweet} />}
    </MainContentContainer>
  )
}
