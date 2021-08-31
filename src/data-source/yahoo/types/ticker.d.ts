import {YahooResponse} from './client';

export interface QuoteSummaryResponse {
  quoteSummary: YahooResponse<Result>
}

export interface Result {
  assetProfile: AssetProfile
  recommendationTrend: any
  cashflowStatementHistory: any
  indexTrend: any
  defaultKeyStatistics: DefaultKeyStatistics
  quoteType: any
  incomeStatementHistory: any
  fundOwnership: any
  summaryDetail: any
  insiderHolders: any
  calendarEvents: any
  upgradeDowngradeHistory: any
  price: any
  balanceSheetHistory: any
  earningsTrend: any
  secFilings: any
  institutionOwnership: any
  majorHoldersBreakdown: any
  balanceSheetHistoryQuarterly: any
  earningsHistory: any
  majorDirectHolders: any
  netSharePurchaseActivity: any
  insiderTransactions: any
  incomeStatementHistoryQuarterly: any
  cashflowStatementHistoryQuarterly: any
  earnings: any
  financialData: any
}

export interface AssetProfile {
  address1: string
  city: string
  state: string
  zip: string
  country: string
  phone: string
  website: string
  industry: string
  sector: string
  longBusinessSummary: string
  fullTimeEmployees: number
  companyOfficers: any[]
  auditRisk: number
  boardRisk: number
  compensationRisk: number
  shareHolderRightsRisk: number
  overallRisk: number
  governanceEpochDate: number
  compensationAsOfEpochDate: number
  maxAge: number
}

export interface DefaultKeyStatistics {
  maxAge: any
  priceHint: any
  enterpriseValue: any
  forwardPE: any
  profitMargins: any
  floatShares: any
  sharesOutstanding: any
  sharesShort: any
  sharesShortPriorMonth: any
  sharesShortPreviousMonthDate: any
  dateShortInterest: any
  sharesPercentSharesOut: any
  heldPercentInsiders: any
  heldPercentInstitutions: any
  shortRatio: any
  shortPercentOfFloat: any
  beta: any
  impliedSharesOutstanding: any
  morningStarOverallRating: any
  morningStarRiskRating: any
  category: any
  bookValue: any
  priceToBook: any
  annualReportExpenseRatio: any
  ytdReturn: any
  beta3Year: any
  totalAssets: any
  yield: any
  fundFamily: any
  fundInceptionDate: any
  legalType: any
  threeYearAverageReturn: any
  fiveYearAverageReturn: any
  priceToSalesTrailing12Months: any
  lastFiscalYearEnd: any
  nextFiscalYearEnd: any
  mostRecentQuarter: any
  earningsQuarterlyGrowth: any
  revenueQuarterlyGrowth: any
  netIncomeToCommon: any
  trailingEps: any
  forwardEps: any
  pegRatio: any
  lastSplitFactor: any
  lastSplitDate: any
  enterpriseToRevenue: any
  enterpriseToEbitda: any
  "52WeekChange": any
  SandP52WeekChange: any
  lastDividendValue: any
  lastDividendDate: any
  lastCapGain: any
  annualHoldingsTurnover: any
}