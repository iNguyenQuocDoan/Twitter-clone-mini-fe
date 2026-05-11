'use client'

import Link from 'next/link'
import { Heart, MessageCircle, Repeat2, Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/features/users'
import { formatRelativeTime, formatCount } from '@/shared/utils/format'
import { useLike, useUnlike, useBookmark, useUnbookmark } from '@/features/interactions'
import { cn } from '@/lib/utils'
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
    <article className="px-4 py-3 hover:bg-muted/30 transition-colors">
      <div className="flex gap-3">
        <Link href={`/profile/${tweet.user?.username}`} className="shrink-0">
          <UserAvatar src={tweet.user?.avatar} name={tweet.user?.name} />
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[15px]">
            <Link
              href={`/profile/${tweet.user?.username}`}
              className="font-semibold hover:underline truncate"
            >
              {tweet.user?.name}
            </Link>
            <span className="text-muted-foreground truncate">@{tweet.user?.username}</span>
            <span className="text-muted-foreground" aria-hidden>
              ·
            </span>
            <time className="text-muted-foreground" dateTime={tweet.created_at}>
              {formatRelativeTime(tweet.created_at)}
            </time>
          </div>

          <Link href={`/tweets/${tweet._id}`} className="block">
            <p className="mt-0.5 text-[15px] leading-snug whitespace-pre-wrap wrap-break-word">
              {tweet.content}
            </p>

            {tweet.medias?.length > 0 && (
              <div className="mt-2 grid grid-cols-2 gap-1 rounded-xl overflow-hidden border border-border">
                {tweet.medias.map((media, i) =>
                  media.type === 'image' ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={media.url} alt="" className="w-full object-cover max-h-64" />
                  ) : null,
                )}
              </div>
            )}
          </Link>

          <div className="flex items-center justify-between mt-2 -ml-2 text-muted-foreground">
            <ActionButton
              icon={<MessageCircle className="size-4.5" />}
              count={tweet.comment_count}
              label={`Bình luận, ${tweet.comment_count || 0}`}
              hoverColor="hover:text-sky-500"
            />
            <ActionButton
              icon={<Repeat2 className="size-4.5" />}
              count={tweet.retweet_count}
              label={`Đăng lại, ${tweet.retweet_count || 0}`}
              hoverColor="hover:text-emerald-500"
            />
            <ActionButton
              icon={<Heart className={cn('size-4.5', tweet.is_liked && 'fill-current')} />}
              count={tweet.like_count}
              label={`${tweet.is_liked ? 'Bỏ thích' : 'Thích'}, ${tweet.like_count || 0}`}
              onClick={handleLike}
              pressed={tweet.is_liked}
              activeColor="text-rose-500"
              hoverColor="hover:text-rose-500"
            />
            <ActionButton
              icon={<Bookmark className={cn('size-4.5', tweet.is_bookmarked && 'fill-current')} />}
              count={tweet.bookmark_count}
              label={`${tweet.is_bookmarked ? 'Bỏ lưu' : 'Lưu'}, ${tweet.bookmark_count || 0}`}
              onClick={handleBookmark}
              pressed={tweet.is_bookmarked}
              activeColor="text-primary"
              hoverColor="hover:text-primary"
            />
          </div>
        </div>
      </div>
    </article>
  )
}

interface ActionButtonProps {
  icon: React.ReactNode
  count?: number
  label: string
  onClick?: () => void
  pressed?: boolean
  activeColor?: string
  hoverColor: string
}

function ActionButton({ icon, count, label, onClick, pressed, activeColor, hoverColor }: ActionButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      aria-label={label}
      aria-pressed={onClick ? pressed : undefined}
      className={cn(
        'h-8 px-2 gap-1.5 rounded-full transition-colors',
        hoverColor,
        pressed && activeColor,
      )}
    >
      {icon}
      <span className="text-xs tabular-nums">{formatCount(count || 0)}</span>
    </Button>
  )
}
