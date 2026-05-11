'use client'

import { useState } from 'react'
import { Image as ImageIcon, Smile } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { UserAvatar } from '@/features/users'
import { useAuthStore } from '@/shared/stores/auth.store'
import { useCreateTweet } from '../hooks/use-tweets'
import { TweetType, TweetAudience } from '../types'
import { cn } from '@/lib/utils'

const MAX_LENGTH = 280
const WARN_REMAINING = 20

export function TweetComposer() {
  const [content, setContent] = useState('')
  const user = useAuthStore((s) => s.user)
  const { mutate: createTweet, isPending } = useCreateTweet()

  const remaining = MAX_LENGTH - content.length
  const isOverLimit = remaining < 0
  const isEmpty = content.trim().length === 0

  const handleSubmit = () => {
    if (isEmpty || isOverLimit || isPending) return
    createTweet(
      { type: TweetType.Tweet, audience: TweetAudience.Everyone, content: content.trim() },
      { onSuccess: () => setContent('') },
    )
  }

  return (
    <div className="px-4 py-3 flex gap-3 border-b border-border">
      <UserAvatar src={user?.avatar} name={user?.name} />
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <Textarea
          placeholder="Bạn đang nghĩ gì?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          aria-label="Soạn tweet"
          className="resize-none border-none shadow-none focus-visible:ring-0 px-0 text-[15px] min-h-20 placeholder:text-muted-foreground"
        />
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 hover:bg-muted/60 hover:text-foreground"
              aria-label="Thêm ảnh"
              disabled
            >
              <ImageIcon className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 hover:bg-muted/60 hover:text-foreground"
              aria-label="Thêm biểu cảm"
              disabled
            >
              <Smile className="size-4" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            {!isEmpty && (
              <span
                className={cn(
                  'text-xs tabular-nums',
                  isOverLimit
                    ? 'text-destructive'
                    : remaining < WARN_REMAINING
                    ? 'text-yellow-500'
                    : 'text-muted-foreground',
                )}
                aria-live="polite"
              >
                {remaining}
              </span>
            )}
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={isPending || isEmpty || isOverLimit}
              className="h-8 px-4 rounded-full font-semibold"
            >
              {isPending ? 'Đang đăng...' : 'Tweet'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
