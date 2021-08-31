import {YahooResponse} from './client';

export interface FinanceResponse {
  finance: YahooResponse<Result>
}

export interface Result {
  symbol: string
  reports: any[]
}
