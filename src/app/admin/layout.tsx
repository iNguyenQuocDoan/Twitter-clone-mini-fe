import { AdminGuard } from '@/shared/components/AdminGuard'
import { AdminSidebar } from '@/features/admin'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="min-h-screen flex">
        <AdminSidebar />
        <main id="admin-content" aria-label="Quản trị" className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </AdminGuard>
  )
}
