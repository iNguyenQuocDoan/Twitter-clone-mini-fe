import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface UserAvatarProps {
  src?: string
  name?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'size-8',
  md: 'size-10',
  lg: 'size-16',
}

export function UserAvatar({ src, name, className, size = 'md' }: UserAvatarProps) {
  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <Avatar className={cn(sizeMap[size], className)}>
      <AvatarImage src={src} alt={name} />
      <AvatarFallback>{initials || '?'}</AvatarFallback>
    </Avatar>
  )
}
