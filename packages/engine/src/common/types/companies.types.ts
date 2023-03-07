import {
  CompanyIndicator,
  Rank,
  RecommendationData,
  RevenueData
} from './ranking.types';

export type CoreCompany = {
  name: string;
  ticker: string;
}

export type CompanyStock = CoreCompany & {
  sector: string;
  sectorScore: number;

  overview: BasicCompanyInfo;

  /** @deprecated moved to PriceData */
  price: number;

  prices: CompanyIndicator<PriceData>;
  revenue: CompanyIndicator<RevenueData>;
  recommendation: CompanyIndicator<RecommendationData>;

  rank: Rank;

  lastUpdates: {
    alphavantageOverview: string;
    alphavantageIncome: string;
    finnhubPrice: string;
    finnhubRecommendation: string;
  }

  /** @deprecated */
  lastUpdated: string;
}

export type PriceData = {
  current: number | null;
  /** Prediction of the price in the future */
  target: number;
}

// From alphavantage
export type BasicCompanyInfo = {
  peRatio: number;
  marketCap: number;
  /** @deprecated moved to PriceData */
  analystTargetPrice: number;
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
