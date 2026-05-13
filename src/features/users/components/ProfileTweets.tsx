'use client'

import { useEffect, useRef } from 'react'
import { Sparkles, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TweetCard, TweetCardSkeleton } from '@/features/tweets'
import { useUserTweets } from '../hooks/use-profile'

interface ProfileTweetsProps {
  username: string
}

export function ProfileTweets({ username }: ProfileTweetsProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useUserTweets(username)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 },
    )
    const el = loadMoreRef.current
    if (el) observer.observe(el)
    return () => {
      if (el) observer.unobserve(el)
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  if (isLoading) {
    return (
      <div className="divide-y divide-border">
        {Array.from({ length: 3 }, (_, i) => (
          <TweetCardSkeleton key={`profile-skeleton-${i}`} />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
        <AlertCircle className="size-8 text-muted-foreground" aria-hidden />
        <p className="text-sm text-muted-foreground">Không thể tải tweets. Thử lại sau.</p>
      </div>
    )
  }

  const tweets = data?.pages.flatMap((p) => p.data) ?? []

  if (tweets.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
        <Sparkles className="size-8 text-muted-foreground" aria-hidden />
        <p className="text-sm text-muted-foreground">User này chưa có tweet nào.</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-border">
      {tweets.map((tweet) => (
        <TweetCard key={tweet._id} tweet={tweet} />
      ))}

      <div ref={loadMoreRef} className="py-4 text-center">
        {isFetchingNextPage ? (
          <TweetCardSkeleton />
        ) : hasNextPage ? (
          <Button variant="ghost" onClick={() => fetchNextPage()}>
            Tải thêm
          </Button>
        ) : tweets.length > 5 ? (
          <p className="text-sm text-muted-foreground">Đã tải hết tweet</p>
        ) : null}
      </div>
    </div>
  )
}
