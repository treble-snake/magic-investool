export type AccountData = {
  alphavantageApiKey: string;
  finnhubApiKey: string;
  // TODO: do we need this?
  // alphavantageCacheThreshold: number;
  magicFormulaLogin: string;
  magicFormulaPassword: string;
  // TODO: re-evaluate
  priceSchedulerEnabled?: boolean;
  priceSchedulerIntervalMin?: number;
  priceNotificationsEnabled?: boolean;
};

export interface UserAccountStorage {
  getAccountData(): Promise<AccountData>;

  patchAccountData(data: Partial<AccountData>): Promise<AccountData>;
}