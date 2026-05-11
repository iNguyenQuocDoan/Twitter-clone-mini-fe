import Link from 'next/link'
import { Bird } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid place-items-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <Link
          href="/"
          className="flex items-center justify-center gap-2"
          aria-label="Twitter Clone — trang chủ"
        >
          <Bird className="size-8 text-primary" aria-hidden />
          <span className="font-bold text-xl tracking-tight">Twitter</span>
        </Link>
        {children}
      </div>
    </div>
  )
}
