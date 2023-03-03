export type CompanyIndicator<T> = {
  data: T,
  score: number;
}

export type RevenueData = Array<{
  /** @deprecated */
  timestamp: number;
  date: string;
  value: number;
}>;

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
  Sell = 'SELL',
  Unknown = 'UNKNOWN',
}

export type RecommendationData = {
  insight: {
    type: InsightRecommendationType;
    price: number;
  },
  trend: {
    date: string;
    strongBuy: number;
    buy: number;
    hold: number;
    sell: number;
    strongSell: number;
  }
}

export type Rank = {
  bySector: number,
  byRevenue: number,
  byRecommendation: number,
  byValuation: number,
  total: number;
}