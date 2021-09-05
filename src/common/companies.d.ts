export type CoreCompany = {
  name: string;
  ticker: string;
}

export type Company = CoreCompany & {
  industry: string;
  sector: string;
  country: string;
}

export type CompanyWithAnalytics = Company & {
  rawFinancialData?: any;
  // [key: string]: string;
}