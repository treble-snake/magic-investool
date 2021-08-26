export interface YahooResponse<T> {
  result: T
  error: YahooError
}

export interface YahooError {
  code: string
  description: string
}
