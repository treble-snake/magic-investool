import {CompanyWithAnalytics, CoreCompany} from '../common/companies';
import {getCompanyData} from './yahoo/methods/getCompanyData';
import {getInsightData} from './yahoo/methods/getInsightData';
import {Result as BasicResult} from './yahoo/types/ticker';
import {Result as InsightResult} from './yahoo/types/insight';

export const mapBasicData = (data: BasicResult) => {
  const {quoteType, assetProfile, incomeStatementHistory} = data;
  const revenue = (incomeStatementHistory.incomeStatementHistory as any[]).map((it) => {
    return {
      date: it.endDate.fmt,
      totalRevenue: it.totalRevenue.raw,
      totalRevenueUi: it.totalRevenue.fmt
    }
  });

  return {
    name: quoteType.longName,
    sector: assetProfile.sector,
    industry: assetProfile.industry,
    country: assetProfile.country,
    revenue
  };
};

export const mapInsights = (data: InsightResult) => {
  return {
    valuation: data.instrumentInfo?.valuation?.description,
    recommendation: data.instrumentInfo?.recommendation?.rating,
    recommendationPrice: data.instrumentInfo?.recommendation?.targetPrice
  };
};

export const enrichCompany = async (company: CoreCompany): Promise<CompanyWithAnalytics> => {
  if (!company.ticker) {
    throw new Error('Given company does not have a ticker');
  }

  const [basic, insights] = await Promise.all([
    getCompanyData(company.ticker),
    getInsightData(company.ticker)
  ]);

  return {
    ...company,
    ...mapBasicData(basic),
    ...mapInsights(insights),
    rawFinancialData: {
      yahoo: {basic, insights}
    }
  };
};