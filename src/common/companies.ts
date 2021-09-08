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

export enum ValuationType {
  Undervalued = 'Undervalued',
  Overvalued = 'Overvalued',
  NearFair = 'Near Fair Value',
  Unknown = 'UNKNOWN'
}

export type ValuationData = {
  type: ValuationType;
  percentage: number;
}

export enum InsightRecommendationType {
  Buy = 'BUY',
  Hold = 'HOLD',
  Sell = 'SELL'
}

export type RecommendationData = {
  insight: {
    type: InsightRecommendationType;
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
  lastUpdated?: string;
  industry: string;
  sector: string;
  sectorScore: number;
  country: string;
  revenue: CompanyIndicator<RevenueData[]>;
  valuation: CompanyIndicator<ValuationData>;
  recommendation: CompanyIndicator<RecommendationData>;
  rawFinancialData?: RawFinancialData;
}
