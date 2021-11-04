export interface UserSettingsStorage {
  isHidden(ticker: string): Promise<boolean>;

  hideTicker(ticker: string): Promise<void>;

  showTicker(ticker: string): Promise<void>;

  getHiddenTickers(): Promise<string[]>;

  clearHiddenTickers(): Promise<void>;
}