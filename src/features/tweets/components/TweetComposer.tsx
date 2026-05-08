'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { UserAvatar } from '@/features/users/components/UserAvatar'
import { useAuthStore } from '@/shared/stores/auth.store'
import { useCreateTweet } from '../hooks/use-tweets'
import { TweetType, TweetAudience } from '../types'

const MAX_LENGTH = 280

export function TweetComposer() {
  const [content, setContent] = useState('')
  const user = useAuthStore((s) => s.user)
  const { mutate: createTweet, isPending } = useCreateTweet()

  const remaining = MAX_LENGTH - content.length
  const isOverLimit = remaining < 0
  const isEmpty = content.trim().length === 0

  const handleSubmit = () => {
    if (isEmpty || isOverLimit) return
    createTweet(
      { type: TweetType.Tweet, audience: TweetAudience.Everyone, content: content.trim() },
      { onSuccess: () => setContent('') }
    )
  }

  return (
    <div className="p-4 flex gap-3 border-b">
      <UserAvatar src={user?.avatar} name={user?.name} />
      <div className="flex-1 space-y-3">
        <Textarea
          placeholder="Bạn đang nghĩ gì?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="resize-none border-none shadow-none focus-visible:ring-0 text-base min-h-[80px]"
        />
        <div className="flex items-center justify-between">
          <span className={`text-sm ${remaining < 20 ? (isOverLimit ? 'text-destructive' : 'text-yellow-500') : 'text-muted-foreground'}`}>
            {remaining}
          </span>
          <Button size="sm" onClick={handleSubmit} disabled={isPending || isEmpty || isOverLimit}>
            {isPending ? 'Đang đăng...' : 'Tweet'}
          </Button>
        </div>
      </div>
    </div>
  )
}
