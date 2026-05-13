'use client'

import Link from 'next/link'
import { Shield, ArrowRight } from 'lucide-react'
import { useAuthStore, UserRole } from '@/shared/stores/auth.store'

/**
 * Hiện khi admin đang browse app như user thường — cho phép quay lại panel
 * mà không phải dò URL. Render rỗng cho user thường.
 */
export function AdminViewingBanner() {
  const user = useAuthStore((s) => s.user)
  if (user?.role !== UserRole.Admin) return null

  return (
    <div
      role="status"
      className="sticky top-0 z-20 flex items-center justify-between gap-3 px-4 py-2 bg-amber-500/10 border-b border-amber-500/30 text-xs"
    >
      <span className="inline-flex items-center gap-2 text-amber-500">
        <Shield className="size-3.5" aria-hidden />
        Bạn đang xem như user — vai trò Admin vẫn được giữ.
      </span>
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 font-medium text-amber-500 hover:underline"
      >
        Quay lại Admin
        <ArrowRight className="size-3.5" aria-hidden />
      </Link>
    </div>
  )
}
