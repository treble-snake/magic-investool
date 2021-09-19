export enum ActionType {
  BUY = 'BUY',
  SELL = 'SELL'
}

export type HistoryRecord = {
  ticker: string;
  name: string;
  date: string;
  type: ActionType,
  qty: number;
  price: number;
};

export interface HistoryStorage {
  findAll(): Promise<HistoryRecord[]>;

  save(records: HistoryRecord[]): Promise<void>;

  addRecord(record: HistoryRecord): Promise<void>;
}
