'use client'

import Link from 'next/link'
import { Heart, MessageCircle, Repeat2, Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { UserAvatar } from '@/features/users/components/UserAvatar'
import { formatRelativeTime, formatCount } from '@/shared/utils/format'
import { useLike, useUnlike } from '@/features/interactions/hooks/use-likes'
import { useBookmark, useUnbookmark } from '@/features/interactions/hooks/use-bookmarks'
import type { Tweet } from '../types'

interface TweetCardProps {
  tweet: Tweet
}

export function TweetCard({ tweet }: TweetCardProps) {
  const { mutate: like } = useLike()
  const { mutate: unlike } = useUnlike()
  const { mutate: bookmark } = useBookmark()
  const { mutate: unbookmark } = useUnbookmark()

  const handleLike = () => {
    if (tweet.is_liked) unlike(tweet._id)
    else like(tweet._id)
  }

  const handleBookmark = () => {
    if (tweet.is_bookmarked) unbookmark(tweet._id)
    else bookmark(tweet._id)
  }

  return (
    <article className="p-4 hover:bg-muted/30 transition-colors">
      <div className="flex gap-3">
        <Link href={`/profile/${tweet.user?.username}`}>
          <UserAvatar src={tweet.user?.avatar} name={tweet.user?.name} />
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link href={`/profile/${tweet.user?.username}`} className="font-semibold hover:underline truncate">
              {tweet.user?.name}
            </Link>
            <span className="text-muted-foreground text-sm">
              @{tweet.user?.username} · {formatRelativeTime(tweet.created_at)}
            </span>
          </div>

          <Link href={`/tweets/${tweet._id}`}>
            <p className="mt-1 text-sm whitespace-pre-wrap break-words">{tweet.content}</p>

            {tweet.medias?.length > 0 && (
              <div className="mt-2 grid grid-cols-2 gap-1 rounded-xl overflow-hidden">
                {tweet.medias.map((media, i) =>
                  media.type === 'image' ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={media.url} alt="" className="w-full object-cover max-h-64" />
                  ) : null
                )}
              </div>
            )}
          </Link>

          <div className="flex items-center gap-6 mt-3 text-muted-foreground">
            <Button variant="ghost" size="sm" className="gap-1.5 h-8 px-2">
              <MessageCircle className="size-4" />
              <span className="text-xs">{formatCount(tweet.comment_count || 0)}</span>
            </Button>

            <Button variant="ghost" size="sm" className="gap-1.5 h-8 px-2">
              <Repeat2 className="size-4" />
              <span className="text-xs">{formatCount(tweet.retweet_count || 0)}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={`gap-1.5 h-8 px-2 ${tweet.is_liked ? 'text-red-500' : ''}`}
              onClick={handleLike}
            >
              <Heart className={`size-4 ${tweet.is_liked ? 'fill-current' : ''}`} />
              <span className="text-xs">{formatCount(tweet.like_count || 0)}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={`gap-1.5 h-8 px-2 ${tweet.is_bookmarked ? 'text-primary' : ''}`}
              onClick={handleBookmark}
            >
              <Bookmark className={`size-4 ${tweet.is_bookmarked ? 'fill-current' : ''}`} />
              <span className="text-xs">{formatCount(tweet.bookmark_count || 0)}</span>
            </Button>
          </div>
        </div>
      </div>
      <Separator className="mt-4" />
    </article>
  )
}
