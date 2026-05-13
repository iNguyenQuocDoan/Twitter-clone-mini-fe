'use client'

import {
  Users,
  Shield,
  Ban,
  MessageSquare,
  Heart,
  Bookmark,
  UserPlus,
  Send,
} from 'lucide-react'
import { useAdminStats, StatCard } from '@/features/admin'

export default function AdminDashboardPage() {
  const { data: stats, isLoading, isError } = useAdminStats()

  return (
    <>
      <header className="border-b border-border px-6 py-4">
        <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Tổng quan hệ thống — cập nhật mỗi 30 giây
        </p>
      </header>

      <div className="p-6 space-y-6">
        {isError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            Không thể tải thống kê. Bạn vẫn còn quyền admin chứ?
          </div>
        )}

        <section aria-labelledby="overview-h" className="space-y-3">
          <h2 id="overview-h" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Tổng quan
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              label="Users"
              value={isLoading ? '—' : stats?.total_users ?? 0}
              icon={Users}
            />
            <StatCard
              label="Admins"
              value={isLoading ? '—' : stats?.total_admins ?? 0}
              icon={Shield}
              tone="admin"
            />
            <StatCard
              label="Banned"
              value={isLoading ? '—' : stats?.total_banned ?? 0}
              icon={Ban}
              tone="warn"
            />
            <StatCard
              label="Tweets"
              value={isLoading ? '—' : stats?.total_tweets ?? 0}
              icon={MessageSquare}
            />
          </div>
        </section>

        <section aria-labelledby="engagement-h" className="space-y-3">
          <h2 id="engagement-h" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Tương tác
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              label="Likes"
              value={isLoading ? '—' : stats?.total_likes ?? 0}
              icon={Heart}
            />
            <StatCard
              label="Bookmarks"
              value={isLoading ? '—' : stats?.total_bookmarks ?? 0}
              icon={Bookmark}
            />
            <StatCard
              label="Users hôm nay"
              value={isLoading ? '—' : stats?.new_users_today ?? 0}
              delta="Đăng ký mới trong 24h"
              icon={UserPlus}
            />
            <StatCard
              label="Tweets hôm nay"
              value={isLoading ? '—' : stats?.new_tweets_today ?? 0}
              delta="Bài đăng mới trong 24h"
              icon={Send}
            />
          </div>
        </section>
      </div>
    </>
  )
}
