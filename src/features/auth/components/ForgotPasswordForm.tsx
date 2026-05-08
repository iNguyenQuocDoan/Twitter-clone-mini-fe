'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { authService } from '../services/auth.service'
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '../utils/schemas'

export function ForgotPasswordForm() {
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (data: ForgotPasswordFormValues) => authService.forgotPassword(data),
    onSuccess: () => toast.success('Email đặt lại mật khẩu đã được gửi!'),
    onError: () => toast.error('Email không tồn tại trong hệ thống'),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) })

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Quên mật khẩu</CardTitle>
        <CardDescription>Nhập email để nhận link đặt lại mật khẩu</CardDescription>
      </CardHeader>
      <CardContent>
        {isSuccess ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Kiểm tra hộp thư của bạn và nhấn vào link để đặt lại mật khẩu.
            </p>
            <Link href="/login" className="text-primary hover:underline text-sm">
              Quay lại đăng nhập
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="name@example.com" {...register('email')} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Đang gửi...' : 'Gửi email'}
            </Button>

            <p className="text-center text-sm">
              <Link href="/login" className="text-primary hover:underline">
                Quay lại đăng nhập
              </Link>
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
