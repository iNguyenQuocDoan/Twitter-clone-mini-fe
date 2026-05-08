export interface LoginBody {
  email: string
  password: string
}

export interface RegisterBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
}

export interface ForgotPasswordBody {
  email: string
}

export interface ResetPasswordBody {
  forgot_password_token: string
  password: string
  confirm_password: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
}
