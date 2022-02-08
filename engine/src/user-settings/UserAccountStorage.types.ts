export type AccountData = {
  yahooApiKeys: string[];
  yahooCacheThreshold: number;
  magicFormulaLogin: string;
  magicFormulaPassword: string;
};

export interface UserAccountStorage {
  getAccountData(): Promise<AccountData>;

  patchAccountData(data: Partial<AccountData>): Promise<AccountData>;

  reportYahooKey(key: string, reason?: string): Promise<void>;

  getYahooKeys(): Promise<string[]>;
}