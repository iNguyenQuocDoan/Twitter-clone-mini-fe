'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useChangePassword } from '../hooks/use-profile'
import { changePasswordSchema, type ChangePasswordFormValues } from '../utils/schemas'

export function ChangePasswordForm() {
  const { mutate: changePassword, isPending } = useChangePassword()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  })

  const onSubmit = (data: ChangePasswordFormValues) => {
    changePassword(data, { onSuccess: () => reset() })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <div className="space-y-1.5">
        <Label htmlFor="old_password">Mật khẩu hiện tại</Label>
        <Input
          id="old_password"
          type="password"
          autoComplete="current-password"
          {...register('old_password')}
          aria-invalid={!!errors.old_password}
        />
        {errors.old_password && (
          <p className="text-xs text-destructive">{errors.old_password.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Mật khẩu mới</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          {...register('password')}
          aria-invalid={!!errors.password}
        />
        {errors.password ? (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Ít nhất 6 ký tự, có 1 chữ hoa và 1 chữ số.
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirm_password">Xác nhận mật khẩu mới</Label>
        <Input
          id="confirm_password"
          type="password"
          autoComplete="new-password"
          {...register('confirm_password')}
          aria-invalid={!!errors.confirm_password}
        />
        {errors.confirm_password && (
          <p className="text-xs text-destructive">{errors.confirm_password.message}</p>
        )}
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Đang đổi...' : 'Đổi mật khẩu'}
        </Button>
      </div>
    </form>
  )
}
