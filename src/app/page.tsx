'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Bird, MessageSquare, Users, Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/shared/stores/auth.store'
import { ThemeToggle } from '@/shared/components/ThemeToggle'

const features = [
  { icon: MessageSquare, title: 'Đăng tweet', desc: 'Chia sẻ suy nghĩ trong 280 ký tự.' },
  { icon: Users, title: 'Theo dõi bạn bè', desc: 'Xem dòng thời gian của những người bạn quan tâm.' },
  { icon: Bookmark, title: 'Lưu tweet', desc: 'Bookmark để đọc lại sau.' },
]

export default function LandingPage() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    if (user) router.replace('/home')
  }, [user, router])

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2" aria-label="Twitter Clone">
          <Bird className="size-7 text-primary" aria-hidden />
          <span className="font-bold text-lg tracking-tight">Twitter</span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex-1 grid place-items-center px-6 py-12">
        <div className="w-full max-w-xl text-center space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Chào mừng đến với Twitter
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              Đăng nhập để xem dòng thời gian của bạn, hoặc tạo tài khoản mới chỉ trong vài giây.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register" className="sm:w-44">
              <Button size="lg" className="w-full font-semibold">
                Tạo tài khoản
              </Button>
            </Link>
            <Link href="/login" className="sm:w-44">
              <Button size="lg" variant="outline" className="w-full font-semibold">
                Đăng nhập
              </Button>
            </Link>
          </div>

          <ul className="grid sm:grid-cols-3 gap-4 pt-8 text-left">
            {features.map(({ icon: Icon, title, desc }) => (
              <li
                key={title}
                className="rounded-2xl border border-border bg-card p-4 space-y-2"
              >
                <Icon className="size-5 text-muted-foreground" aria-hidden />
                <p className="font-semibold text-sm">{title}</p>
                <p className="text-xs text-muted-foreground leading-snug">{desc}</p>
              </li>
            ))}
          </ul>

          <p className="text-xs text-muted-foreground pt-4">
            Đang phát triển?{' '}
            <Link href="/debug" className="underline hover:text-foreground">
              Xem trang debug
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
