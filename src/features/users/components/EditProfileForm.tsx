'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useMe, useUpdateMe } from '../hooks/use-profile'
import { updateMeSchema, type UpdateMeFormValues } from '../utils/schemas'

export function EditProfileForm() {
  const { data: me } = useMe()
  const { mutate: updateMe, isPending } = useUpdateMe()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateMeFormValues>({
    resolver: zodResolver(updateMeSchema),
    defaultValues: {
      name: '',
      username: '',
      bio: '',
      location: '',
      website: '',
      avatar: '',
      cover_photo: '',
      date_of_birth: '',
    },
  })

  // hydrate form when /me arrives
  useEffect(() => {
    if (!me) return
    reset({
      name: me.name ?? '',
      username: me.username ?? '',
      bio: me.bio ?? '',
      location: me.location ?? '',
      website: me.website ?? '',
      avatar: me.avatar ?? '',
      cover_photo: me.cover_photo ?? '',
      date_of_birth: me.created_at ? '' : '',
    })
  }, [me, reset])

  const onSubmit = (data: UpdateMeFormValues) => {
    // strip empty optional strings → don't overwrite with empty unless user blanked them
    const body = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined && v !== ''),
    )
    updateMe(body)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Tên hiển thị" error={errors.name?.message} htmlFor="name">
          <Input id="name" autoComplete="name" {...register('name')} aria-invalid={!!errors.name} />
        </Field>
        <Field label="Username" error={errors.username?.message} htmlFor="username">
          <Input id="username" autoComplete="username" {...register('username')} aria-invalid={!!errors.username} />
        </Field>
      </div>

      <Field label="Bio" error={errors.bio?.message} htmlFor="bio">
        <Textarea
          id="bio"
          rows={3}
          placeholder="Giới thiệu ngắn về bạn (tối đa 280 ký tự)"
          {...register('bio')}
          aria-invalid={!!errors.bio}
        />
      </Field>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Vị trí" error={errors.location?.message} htmlFor="location">
          <Input id="location" {...register('location')} aria-invalid={!!errors.location} />
        </Field>
        <Field label="Website" error={errors.website?.message} htmlFor="website">
          <Input
            id="website"
            placeholder="https://example.com"
            inputMode="url"
            {...register('website')}
            aria-invalid={!!errors.website}
          />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="URL avatar" hint="Hỗ trợ URL ảnh — upload sẽ thêm sau" htmlFor="avatar">
          <Input id="avatar" {...register('avatar')} />
        </Field>
        <Field label="URL ảnh bìa" hint="URL ảnh nền profile" htmlFor="cover_photo">
          <Input id="cover_photo" {...register('cover_photo')} />
        </Field>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
        <Button type="button" variant="ghost" onClick={() => reset()} disabled={isPending || !isDirty}>
          Hoàn tác
        </Button>
        <Button type="submit" disabled={isPending || !isDirty}>
          {isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </div>
    </form>
  )
}

interface FieldProps {
  label: string
  htmlFor: string
  error?: string
  hint?: string
  children: React.ReactNode
}

function Field({ label, htmlFor, error, hint, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}
