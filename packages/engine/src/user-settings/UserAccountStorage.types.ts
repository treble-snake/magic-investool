export type AccountData = {
  alphavantageApiKey: string;
  finnhubApiKey: string;
  magicFormulaLogin: string;
  magicFormulaPassword: string;
  stockUpdatesEnabled?: boolean;
  stockUpdatesIntervalMin?: number;
  // TODO: re-evaluate
  priceSchedulerEnabled?: boolean;
  priceSchedulerIntervalMin?: number;
  priceNotificationsEnabled?: boolean;
};

export interface UserAccountStorage {
  getAccountData(): Promise<AccountData>;

  patchAccountData(data: Partial<AccountData>): Promise<AccountData>;
}