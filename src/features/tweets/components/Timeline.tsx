'use client'

import { useEffect, useRef } from 'react'
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
      <div>
        {Array.from({ length: 5 }).map((_, i) => <TweetCardSkeleton key={i} />)}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>Không thể tải timeline. Vui lòng thử lại.</p>
      </div>
    )
  }

  const tweets = data?.pages.flatMap((p) => p.data) ?? []

  if (tweets.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>Chưa có tweet nào. Hãy theo dõi người khác để xem feed của họ!</p>
      </div>
    )
  }

  return (
    <div>
      {tweets.map((tweet) => (
        <TweetCard key={tweet._id} tweet={tweet} />
      ))}

      <div ref={loadMoreRef} className="py-4 text-center">
        {isFetchingNextPage ? (
          <TweetCardSkeleton />
        ) : hasNextPage ? (
          <Button variant="ghost" onClick={() => fetchNextPage()}>Tải thêm</Button>
        ) : (
          <p className="text-sm text-muted-foreground">Đã tải hết tweet</p>
        )}
      </div>
    </div>
  )
}
