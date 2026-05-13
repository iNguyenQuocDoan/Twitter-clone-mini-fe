'use client'

import { useEffect, useState } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAdminUsers, UserTable } from '@/features/admin'

const PAGE_SIZE = 20

export default function AdminUsersPage() {
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  // debounce 300ms
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim())
      setPage(1)
    }, 300)
    return () => clearTimeout(t)
  }, [searchInput])

  const { data, isLoading, isFetching } = useAdminUsers({
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
  })

  const users = data?.data ?? []
  const meta = data?.meta

  return (
    <>
      <header className="border-b border-border px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Người dùng</h1>
          {meta && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {meta.total} user · trang {meta.page}/{meta.total_pages || 1}
            </p>
          )}
        </div>
        <div className="relative w-full sm:w-72">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm name / username / email"
            aria-label="Tìm kiếm user"
            className="pl-9 h-9"
          />
        </div>
      </header>

      <div className="relative">
        {isFetching && !isLoading && (
          <div
            className="absolute right-4 top-2 text-xs text-muted-foreground"
            aria-live="polite"
          >
            Đang cập nhật…
          </div>
        )}
        <UserTable users={users} isLoading={isLoading} />
      </div>

      {meta && meta.total_pages > 1 && (
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Trang {meta.page} trên {meta.total_pages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={meta.page <= 1 || isFetching}
            >
              <ChevronLeft className="size-4" />
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(meta.total_pages, p + 1))}
              disabled={meta.page >= meta.total_pages || isFetching}
            >
              Sau
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
