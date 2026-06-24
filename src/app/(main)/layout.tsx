import { Sidebar } from '@/shared/components/Sidebar'
import { RightRail } from '@/shared/components/RightRail'
import { AuthGuard } from '@/shared/components/AuthGuard'
import { AdminViewingBanner } from '@/shared/components/AdminViewingBanner'
import { RealtimeProvider } from '@/shared/components/RealtimeProvider'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <RealtimeProvider>
      <div className="min-h-screen">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-background focus:border focus:rounded focus:px-3 focus:py-2"
        >
          Bỏ qua đến nội dung chính
        </a>
        <AdminViewingBanner />
        <div className="mx-auto flex max-w-7xl">
          <Sidebar />
          <main
            id="main-content"
            aria-label="Nội dung chính"
            className="flex-1 min-w-0 border-x border-border"
          >
            {/*
              Pages that want narrow Twitter-style feed content wrap themselves
              in MainContentContainer. /messages does NOT — it needs full
              available width for the conv list + chat panel split.
            */}
            {children}
          </main>
          <RightRail />
          {/* RightRail self-hides on /messages so chat takes the full
              main column width */}
        </div>
      </div>
      </RealtimeProvider>
    </AuthGuard>
  )
}
