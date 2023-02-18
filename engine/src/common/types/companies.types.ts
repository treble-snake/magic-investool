import {
  CompanyIndicator,
  Rank,
  RecommendationData,
  RevenueData,
  ValuationData
} from './ranking.types';

export type CoreCompany = {
  name: string;
  ticker: string;
}

export type CompanyStock = CoreCompany & {

  sector: string;

  /**
   * Currently coming from AlphaVantage
   */
  overview: BasicCompanyInfo;

  lastUpdates: {
    alphavantageOverview: string;
    alphavantageIncome: string;
    finnhubPrice: string;
    finnhubRecommendation: string;
  }

  price: number | null;

  rank: Rank;

  /** @deprecated */
  lastUpdated: string;
  /** @deprecated */
  industry: string;
  /** @deprecated */
  sectorScore: number;
  /** @deprecated */
  country: string;

  /** @deprecated Maybe rework? */
  revenue: CompanyIndicator<RevenueData>;
  /** @deprecated */
  valuation: CompanyIndicator<ValuationData>;
  /** @deprecated make rework? */
  recommendation: CompanyIndicator<RecommendationData>;
}

// From alphavantage
export type BasicCompanyInfo = {
  peRatio: number;
  marketCap: number;
  // /** Prediction of the price in the future */
  // analystTargetPrice: number;
  // highestPrice52Weeks: number;
  // lowestPrice52Weeks: number,
  // avgPrice50Days: number;
  // avgPrice200Days: number;
}

export type PriceAlert = {
  price: number;
}

export type PortfolioCompany = CompanyStock & {
  /** Last purchase */
  purchaseDate: string;
  sharesQty: number;
  breakEvenPrice: number;
  priceAlert?: PriceAlert;
}
