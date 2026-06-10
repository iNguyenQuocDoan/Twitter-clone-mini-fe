'use client'

import { useState } from 'react'
import { ConversationList, ChatPanel } from '@/features/messages'
import type { Conversation } from '@/features/messages'

export default function MessagesPage() {
  const [selected, setSelected] = useState<Conversation | null>(null)

  return (
    <div className="flex h-[calc(100vh-1px)] min-h-0">
      <aside
        aria-label="Danh sách trò chuyện"
        className="w-72 shrink-0 border-r border-border flex flex-col"
      >
        <header className="px-4 py-3 border-b border-border">
          <h1 className="text-[15px] font-semibold tracking-tight">Tin nhắn</h1>
        </header>
        <div className="flex-1 overflow-y-auto">
          <ConversationList selectedId={selected?._id ?? null} onSelect={setSelected} />
        </div>
      </aside>
      <ChatPanel conversation={selected} />
    </div>
  )
}
