'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Bell, Bookmark, User, LogOut, Bird } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { UserAvatar } from '@/features/users'
import { useAuth } from '@/shared/hooks/use-auth'
import { ThemeToggle } from '@/shared/components/ThemeToggle'
import { cn } from '@/lib/utils'

const navItems = [
  { icon: Home, label: 'Trang chủ', href: '/home' },
  { icon: Search, label: 'Tìm kiếm', href: '/explore' },
  { icon: Bell, label: 'Thông báo', href: '/notifications' },
  { icon: Bookmark, label: 'Bookmarks', href: '/bookmarks' },
  { icon: User, label: 'Hồ sơ', href: '/profile' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 flex flex-col px-3 py-4 border-r border-border">
      <Link
        href="/home"
        className="flex items-center gap-2 px-2 py-2 mb-2 rounded-lg hover:bg-muted/60 transition-colors"
        aria-label="Twitter Clone — trang chủ"
      >
        <Bird className="size-7 text-primary" aria-hidden />
        <span className="font-bold text-lg tracking-tight">Twitter</span>
      </Link>

      <nav className="flex-1 space-y-0.5" aria-label="Điều hướng chính">
        {navItems.map(({ icon: Icon, label, href }) => {
          const profileHref = href === '/profile' ? `/profile/${user?.username}` : href
          const isActive = pathname === href || (href === '/profile' && pathname.startsWith('/profile'))
          return (
            <Link key={href} href={profileHref} aria-current={isActive ? 'page' : undefined}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3 h-11 text-[15px]',
                  isActive && 'font-semibold',
                )}
              >
                <Icon className="size-5" aria-hidden />
                {label}
              </Button>
            </Link>
          )
        })}
      </nav>

      <Separator className="my-3" />

      <div className="flex items-center gap-2">
        {user ? (
          <>
            <UserAvatar src={user.avatar} name={user.name} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">@{user.username || user.email}</p>
            </div>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              aria-label="Đăng xuất"
              title="Đăng xuất"
            >
              <LogOut className="size-4" />
            </Button>
          </>
        ) : (
          <>
            <Link href="/login" className="flex-1">
              <Button variant="default" className="w-full h-9">
                Đăng nhập
              </Button>
            </Link>
            <ThemeToggle />
          </>
        )}
      </div>
    </aside>
  )
}
