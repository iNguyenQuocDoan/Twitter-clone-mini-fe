'use client'

import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { authService } from '../services/auth.service'
import { setTokens } from '@/shared/services/api-client'
import { useAuthStore, UserRole } from '@/shared/stores/auth.store'
import { usersService } from '@/features/users/services/users.service'
import type { LoginBody } from '../types'

export const useLogin = () => {
  const setUser = useAuthStore((s) => s.setUser)
  const router = useRouter()

  return useMutation({
    mutationFn: (body: LoginBody) => authService.login(body),
    onSuccess: async (res) => {
      const { access_token, refresh_token } = res.data.data
      setTokens(access_token, refresh_token)

      const meRes = await usersService.getMe()
      const me = meRes.data.data
      setUser(me)
      toast.success('Đăng nhập thành công!')

      // Admin land thẳng vào panel; user thường vào app
      router.replace(me.role === UserRole.Admin ? '/admin' : '/home')
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại')
    },
  })
}
