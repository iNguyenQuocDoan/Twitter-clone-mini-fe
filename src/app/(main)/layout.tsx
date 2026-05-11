import { Sidebar } from '@/shared/components/Sidebar'
import { RightRail } from '@/shared/components/RightRail'
import { AuthGuard } from '@/shared/components/AuthGuard'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-background focus:border focus:rounded focus:px-3 focus:py-2"
        >
          Bỏ qua đến nội dung chính
        </a>
        <div className="mx-auto flex max-w-7xl">
          <Sidebar />
          <main
            id="main-content"
            aria-label="Nội dung chính"
            className="flex-1 min-w-0 border-x border-border max-w-160"
          >
            {children}
          </main>
          <aside
            aria-label="Khám phá"
            className="w-80 shrink-0 p-4 hidden xl:block"
          >
            <RightRail />
          </aside>
        </div>
      </div>
    </AuthGuard>
  )
}
