import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: number | string
  delta?: string
  icon?: LucideIcon
  tone?: 'default' | 'admin' | 'warn'
}

export function StatCard({ label, value, delta, icon: Icon, tone = 'default' }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        {Icon && (
          <Icon
            className={cn(
              'size-4',
              tone === 'admin' && 'text-amber-500',
              tone === 'warn' && 'text-destructive',
              tone === 'default' && 'text-muted-foreground',
            )}
            aria-hidden
          />
        )}
      </div>
      <p className="text-2xl font-semibold tabular-nums tracking-tight">{value}</p>
      {delta && <p className="text-xs text-muted-foreground">{delta}</p>}
    </div>
  )
}
