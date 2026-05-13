'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Eye, Shield, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/shared/components/ThemeToggle'
import { useAuth } from '@/shared/hooks/use-auth'
import { cn } from '@/lib/utils'

const adminNav = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Users, label: 'Người dùng', href: '/admin/users' },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 flex flex-col px-3 py-4 border-r border-border bg-background">
      <div className="flex items-center gap-2 px-2 py-2 mb-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
        <Shield className="size-5 text-amber-500 shrink-0" aria-hidden />
        <div className="min-w-0">
          <p className="font-bold text-sm tracking-tight leading-none">Twitter Admin</p>
          <p className="text-[11px] text-amber-500/80 mt-0.5">Bảng điều khiển hệ thống</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5" aria-label="Điều hướng admin">
        {adminNav.map(({ icon: Icon, label, href }) => {
          const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
          return (
            <Link key={href} href={href} aria-current={isActive ? 'page' : undefined}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3 h-10 text-sm',
                  isActive && 'font-semibold',
                )}
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </Button>
            </Link>
          )
        })}
      </nav>

      <Separator className="my-3" />

      <Link href="/home">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 h-9 text-sm"
          title="Mở trang chủ app như user thường — admin role vẫn giữ"
        >
          <Eye className="size-4" aria-hidden />
          Xem như user
        </Button>
      </Link>

      <div className="mt-3 flex items-center gap-2 px-1">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate">{user?.name}</p>
          <p className="text-[11px] text-amber-500 truncate">@{user?.username} · Admin</p>
        </div>
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          onClick={logout}
          aria-label="Đăng xuất"
          title="Đăng xuất"
          className="size-8"
        >
          <LogOut className="size-4" />
        </Button>
      </div>
    </aside>
  )
}
