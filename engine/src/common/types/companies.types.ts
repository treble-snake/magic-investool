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
  lastUpdated: string;
  industry: string;
  // TODO: maybe use CompanyIndicator for sector?
  sector: string;
  sectorScore: number;
  country: string;
  price: number | null;
  revenue: CompanyIndicator<RevenueData>;
  valuation: CompanyIndicator<ValuationData>;
  recommendation: CompanyIndicator<RecommendationData>;
  rank: Rank;
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
