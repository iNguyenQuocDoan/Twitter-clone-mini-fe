export interface ApiResponse<T = unknown> {
  message: string
  result: T
}

export interface PaginatedResult<T> {
  tweets: T[]
  total: number
  page: number
  limit: number
  total_pages: number
}

export interface ApiError {
  message: string
  errors?: Record<string, { msg: string }>
}
