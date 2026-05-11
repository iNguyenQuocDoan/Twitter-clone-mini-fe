'use client'

import { useEffect, useRef } from 'react'
import { Sparkles, AlertCircle } from 'lucide-react'
import { useTimeline } from '../hooks/use-tweets'
import { TweetCard } from './TweetCard'
import { TweetCardSkeleton } from './TweetCardSkeleton'
import { Button } from '@/components/ui/button'

export function Timeline() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useTimeline()
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )
    const el = loadMoreRef.current
    if (el) observer.observe(el)
    return () => { if (el) observer.unobserve(el) }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  if (isLoading) {
    return (
      <div className="divide-y divide-border">
        {Array.from({ length: 5 }, (_, i) => (
          <TweetCardSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
        <AlertCircle className="size-8 text-muted-foreground" aria-hidden />
        <p className="text-sm text-muted-foreground max-w-xs">
          Không thể tải timeline. Hãy thử lại sau giây lát.
        </p>
      </div>
    )
  }

  const tweets = data?.pages.flatMap((p) => p.data) ?? []

  if (tweets.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
        <Sparkles className="size-8 text-muted-foreground" aria-hidden />
        <p className="text-sm text-muted-foreground max-w-xs">
          Chưa có tweet nào. Hãy theo dõi người khác để xem feed của họ!
        </p>
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
        ) : (
          <p className="text-sm text-muted-foreground">Đã tải hết tweet</p>
        )}
      </div>
    </div>
  )
}
