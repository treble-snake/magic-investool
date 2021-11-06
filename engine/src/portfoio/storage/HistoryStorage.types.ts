export enum ActionType {
  BUY = 'BUY',
  SELL = 'SELL'
}

export type HistoryRecord = {
  id: string,
  ticker: string;
  name: string;
  date: string;
  type: ActionType,
  qty: number;
  price: number;
};

export interface HistoryStorage {
  findAll(): Promise<HistoryRecord[]>;

  addRecord(record: Omit<HistoryRecord, 'id'>): Promise<void>;

  deleteRecord(id: string): Promise<void>;

  updateRecord(id: string, record: Partial<Omit<HistoryRecord, 'id'>>): Promise<void>;
}
