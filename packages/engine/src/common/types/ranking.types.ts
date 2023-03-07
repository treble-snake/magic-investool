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

export type RecommendationData = {
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
  byPrice: number,
  total: number;
}