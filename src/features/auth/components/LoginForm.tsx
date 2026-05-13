'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useLogin } from '../hooks/use-login'
import { loginSchema, type LoginFormValues } from '../utils/schemas'

export function LoginForm() {
  const { mutate: login, isPending } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  const onSubmit = (data: LoginFormValues) => {
    // Redirect happens inside useLogin (role-aware: Admin → /admin, else /home)
    login(data)
  }

  return (
    <Card className="border-border">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-xl">Đăng nhập</CardTitle>
        <CardDescription>Chào mừng bạn quay lại</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <div className="flex items-baseline justify-between">
              <Label htmlFor="password">Mật khẩu</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              {...register('password')}
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Chưa có tài khoản?{' '}
            <Link href="/register" className="text-foreground hover:underline">
              Đăng ký
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
