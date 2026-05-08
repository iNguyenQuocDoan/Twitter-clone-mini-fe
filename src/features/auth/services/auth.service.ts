import apiClient from '@/shared/services/api-client'
import { ApiResponse } from '@/shared/types'
import type {
  LoginBody,
  RegisterBody,
  ForgotPasswordBody,
  ResetPasswordBody,
  TokenResponse,
} from '../types'

export const authService = {
  login: (body: LoginBody) =>
    apiClient.post<ApiResponse<TokenResponse>>('/users/login', body),

  register: (body: RegisterBody) =>
    apiClient.post<ApiResponse<TokenResponse>>('/users/register', body),

  logout: (refreshToken: string) =>
    apiClient.post('/users/logout', { refresh_token: refreshToken }),

  forgotPassword: (body: ForgotPasswordBody) =>
    apiClient.post('/users/forgot-password', body),

  resetPassword: (body: ResetPasswordBody) =>
    apiClient.post('/users/reset-password', body),

  verifyEmail: (emailVerifyToken: string) =>
    apiClient.post('/users/verify-email', { email_verify_token: emailVerifyToken }),

  resendVerifyEmail: () =>
    apiClient.post('/users/resend-verify-email'),
}
