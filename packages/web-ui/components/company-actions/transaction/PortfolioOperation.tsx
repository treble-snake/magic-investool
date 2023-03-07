import {Button} from 'antd';
import {TransactionFormValues, TransactionModal} from './TransactionModal';

type Props = {
  isBuy?: boolean,
  presetValues?: Partial<TransactionFormValues>,
  lockValues?: boolean,
  onSuccess: Function
}

export const PortfolioOperation = ({
                                     presetValues = {},
                                     isBuy = false,
                                     lockValues = true,
                                     onSuccess,
                                   }: Props) => {
  const endpoint = isBuy ? 'buy' : 'sell';
  const title = isBuy ? 'Buy' : 'Sell';
  return <TransactionModal url={(input) => `/api/${endpoint}/${input.ticker}`}
                           title={title}
                           onSuccess={onSuccess}
                           presetValues={presetValues}
                           lockedValues={lockValues ?
                             Object.keys(presetValues) as ((keyof TransactionFormValues)[]) :
                             []}
  >
    {({onClick}: any) => {
      return (
        <Button type={'primary'} danger={!isBuy} onClick={onClick}>
          {title}
        </Button>
      );
    }}
  </TransactionModal>;
};