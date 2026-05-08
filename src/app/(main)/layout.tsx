import { Sidebar } from '@/shared/components/Sidebar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 max-w-2xl border-r">
        {children}
      </main>
      <aside className="w-80 shrink-0 p-4 hidden xl:block">
        {/* Trending, suggestions - future enhancement */}
      </aside>
    </div>
  )
}
