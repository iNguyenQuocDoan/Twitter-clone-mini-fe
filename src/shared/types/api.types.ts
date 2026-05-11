export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  total_pages: number
}

export interface PaginatedApiResponse<T> {
  success: boolean
  message: string
  data: T[]
  meta: PaginationMeta
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: Record<string, { msg: string }>
  }
}
