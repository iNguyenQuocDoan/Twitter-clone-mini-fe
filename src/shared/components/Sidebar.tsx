'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Bell, Bookmark, User, LogOut, Bird } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { UserAvatar } from '@/features/users/components/UserAvatar'
import { useAuth } from '@/shared/hooks/use-auth'
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
    <aside className="w-64 shrink-0 h-screen sticky top-0 flex flex-col p-4 border-r">
      <Link href="/home" className="p-2 mb-2">
        <Bird className="size-8 text-primary" />
      </Link>

      <nav className="flex-1 space-y-1">
        {navItems.map(({ icon: Icon, label, href }) => {
          const profileHref = href === '/profile' ? `/profile/${user?.username}` : href
          const isActive = pathname === href || (href === '/profile' && pathname.startsWith('/profile'))
          return (
            <Link key={href} href={profileHref}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn('w-full justify-start gap-3', isActive && 'font-semibold')}
              >
                <Icon className="size-5" />
                {label}
              </Button>
            </Link>
          )
        })}
      </nav>

      <Separator className="my-4" />

      {user && (
        <div className="flex items-center gap-2">
          <UserAvatar src={user.avatar} name={user.name} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={logout} title="Đăng xuất">
            <LogOut className="size-4" />
          </Button>
        </div>
      )}
    </aside>
  )
}
