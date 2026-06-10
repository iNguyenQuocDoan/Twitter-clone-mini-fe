'use client'

import { useState, useEffect, useRef } from 'react'
import { formatDistanceToNow, format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { MessageSquare, Eye } from 'lucide-react'
import { UserAvatar } from '@/features/users'
import {
  useAdminConversations,
  useAdminConversationMessages,
  useAdminRealtimeFeed,
} from '@/features/messages'
import type { AdminConversation, MessagePeer } from '@/features/messages'
import { cn } from '@/lib/utils'

export function AdminMessagesView() {
  const { data: convData, isLoading } = useAdminConversations()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useAdminRealtimeFeed()

  const conversations = convData?.data ?? []
  const total = convData?.meta.total ?? 0

  // auto-select first conversation on first load
  useEffect(() => {
    if (!selectedId && conversations.length > 0) {
      setSelectedId(conversations[0]._id)
    }
  }, [conversations, selectedId])

  return (
    <div className="flex h-[calc(100vh-1px)] min-h-0">
      <aside
        aria-label="Tất cả cuộc trò chuyện"
        className="w-80 shrink-0 border-r border-border flex flex-col"
      >
        <header className="px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <MessageSquare className="size-4 text-amber-500" aria-hidden />
            <h1 className="text-[15px] font-semibold tracking-tight">Tin nhắn</h1>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isLoading ? 'Đang tải…' : `${total} cuộc trò chuyện trong hệ thống`}
          </p>
        </header>

        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <div className="divide-y divide-border">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={`acv-${i}`} className="h-20 animate-pulse bg-muted/30" />
              ))}
            </div>
          )}
          {!isLoading && conversations.length === 0 && (
            <div className="px-6 py-12 text-center text-sm text-muted-foreground">
              Chưa có cuộc trò chuyện nào.
            </div>
          )}
          <ul className="divide-y divide-border">
            {conversations.map((c) => (
              <ConversationRow
                key={c._id}
                conv={c}
                selected={c._id === selectedId}
                onClick={() => setSelectedId(c._id)}
              />
            ))}
          </ul>
        </div>
      </aside>

      <AdminMessageReader
        conversationId={selectedId}
        conversation={conversations.find((c) => c._id === selectedId) ?? null}
      />
    </div>
  )
}

function ConversationRow({
  conv,
  selected,
  onClick,
}: {
  conv: AdminConversation
  selected: boolean
  onClick: () => void
}) {
  const [a, b] = conv.member_users
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        aria-current={selected ? 'true' : undefined}
        className={cn(
          'w-full flex items-start gap-3 p-3 text-left hover:bg-muted/40 transition-colors',
          selected && 'bg-muted/60',
        )}
      >
        <div className="relative shrink-0">
          <UserAvatar src={a?.avatar} name={a?.name} size="sm" />
          {b && (
            <span className="absolute -bottom-1 -right-1 ring-2 ring-background rounded-full">
              <UserAvatar src={b.avatar} name={b.name} size="sm" className="size-5" />
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">
            {[a?.name, b?.name].filter(Boolean).join(' ↔ ') || '(no members)'}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {conv.last_message || '(empty)'}
          </p>
          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
            <span>{conv.message_count} tin</span>
            {conv.last_message_at && (
              <>
                <span aria-hidden>·</span>
                <span>
                  {formatDistanceToNow(new Date(conv.last_message_at), {
                    locale: vi,
                    addSuffix: true,
                  })}
                </span>
              </>
            )}
          </div>
        </div>
      </button>
    </li>
  )
}

function AdminMessageReader({
  conversationId,
  conversation,
}: {
  conversationId: string | null
  conversation: AdminConversation | null
}) {
  const { data, isLoading } = useAdminConversationMessages(conversationId)
  const messages = data?.data ?? []
  const memberUsers = data?.meta.conversation?.member_users ?? conversation?.member_users ?? []
  const userMap = new Map(memberUsers.map((u) => [u._id, u]))
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages.length, conversationId])

  if (!conversationId) {
    return (
      <div className="flex-1 grid place-items-center text-center px-6 text-muted-foreground gap-3">
        <Eye className="size-10" aria-hidden />
        <p className="text-sm max-w-xs">
          Chọn một cuộc trò chuyện ở bên trái để xem nội dung (read-only).
        </p>
      </div>
    )
  }

  return (
    <section className="flex-1 flex flex-col min-h-0">
      <header className="flex items-center gap-3 px-4 py-3 border-b border-border bg-amber-500/5">
        <Eye className="size-4 text-amber-500" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold truncate">
            {memberUsers.map((u) => u.name || u.username).join(' ↔ ')}
          </p>
          <p className="text-[11px] text-muted-foreground truncate">
            Chế độ xem quản trị · {data?.meta.total ?? 0} tin nhắn
          </p>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {isLoading && (
          <p className="text-xs text-muted-foreground text-center">Đang tải…</p>
        )}
        {!isLoading && messages.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-8">
            Cuộc trò chuyện chưa có tin nhắn nào.
          </p>
        )}
        {messages.map((m) => {
          const sender = userMap.get(m.sender_id) as MessagePeer | undefined
          return (
            <article key={m._id} className="flex items-start gap-3">
              <UserAvatar src={sender?.avatar} name={sender?.name} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <p className="text-sm font-medium truncate">
                    {sender?.name || sender?.username || 'Unknown'}
                  </p>
                  <span className="text-[11px] text-muted-foreground">
                    {format(new Date(m.created_at), 'dd/MM HH:mm')}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap wrap-break-word text-foreground/90">
                  {m.content}
                </p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
