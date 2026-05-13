'use client'

import { Shield, MoreHorizontal, UserCog, Ban, CheckCircle2, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UserAvatar, UserRole } from '@/features/users'
import { useAuthStore } from '@/shared/stores/auth.store'
import { useUpdateAdminUser } from '../hooks/use-admin'
import type { AdminUserRow } from '../types'

const VERIFY_LABEL: Record<number, { label: string; tone: 'default' | 'verified' | 'banned' }> = {
  0: { label: 'Chưa xác minh', tone: 'default' },
  1: { label: 'Verified', tone: 'verified' },
  2: { label: 'Banned', tone: 'banned' },
}

interface UserTableProps {
  users: AdminUserRow[]
  isLoading?: boolean
}

export function UserTable({ users, isLoading }: UserTableProps) {
  const currentUser = useAuthStore((s) => s.user)
  const { mutate: updateUser, isPending } = useUpdateAdminUser()

  if (isLoading) {
    return (
      <div className="divide-y divide-border">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={`u-skel-${i}`} className="h-14 animate-pulse bg-muted/30" />
        ))}
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="px-6 py-16 text-center text-sm text-muted-foreground">
        Không tìm thấy user nào khớp.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-border text-xs text-muted-foreground">
          <tr>
            <th className="text-left font-medium px-4 py-2.5">User</th>
            <th className="text-left font-medium px-4 py-2.5 hidden sm:table-cell">Email</th>
            <th className="text-left font-medium px-4 py-2.5">Role</th>
            <th className="text-left font-medium px-4 py-2.5">Trạng thái</th>
            <th className="text-right font-medium px-4 py-2.5"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {users.map((u) => {
            const verifyMeta = VERIFY_LABEL[u.verify] ?? VERIFY_LABEL[0]
            const isAdmin = u.role === UserRole.Admin
            const isBanned = u.verify === 2
            const isSelf = u._id === currentUser?._id

            return (
              <tr key={u._id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <Link
                    href={`/profile/${u.username}`}
                    className="flex items-center gap-3 min-w-0 hover:underline"
                  >
                    <UserAvatar src={u.avatar} name={u.name} size="sm" />
                    <div className="min-w-0">
                      <p className="font-medium truncate flex items-center gap-1">
                        {u.name || u.username || '(no name)'}
                        {isAdmin && <Shield className="size-3 text-amber-500 shrink-0" aria-label="Admin" />}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        @{u.username || '—'}
                      </p>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground truncate max-w-56">
                  {u.email}
                </td>
                <td className="px-4 py-3">
                  {isAdmin ? (
                    <Badge className="bg-amber-500/15 text-amber-500 hover:bg-amber-500/20 border-amber-500/30">
                      Admin
                    </Badge>
                  ) : (
                    <Badge variant="outline">User</Badge>
                  )}
                </td>
                <td className="px-4 py-3">
                  {verifyMeta.tone === 'verified' && (
                    <Badge variant="secondary" className="gap-1">
                      <CheckCircle2 className="size-3" aria-hidden />
                      {verifyMeta.label}
                    </Badge>
                  )}
                  {verifyMeta.tone === 'banned' && (
                    <Badge className="bg-destructive/15 text-destructive hover:bg-destructive/20 border-destructive/30 gap-1">
                      <Ban className="size-3" aria-hidden />
                      {verifyMeta.label}
                    </Badge>
                  )}
                  {verifyMeta.tone === 'default' && (
                    <Badge variant="outline" className="text-muted-foreground">
                      {verifyMeta.label}
                    </Badge>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          aria-label={`Hành động cho ${u.username}`}
                        />
                      }
                    >
                      <MoreHorizontal className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel className="text-xs">
                        {u.username || u.email}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem render={<Link href={`/profile/${u.username}`} />}>
                        <ArrowUpRight className="size-4" />
                        Xem profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        disabled={isSelf || isPending}
                        onClick={() =>
                          updateUser({
                            id: u._id,
                            body: { role: isAdmin ? UserRole.User : UserRole.Admin },
                          })
                        }
                      >
                        <UserCog className="size-4" />
                        {isAdmin ? 'Hạ xuống User' : 'Nâng lên Admin'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={isSelf || isPending}
                        className={isBanned ? '' : 'text-destructive focus:text-destructive'}
                        onClick={() =>
                          updateUser({
                            id: u._id,
                            body: { verify: isBanned ? 1 : 2 },
                          })
                        }
                      >
                        {isBanned ? (
                          <>
                            <CheckCircle2 className="size-4" />
                            Bỏ ban
                          </>
                        ) : (
                          <>
                            <Ban className="size-4" />
                            Ban user
                          </>
                        )}
                      </DropdownMenuItem>
                      {isSelf && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel className="text-[11px] text-muted-foreground font-normal">
                            Không thể chỉnh sửa chính mình
                          </DropdownMenuLabel>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
