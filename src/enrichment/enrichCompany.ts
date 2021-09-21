import {CompanyStock, CoreCompany} from '../common/types/companies.types';
import {getCompanyData} from './yahoo/methods/getCompanyData';
import {getInsightData} from './yahoo/methods/getInsightData';
import {Result as BasicResult} from './yahoo/types/ticker';
import {Result as InsightResult} from './yahoo/types/insight';
import {prop, sort} from 'ramda';
import {logger} from '../common/logging/logger';
import {
  CompanyIndicator,
  RecommendationData,
  RevenueData,
  ValuationData
} from '../common/types/ranking.types';
import {makeEmptyCompany} from './makeEmptyCompany';
import {AppContext} from '../context/context';

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

const enrichCompanyWithYahoo = (
  basic: BasicResult,
  insights: InsightResult
): Omit<CompanyStock, 'rank' | 'ticker' | 'lastUpdated'> => {
  const {quoteType, assetProfile, incomeStatementHistory} = basic;

  return {
    name: quoteType.longName,
    sector: assetProfile.sector,
    sectorScore: 0,
    industry: assetProfile.industry,
    country: assetProfile.country,
    revenue: processRevenue(incomeStatementHistory.incomeStatementHistory),
    valuation: mapValuation(insights),
    recommendation: mapRecommendation(basic, insights),
  };
};

/**
 * Best effort update, should not throw
 */
// TODO: decouple more stuff
export const enrichCompany = async (company: CoreCompany, context: AppContext): Promise<CompanyStock> => {
  if (!company.ticker) {
    throw new Error('Given company does not have a ticker');
  }

  const cache = context.yahooCache;

  logger.info(`Enriching ${company.ticker}`);
  const emptyCompany = makeEmptyCompany(company);

  try {
    // TODO: don't fail all if only 1 req failed
    const [basic, insights] = await Promise.all([
      getCompanyData(company.ticker),
      getInsightData(company.ticker)
    ]);

    // TODO: don't wait for cache ?
    await cache.set(
      company.ticker, {basic, insights, lastUpdated: new Date().toISOString()});

    return {
      ...emptyCompany,
      ...enrichCompanyWithYahoo(basic, insights),
      lastUpdated: new Date().toISOString(),
    };
  } catch (e) {
    const cachedData = await cache.get(company.ticker);
    if (cachedData) {
      return {
        ...emptyCompany,
        ...enrichCompanyWithYahoo(cachedData.basic, cachedData.insights),
        lastUpdated: cachedData.lastUpdated,
      };
    }

    return emptyCompany;
  }
};