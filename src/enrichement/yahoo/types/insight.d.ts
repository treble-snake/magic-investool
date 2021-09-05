import {YahooResponse} from './client';

export interface FinanceResponse {
  finance: YahooResponse<Result>
}

export interface Result extends Record<string, any>{
  symbol: string
  reports: any[]
}
