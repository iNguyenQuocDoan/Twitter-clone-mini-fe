'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRegister } from '../hooks/use-register'
import { registerSchema, type RegisterFormValues } from '../utils/schemas'

export function RegisterForm() {
  const router = useRouter()
  const { mutate: register_, isPending } = useRegister()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) })

  const onSubmit = (data: RegisterFormValues) => {
    register_(data, { onSuccess: () => router.push('/home') })
  }

  return (
    <Card className="border-border">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-xl">Tạo tài khoản</CardTitle>
        <CardDescription>Tham gia cộng đồng ngay hôm nay</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Tên hiển thị</Label>
            <Input
              id="name"
              placeholder="Nguyễn Văn A"
              autoComplete="name"
              {...register('name')}
              aria-invalid={!!errors.name}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              {...register('email')}
              aria-invalid={!!errors.email}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="date_of_birth">Ngày sinh</Label>
            <Input
              id="date_of_birth"
              type="date"
              {...register('date_of_birth')}
              aria-invalid={!!errors.date_of_birth}
            />
            {errors.date_of_birth && (
              <p className="text-xs text-destructive">{errors.date_of_birth.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              {...register('password')}
              aria-invalid={!!errors.password}
            />
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm_password">Xác nhận mật khẩu</Label>
            <Input
              id="confirm_password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              {...register('confirm_password')}
              aria-invalid={!!errors.confirm_password}
            />
            {errors.confirm_password && (
              <p className="text-xs text-destructive">{errors.confirm_password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Đang tạo tài khoản...' : 'Đăng ký'}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Đã có tài khoản?{' '}
            <Link href="/login" className="text-foreground hover:underline">
              Đăng nhập
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
