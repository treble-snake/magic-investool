import {ProfitLossTag} from '../company/ProfitLossTag';
import {formatMoney} from '../../libs/utils/formatMoney';
import {Tag} from 'antd';
import {UiCompanyStock} from '../../pages/api/magic-formula';
import {UiPortfolioCompany} from '../../libs/cross-platform/types';

type Props = {
  company: UiPortfolioCompany | UiCompanyStock,
};

export function PurchasePerformance({company}: Props) {
  if (!('breakEvenPrice' in company)) {
    return null;
  }

  const {breakEvenPrice: bep} = company;
  return <>
    <div style={{marginTop: 5}}>
      <Tag>BEP: ${bep ? formatMoney(bep) : '?'}</Tag>
    </div>
  </>;
}