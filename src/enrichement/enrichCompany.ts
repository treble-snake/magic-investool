import {
  CompanyIndicator,
  CompanyWithAnalytics,
  CoreCompany, RecommendationData
} from '../common/companies';
import {getCompanyData} from './yahoo/methods/getCompanyData';
import {getInsightData} from './yahoo/methods/getInsightData';
import {Result as BasicResult} from './yahoo/types/ticker';
import {Result as InsightResult} from './yahoo/types/insight';

const processRevenue = (incomeHistory: any[]) => {
  return {
    score: 0,
    // TODO: remove formatted values
    data: incomeHistory.map((it) => ({
      timestamp: it.endDate.raw,
      date: it.endDate.fmt,
      value: it.totalRevenue.raw,
      valueStr: it.totalRevenue.fmt
    }))
  };
};

const mapValuation = (data: InsightResult) => {
  const valuation = data.instrumentInfo?.valuation;
  let percentage = 0;
  if (valuation?.discount) {
    percentage = Number(valuation.discount.substr(0, valuation.discount.length - 1)) / 100;
  }
  return {
    data: {
      type: valuation.description,
      percentage
    },
    score: 0
  };
};

function mapRecommendation(basic: BasicResult, insights: InsightResult): CompanyIndicator<RecommendationData> {
  const trend = basic.recommendationTrend?.trend?.[0] || {};
  return {
    data: {
      insight: {
        type: insights.instrumentInfo?.recommendation?.rating,
        price: insights.instrumentInfo?.recommendation?.targetPrice
      },
      trend
    },
    score: 0
  };
}

export const enrichCompanyWith = (
  company: CoreCompany,
  basic: BasicResult,
  insights: InsightResult
): CompanyWithAnalytics => {
  const {quoteType, assetProfile, incomeStatementHistory} = basic;

  return {
    ...company,
    name: quoteType.longName,
    sector: assetProfile.sector,
    industry: assetProfile.industry,
    country: assetProfile.country,
    revenue: processRevenue(incomeStatementHistory.incomeStatementHistory),
    valuation: mapValuation(insights),
    recommendation: mapRecommendation(basic, insights)
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
    ...enrichCompanyWith(company, basic, insights),
    rawFinancialData: {
      yahoo: {basic, insights}
    }
  };
};