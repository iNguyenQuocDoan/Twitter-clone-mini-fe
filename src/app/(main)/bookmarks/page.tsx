'use client'

import { useEffect, useRef } from 'react'
import { Bookmark as BookmarkIcon, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TweetCard, TweetCardSkeleton } from '@/features/tweets'
import { useBookmarks } from '@/features/interactions'
import { MainContentContainer } from '@/shared/components/MainContentContainer'

export default function BookmarksPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useBookmarks()
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

  const tweets = data?.pages.flatMap((p) => p.data) ?? []
  const total = data?.pages[0]?.meta.total ?? 0

  return (
    <MainContentContainer>
      <header className="sticky top-0 z-10 bg-background/70 backdrop-blur-md border-b border-border px-4 py-3">
        <h1 className="text-[15px] font-semibold tracking-tight">Bookmarks</h1>
        {!isLoading && (
          <p className="text-xs text-muted-foreground">
            {total} {total === 1 ? 'tweet đã lưu' : 'tweet đã lưu'}
          </p>
        )}
      </header>

      {isLoading && (
        <div className="divide-y divide-border">
          {Array.from({ length: 3 }, (_, i) => (
            <TweetCardSkeleton key={`bm-skeleton-${i}`} />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <AlertCircle className="size-8 text-muted-foreground" aria-hidden />
          <p className="text-sm text-muted-foreground">Không thể tải bookmarks. Thử lại sau.</p>
        </div>
      )}

      {!isLoading && !isError && tweets.length === 0 && (
        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <BookmarkIcon className="size-8 text-muted-foreground" aria-hidden />
          <p className="text-sm text-muted-foreground max-w-xs">
            Bạn chưa lưu tweet nào. Bấm biểu tượng <strong>Lưu</strong> trên một tweet để bookmark.
          </p>
        </div>
      )}

      {tweets.length > 0 && (
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
              <p className="text-sm text-muted-foreground">Đã tải hết bookmark</p>
            ) : null}
          </div>
        </div>
      )}
    </MainContentContainer>
  )
}
