import {CompanyStock} from '../../common/types/companies.types';
import {Result as BasicResult} from './types/ticker';
import {Result as InsightResult} from './types/insight';
import {prop, sort} from 'ramda';
import {
  CompanyIndicator,
  RecommendationData,
  RevenueData,
  ValuationData
} from '../../common/types/ranking.types';

const processRevenue = (incomeHistory: any[]): CompanyIndicator<RevenueData> => {
  const data = sort(prop('timestamp'), incomeHistory.map((it) => ({
    timestamp: it.endDate.raw,
    date: it.endDate.fmt,
    value: it.totalRevenue.raw,
    valueStr: it.totalRevenue.fmt
  })));

  return {
    score: 0,
    data
  };
};

const mapValuation = (data: InsightResult): CompanyIndicator<ValuationData> => {
  const valuation = data.instrumentInfo?.valuation;
  let percentage = 0;
  if (valuation?.discount) {
    percentage = Number(valuation.discount.substr(0, valuation.discount.length - 1)) / 100;
  }
  return {
    data: {
      type: valuation?.description || 'UNKNOWN',
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

export const enrichCompanyWithYahoo = (
  basic: BasicResult,
  insights: InsightResult
): Omit<CompanyStock, 'rank' | 'ticker' | 'lastUpdated'> => {
  const {quoteType, assetProfile, incomeStatementHistory, price} = basic;

  return {
    name: quoteType.longName,
    sector: assetProfile.sector,
    sectorScore: 0,
    price: price?.regularMarketPrice?.raw || null, // TODO: take a look at "financialData" obj
    industry: assetProfile.industry,
    country: assetProfile.country,
    revenue: processRevenue(incomeStatementHistory.incomeStatementHistory),
    valuation: mapValuation(insights),
    recommendation: mapRecommendation(basic, insights),
  };
};

// todo: delete file
