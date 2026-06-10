'use client'

import { useEffect, useRef, useState } from 'react'
import { format } from 'date-fns'
import { Send, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { UserAvatar } from '@/features/users'
import { useAuthStore } from '@/shared/stores/auth.store'
import { cn } from '@/lib/utils'
import {
  useConversation,
  useJoinConversation,
  useMarkRead,
  useSendMessage,
} from '../hooks/use-messages'
import type { Conversation } from '../types'

interface ChatPanelProps {
  conversation: Conversation | null
}

export function ChatPanel({ conversation }: ChatPanelProps) {
  const me = useAuthStore((s) => s.user)
  const conversationId = conversation?._id ?? null
  const { data, isLoading } = useConversation(conversationId)
  const { mutate: sendMessage, isPending } = useSendMessage(conversationId)
  const { mutate: markRead } = useMarkRead()
  const [draft, setDraft] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useJoinConversation(conversationId)

  // mark read whenever conversation opens or new messages arrive
  useEffect(() => {
    if (!conversationId) return
    markRead(conversationId)
  }, [conversationId, data?.data?.length, markRead])

  // auto-scroll to bottom on new messages
  useEffect(() => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [data?.data?.length, conversationId])

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 gap-3 text-muted-foreground">
        <MessageSquare className="size-10" aria-hidden />
        <p className="text-sm max-w-xs">
          Chọn một cuộc trò chuyện ở bên trái để xem nội dung.
        </p>
      </div>
    )
  }

  const peer = conversation.peer
  const messages = data?.data ?? []

  const handleSend = () => {
    const content = draft.trim()
    if (!content || isPending) return
    sendMessage(content, { onSuccess: () => setDraft('') })
  }

  return (
    <section className="flex-1 flex flex-col min-h-0">
      <header className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <UserAvatar src={peer?.avatar} name={peer?.name} size="sm" />
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{peer?.name || peer?.username}</p>
          <p className="text-xs text-muted-foreground truncate">@{peer?.username}</p>
        </div>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-2"
        role="log"
        aria-live="polite"
        aria-atomic="false"
      >
        {isLoading && (
          <p className="text-xs text-muted-foreground text-center">Đang tải tin nhắn…</p>
        )}
        {!isLoading && messages.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-8">
            Chưa có tin nhắn. Hãy gửi tin đầu tiên.
          </p>
        )}
        {messages.map((m) => {
          const isMine = m.sender_id === me?._id
          return (
            <div
              key={m._id}
              className={cn('flex flex-col max-w-[75%] gap-0.5', isMine ? 'ml-auto items-end' : 'mr-auto items-start')}
            >
              <div
                className={cn(
                  'rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap wrap-break-word',
                  isMine
                    ? 'bg-primary text-primary-foreground rounded-br-md'
                    : 'bg-muted text-foreground rounded-bl-md',
                )}
              >
                {m.content}
              </div>
              <span className="text-[10px] text-muted-foreground px-1">
                {format(new Date(m.created_at), 'HH:mm')}
              </span>
            </div>
          )
        })}
      </div>

      <footer className="border-t border-border p-3">
        <div className="flex gap-2 items-end">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Nhập tin nhắn… (Enter để gửi, Shift+Enter để xuống dòng)"
            aria-label="Nội dung tin nhắn"
            rows={1}
            className="resize-none min-h-9 max-h-32"
          />
          <Button
            type="button"
            size="icon"
            onClick={handleSend}
            disabled={isPending || !draft.trim()}
            aria-label="Gửi"
            className="size-9 shrink-0"
          >
            <Send className="size-4" />
          </Button>
        </div>
      </footer>
    </section>
  )
}
