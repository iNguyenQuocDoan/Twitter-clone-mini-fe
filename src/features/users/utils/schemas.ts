import { z } from 'zod'

const optionalString = z.string().trim().optional().or(z.literal(''))

export const updateMeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Tên không được để trống')
    .max(100, 'Tên tối đa 100 ký tự'),
  username: z
    .string()
    .trim()
    .min(3, 'Username ít nhất 3 ký tự')
    .max(50, 'Username tối đa 50 ký tự')
    .regex(/^[a-zA-Z0-9_]+$/, 'Chỉ chữ, số và dấu gạch dưới'),
  bio: z.string().trim().max(280, 'Bio tối đa 280 ký tự').optional().or(z.literal('')),
  location: z.string().trim().max(100, 'Tối đa 100 ký tự').optional().or(z.literal('')),
  website: z
    .string()
    .trim()
    .max(200)
    .refine((v) => !v || /^https?:\/\//.test(v), 'Phải bắt đầu bằng http:// hoặc https://')
    .optional()
    .or(z.literal('')),
  avatar: optionalString,
  cover_photo: optionalString,
  date_of_birth: optionalString,
})

export const changePasswordSchema = z
  .object({
    old_password: z.string().min(6, 'Mật khẩu cũ ít nhất 6 ký tự'),
    password: z
      .string()
      .min(6, 'Mật khẩu mới ít nhất 6 ký tự')
      .regex(/[A-Z]/, 'Phải có ít nhất 1 chữ hoa')
      .regex(/[0-9]/, 'Phải có ít nhất 1 chữ số'),
    confirm_password: z.string(),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirm_password'],
  })
  .refine((d) => d.old_password !== d.password, {
    message: 'Mật khẩu mới phải khác mật khẩu cũ',
    path: ['password'],
  })

export type UpdateMeFormValues = z.infer<typeof updateMeSchema>
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>
