export interface PriceQuote {
  /** Current price */
  c: number;
  h: number;
  l: number;
  o: number;
  pc: number;
  t: number;
}

export interface RecommendationTrendItem {
  buy: number;
  hold: number;
  period: string;
  sell: number;
  strongBuy: number;
  strongSell: number;
  symbol: string;
}

export type RecommendationTrends = RecommendationTrendItem[];