export interface MessagePeer {
  _id: string
  name: string
  username: string
  avatar: string
}

export interface Conversation {
  _id: string
  members: string[]
  last_message: string
  last_sender_id: string | null
  last_message_at: string | null
  created_at: string
  updated_at: string
  peer?: MessagePeer
  unread_count?: number
}

/** Admin shape: includes all member users (not just the peer) + message_count */
export interface AdminConversation extends Omit<Conversation, 'peer' | 'unread_count'> {
  member_users: MessagePeer[]
  message_count: number
}

export interface Message {
  _id: string
  conversation_id: string
  sender_id: string
  content: string
  read_by: string[]
  created_at: string
}
