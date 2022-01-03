import {ProfitLossTag} from '../company/ProfitLossTag';
import {formatMoney} from '../../libs/utils/formatMoney';
import {Tag} from 'antd';
import {UiPortfolioCompany} from '../../pages/api/portfolio';
import {UiCompanyStock} from '../../pages/api/magic-formula';

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
      <ProfitLossTag company={company} prefixed />
    </div>
    <div style={{marginTop: 5}}>
      <Tag>BEP: ${bep ? formatMoney(bep) : '?'}</Tag>
    </div>
  </>;
}