export type AccountData = {
  yahooApiKey: string;
  yahooCacheThreshold: number;
  magicFormulaLogin: string;
  magicFormulaPassword: string;
};

export interface UserAccountStorage {
  getAccountData(): Promise<AccountData>;

  patchAccountData(data: Partial<AccountData>): Promise<AccountData>;
}