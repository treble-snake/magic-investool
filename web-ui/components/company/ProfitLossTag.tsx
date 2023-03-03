import {Tag} from 'antd';
import React from 'react';
import {UiPortfolioCompany} from '../../libs/cross-platform/types';
import {UiCompanyStock} from '../../pages/api/magic-formula';

type Props = {
  company: UiPortfolioCompany | UiCompanyStock,
  prefixed?: boolean
};

export function ProfitLossTag({company, prefixed = false}: Props) {
  if (!('breakEvenPrice' in company)) {
    return null;
  }

  const {
    price,
    breakEvenPrice: bep,
    sharesQty
  } = company;
  if (!price || !bep) {
    return <Tag>{prefixed ? 'P/L: ' : ''}No data</Tag>;
  }

  const change = price > bep ? price / bep : bep / price;
  return <Tag
    color={price > bep ? 'green' : 'red'}>
    {prefixed ? 'P/L: ' : ''}
    {price > bep ? '+' : '-'}
    {Math.round(100 * (change - 1))}
    {'% '}
    (${Math.round(Math.abs(price - bep) * sharesQty)})
  </Tag>;
}