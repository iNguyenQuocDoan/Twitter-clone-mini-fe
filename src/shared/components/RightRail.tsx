import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function RightRail() {
  return (
    <div className="space-y-4 sticky top-4">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          placeholder="Tìm kiếm"
          aria-label="Tìm kiếm"
          className="pl-9 bg-muted/40 border-transparent focus-visible:bg-background focus-visible:border-border"
        />
      </div>

      <section
        aria-label="Đang thịnh hành"
        className="rounded-2xl border border-border bg-card p-4 space-y-1"
      >
        <h2 className="font-semibold text-[15px]">Đang thịnh hành</h2>
        <p className="text-sm text-muted-foreground">
          Tính năng đang phát triển. Hãy quay lại sau.
        </p>
      </section>

      <section
        aria-label="Gợi ý theo dõi"
        className="rounded-2xl border border-border bg-card p-4 space-y-1"
      >
        <h2 className="font-semibold text-[15px]">Gợi ý theo dõi</h2>
        <p className="text-sm text-muted-foreground">
          Sẽ có gợi ý khi bạn có thêm bạn bè trên nền tảng.
        </p>
      </section>
    </div>
  )
}
