import {Tag} from 'antd';
import React from 'react';
import {formatMoney} from '../../libs/utils/formatMoney';
import {PurchasePerformance} from './PurchasePerformance';
import {UiCompanyStock} from '../../pages/api/magic-formula';
import {UiPortfolioCompany} from '../../libs/cross-platform/types';

const getTargetColor = (currentPrice: number, targetPrice: number, bep: number) => {
  if (targetPrice === 0 || (currentPrice === 0 && bep === 0)) {
    return 'default';
  }

  if (bep !== 0) {
    return targetPrice <= bep ? 'red' : 'green';
  }

  return targetPrice <= currentPrice ? 'red' : 'green';
}

type Props = {
  company: UiPortfolioCompany | UiCompanyStock
}
export const PriceBlock = ({company}: Props) => {
  const currentPrice = company.price || 0;
  const targetPrice = company.overview.analystTargetPrice || 0;
  let bep = 0;
  if ('breakEvenPrice' in company) {
    bep = company.breakEvenPrice;
  }

  return <>
    <Tag style={{marginBottom: 5}}>Current:
      ${currentPrice > 0 ? formatMoney(currentPrice) : '-'}
    </Tag>
    <Tag color={getTargetColor(currentPrice, targetPrice, bep)}>
      Target: ${targetPrice > 0 ? formatMoney(targetPrice) : '-'}
    </Tag>
    <PurchasePerformance company={company} />
  </>;
};