'use client'

import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { authService } from '../services/auth.service'
import { setTokens } from '@/shared/services/api-client'
import { useAuthStore } from '@/shared/stores/auth.store'
import { usersService } from '@/features/users/services/users.service'
import type { LoginBody } from '../types'

export const useLogin = () => {
  const setUser = useAuthStore((s) => s.setUser)

  return useMutation({
    mutationFn: (body: LoginBody) => authService.login(body),
    onSuccess: async (res) => {
      const { access_token, refresh_token } = res.data.result
      setTokens(access_token, refresh_token)

      const meRes = await usersService.getMe()
      setUser(meRes.data.result)
      toast.success('Đăng nhập thành công!')
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại')
    },
  })
}
