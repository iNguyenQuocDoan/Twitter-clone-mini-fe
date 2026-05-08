import { formatDistanceToNow, format } from 'date-fns'

export const formatRelativeTime = (date: string | Date) =>
  formatDistanceToNow(new Date(date), { addSuffix: true })

export const formatDate = (date: string | Date) =>
  format(new Date(date), 'MMM d, yyyy')

export const formatCount = (count: number): string => {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`
  return String(count)
}
