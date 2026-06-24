import { cn } from '@/lib/utils'

/**
 * Narrow Twitter-style feed column (~640px). Content pages under `(main)`
 * that don't need full width (home, bookmarks, profile, tweet detail,
 * settings) wrap their content in this. Pages that need full available
 * width (e.g. /messages with its conv list + chat panel split) skip it.
 */
export function MainContentContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn('max-w-160 mx-auto', className)}>{children}</div>
}
