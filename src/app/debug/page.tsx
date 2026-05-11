'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { isAxiosError } from 'axios'
import { CheckCircle2, XCircle, Loader2, Circle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import apiClient, { getToken, getRefreshToken, clearTokens } from '@/shared/services/api-client'
import { useAuthStore } from '@/shared/stores/auth.store'
import { authService } from '@/features/auth/services/auth.service'
import { tweetsService } from '@/features/tweets/services/tweets.service'
import { usersService } from '@/features/users/services/users.service'
import { likesService } from '@/features/interactions/services/likes.service'
import { bookmarksService } from '@/features/interactions/services/bookmarks.service'
import { TweetType, TweetAudience } from '@/features/tweets/types'
import { cn } from '@/lib/utils'

type TestStatus = 'idle' | 'loading' | 'ok' | 'error'
interface TestResult {
  status: TestStatus
  payload?: unknown
  error?: string
  durationMs?: number
}

interface TestDef {
  key: string
  label: string
  endpoint: string
  requiresAuth: boolean
  run: () => Promise<unknown>
}

export default function DebugPage() {
  const user = useAuthStore((s) => s.user)
  const [results, setResults] = useState<Record<string, TestResult>>({})
  const [hasAccessToken, setHasAccessToken] = useState(false)
  const [hasRefreshToken, setHasRefreshToken] = useState(false)
  const [beReachable, setBeReachable] = useState<'idle' | 'ok' | 'error'>('idle')
  const [lastCreatedTweetId, setLastCreatedTweetId] = useState<string | null>(null)

  useEffect(() => {
    setHasAccessToken(!!getToken())
    setHasRefreshToken(!!getRefreshToken())

    // BE reachability probe — gọi /users/me, không quan tâm response, chỉ cần BE phản hồi (kể cả 401)
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9990'}/users/me`)
      .then(() => setBeReachable('ok'))
      .catch(() => setBeReachable('error'))
  }, [user])

  const runTest = async (def: TestDef) => {
    setResults((prev) => ({ ...prev, [def.key]: { status: 'loading' } }))
    const start = performance.now()
    try {
      const payload = await def.run()
      const durationMs = Math.round(performance.now() - start)
      setResults((prev) => ({
        ...prev,
        [def.key]: { status: 'ok', payload, durationMs },
      }))
      return payload
    } catch (err) {
      const durationMs = Math.round(performance.now() - start)
      let message = 'Unknown error'
      if (isAxiosError(err)) {
        message = `${err.response?.status ?? '???'} — ${
          err.response?.data?.error?.message ?? err.response?.data?.message ?? err.message
        }`
      } else if (err instanceof Error) {
        message = err.message
      }
      setResults((prev) => ({
        ...prev,
        [def.key]: { status: 'error', error: message, durationMs },
      }))
    }
  }

  const tests: TestDef[] = [
    {
      key: 'getMe',
      label: 'Lấy thông tin user hiện tại',
      endpoint: 'GET /users/me',
      requiresAuth: true,
      run: () => usersService.getMe().then((r) => r.data.data),
    },
    {
      key: 'timeline',
      label: 'Tải timeline (trang 1)',
      endpoint: 'GET /tweets/timeline?page=1&limit=10',
      requiresAuth: true,
      run: () => tweetsService.getTimeline({ page: 1, limit: 10 }).then((r) => r.data),
    },
    {
      key: 'createTweet',
      label: 'Đăng tweet debug',
      endpoint: 'POST /tweets',
      requiresAuth: true,
      run: async () => {
        const res = await tweetsService.createTweet({
          type: TweetType.Tweet,
          audience: TweetAudience.Everyone,
          content: `[debug] Tweet test lúc ${new Date().toLocaleTimeString('vi-VN')}`,
        })
        setLastCreatedTweetId(res.data.data._id)
        return res.data.data
      },
    },
    {
      key: 'getTweet',
      label: 'Xem tweet vừa tạo',
      endpoint: 'GET /tweets/:id',
      requiresAuth: true,
      run: () => {
        if (!lastCreatedTweetId) throw new Error('Hãy chạy "Đăng tweet debug" trước')
        return tweetsService.getTweet(lastCreatedTweetId).then((r) => r.data.data)
      },
    },
    {
      key: 'like',
      label: 'Like tweet vừa tạo',
      endpoint: 'POST /likes',
      requiresAuth: true,
      run: () => {
        if (!lastCreatedTweetId) throw new Error('Hãy chạy "Đăng tweet debug" trước')
        return likesService.like(lastCreatedTweetId).then((r) => r.data)
      },
    },
    {
      key: 'unlike',
      label: 'Unlike tweet vừa tạo',
      endpoint: 'DELETE /likes/tweets/:id',
      requiresAuth: true,
      run: () => {
        if (!lastCreatedTweetId) throw new Error('Hãy chạy "Đăng tweet debug" trước')
        return likesService.unlike(lastCreatedTweetId).then((r) => r.data)
      },
    },
    {
      key: 'bookmark',
      label: 'Bookmark tweet vừa tạo',
      endpoint: 'POST /bookmarks',
      requiresAuth: true,
      run: () => {
        if (!lastCreatedTweetId) throw new Error('Hãy chạy "Đăng tweet debug" trước')
        return bookmarksService.bookmark(lastCreatedTweetId).then((r) => r.data)
      },
    },
    {
      key: 'unbookmark',
      label: 'Bỏ bookmark tweet vừa tạo',
      endpoint: 'DELETE /bookmarks/tweets/:id',
      requiresAuth: true,
      run: () => {
        if (!lastCreatedTweetId) throw new Error('Hãy chạy "Đăng tweet debug" trước')
        return bookmarksService.unbookmark(lastCreatedTweetId).then((r) => r.data)
      },
    },
    {
      key: 'getProfile',
      label: 'Lấy profile theo username',
      endpoint: 'GET /users/:username',
      requiresAuth: false,
      run: () => {
        const username = user?.username || prompt('Username cần xem?', '') || ''
        if (!username) throw new Error('Cần username')
        return usersService.getProfile(username).then((r) => r.data.data)
      },
    },
    {
      key: 'refresh',
      label: 'Refresh token thủ công',
      endpoint: 'POST /users/refresh-token',
      requiresAuth: false,
      run: async () => {
        const rt = getRefreshToken()
        if (!rt) throw new Error('Không có refresh_token trong localStorage')
        const res = await apiClient.post('/users/refresh-token', { refresh_token: rt })
        return res.data
      },
    },
    {
      key: 'logout',
      label: 'Đăng xuất (revoke refresh token)',
      endpoint: 'POST /users/logout',
      requiresAuth: true,
      run: async () => {
        const rt = getRefreshToken()
        if (!rt) throw new Error('Không có refresh_token')
        const res = await authService.logout(rt)
        return res.data
      },
    },
  ]

  const runAll = async () => {
    for (const t of tests) {
      if (t.requiresAuth && !hasAccessToken) continue
      // eslint-disable-next-line no-await-in-loop
      await runTest(t)
    }
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" />
            Quay lại
          </Link>
          <h1 className="font-semibold text-lg">Debug — Kiểm tra tích hợp API</h1>
        </div>

        <section className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <h2 className="font-semibold text-sm">Trạng thái</h2>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <Row label="BE reachable" value={<StatusDot ok={beReachable === 'ok'} loading={beReachable === 'idle'} />} />
            <Row label="Access token" value={<StatusDot ok={hasAccessToken} />} />
            <Row label="Refresh token" value={<StatusDot ok={hasRefreshToken} />} />
            <Row label="User store" value={<StatusDot ok={!!user} />} />
            <Row label="Username" value={<code className="text-xs">{user?.username || '—'}</code>} />
            <Row label="Email" value={<code className="text-xs">{user?.email || '—'}</code>} />
          </dl>
          <div className="flex gap-2 pt-2">
            <Button size="sm" onClick={runAll} disabled={!hasAccessToken}>
              Chạy tất cả test
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                clearTokens()
                useAuthStore.getState().clearAuth()
                setHasAccessToken(false)
                setHasRefreshToken(false)
              }}
            >
              Xoá tokens cục bộ
            </Button>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card divide-y divide-border">
          <header className="p-4 flex items-center justify-between">
            <h2 className="font-semibold text-sm">API tests</h2>
            <span className="text-xs text-muted-foreground">{tests.length} endpoint</span>
          </header>
          {tests.map((t) => {
            const r = results[t.key]
            const status = r?.status ?? 'idle'
            const disabled = (t.requiresAuth && !hasAccessToken) || status === 'loading'
            return (
              <div key={t.key} className="p-4 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <TestIcon status={status} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{t.label}</p>
                    <code className="text-xs text-muted-foreground">{t.endpoint}</code>
                  </div>
                  {r?.durationMs !== undefined && (
                    <span className="text-xs text-muted-foreground tabular-nums">{r.durationMs}ms</span>
                  )}
                  <Button size="sm" variant="outline" onClick={() => runTest(t)} disabled={disabled}>
                    Chạy
                  </Button>
                </div>
                {r?.status === 'error' && (
                  <p className="text-xs text-destructive font-mono whitespace-pre-wrap break-all pl-7">
                    {r.error}
                  </p>
                )}
                {r?.status === 'ok' && (
                  <details className="pl-7">
                    <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                      Xem response
                    </summary>
                    <pre className="text-xs mt-2 p-2 rounded bg-muted/50 overflow-auto max-h-48">
                      {JSON.stringify(r.payload, null, 2)}
                    </pre>
                  </details>
                )}
                {t.requiresAuth && !hasAccessToken && (
                  <p className="text-xs text-muted-foreground pl-7">Cần đăng nhập trước</p>
                )}
              </div>
            )
          })}
        </section>

        <p className="text-xs text-muted-foreground text-center">
          Trang này chỉ dùng để kiểm tra tích hợp API trong quá trình phát triển.
        </p>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right">{value}</dd>
    </>
  )
}

function StatusDot({ ok, loading }: { ok: boolean; loading?: boolean }) {
  if (loading) return <Loader2 className="size-4 animate-spin text-muted-foreground inline" aria-label="Loading" />
  return ok ? (
    <CheckCircle2 className="size-4 text-emerald-500 inline" aria-label="OK" />
  ) : (
    <XCircle className="size-4 text-destructive inline" aria-label="Missing" />
  )
}

function TestIcon({ status }: { status: TestStatus }) {
  const className = 'size-4 shrink-0'
  switch (status) {
    case 'loading':
      return <Loader2 className={cn(className, 'animate-spin text-muted-foreground')} />
    case 'ok':
      return <CheckCircle2 className={cn(className, 'text-emerald-500')} />
    case 'error':
      return <XCircle className={cn(className, 'text-destructive')} />
    default:
      return <Circle className={cn(className, 'text-muted-foreground')} />
  }
}
