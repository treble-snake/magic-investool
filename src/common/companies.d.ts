import {Result as BasicYahooResult} from '../enrichement/yahoo/types/ticker';
import {Result as InsightYahooResult} from '../enrichement/yahoo/types/insight';

export type CoreCompany = {
  name: string;
  ticker: string;
}

export type CompanyIndicator<T> = {
  data: T,
  score: number;
}

export type RevenueData = {
  timestamp: number;
  date: string;
  value: number;
  valueStr: string;
};

export type ValuationData = {
  type: string;
  percentage: number;
}

export type RecommendationData = {
  insight: {
    type: string;
    price: number;
  },
  trend: {
    strongBuy: number;
    buy: number;
    hold: number;
    sell: number;
    strongSell: number;
  }
}

export type RawFinancialData = {
  yahoo: {
    basic: BasicYahooResult;
    insights: InsightYahooResult;
  }
}

export type CompanyWithAnalytics = CoreCompany & {
  industry: string;
  sector: string;
  country: string;
  revenue: CompanyIndicator<RevenueData[]>;
  valuation: CompanyIndicator<ValuationData>;
  recommendation: CompanyIndicator<RecommendationData>;
  rawFinancialData?: RawFinancialData;
}
