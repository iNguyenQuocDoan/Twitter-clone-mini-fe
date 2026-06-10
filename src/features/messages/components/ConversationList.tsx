'use client'

import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { MessageSquare } from 'lucide-react'
import { UserAvatar } from '@/features/users'
import { useAuthStore } from '@/shared/stores/auth.store'
import { cn } from '@/lib/utils'
import { useConversations } from '../hooks/use-messages'
import type { Conversation } from '../types'

interface ConversationListProps {
  selectedId: string | null
  onSelect: (conv: Conversation) => void
}

export function ConversationList({ selectedId, onSelect }: ConversationListProps) {
  const me = useAuthStore((s) => s.user)
  const { data, isLoading, isError } = useConversations()
  const conversations = data?.data ?? []

  if (isLoading) {
    return (
      <div className="divide-y divide-border">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={`conv-skel-${i}`} className="h-16 animate-pulse bg-muted/30" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-sm text-muted-foreground">
        Không tải được conversations.
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
        <MessageSquare className="size-8 text-muted-foreground" aria-hidden />
        <p className="text-sm text-muted-foreground max-w-[200px]">
          Chưa có cuộc trò chuyện nào. Vào profile của người khác và nhắn tin để bắt đầu.
        </p>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-border">
      {conversations.map((conv) => {
        const peer = conv.peer
        const isSelected = conv._id === selectedId
        const isUnread = (conv.unread_count ?? 0) > 0 && conv.last_sender_id !== me?._id

        return (
          <li key={conv._id}>
            <button
              type="button"
              onClick={() => onSelect(conv)}
              aria-current={isSelected ? 'true' : undefined}
              className={cn(
                'w-full flex items-start gap-3 p-3 text-left hover:bg-muted/40 transition-colors',
                isSelected && 'bg-muted/60',
              )}
            >
              <UserAvatar src={peer?.avatar} name={peer?.name} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <p className={cn('text-sm truncate', isUnread ? 'font-semibold' : 'font-medium')}>
                    {peer?.name || peer?.username || '(unknown)'}
                  </p>
                  {conv.last_message_at && (
                    <span className="text-[11px] text-muted-foreground shrink-0">
                      {formatDistanceToNow(new Date(conv.last_message_at), {
                        locale: vi,
                        addSuffix: false,
                      })}
                    </span>
                  )}
                </div>
                <p
                  className={cn(
                    'text-xs truncate',
                    isUnread ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {conv.last_message || 'Bắt đầu trò chuyện…'}
                </p>
              </div>
              {isUnread && (
                <span
                  className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-primary text-[10px] font-semibold text-primary-foreground"
                  aria-label={`${conv.unread_count} tin chưa đọc`}
                >
                  {conv.unread_count}
                </span>
              )}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
