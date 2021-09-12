import {
  CompanyIndicator,
  Rank,
  RecommendationData,
  RevenueData,
  ValuationData
} from './ranking';

export type CoreCompany = {
  name: string;
  ticker: string;
}

export type CompanyStock = CoreCompany & {
  lastUpdated: string;
  industry: string;
  sector: string;
  sectorScore: number;
  country: string;
  revenue: CompanyIndicator<RevenueData>;
  valuation: CompanyIndicator<ValuationData>;
  recommendation: CompanyIndicator<RecommendationData>;
  rank: Rank;
}

export type PortfolioCompany = CompanyStock & {
  purchaseDate: string;
}
