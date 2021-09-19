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

