import {UiCompanyStock} from '../../pages/api/magic-formula';
import {UiPortfolioCompany} from '../../pages/api/portfolio';
import {Tag} from 'antd';
import {PresetColorType, PresetStatusColorType} from 'antd/lib/_util/colors';

type TickerTagCompany = Pick<UiPortfolioCompany | UiCompanyStock, 'hidden' | 'ticker'>;

function getColor(company: TickerTagCompany): (PresetColorType | PresetStatusColorType) {
  return company.hidden ? 'red' : 'default';
}

export function TickerTag({company}: { company: TickerTagCompany }) {
  return <Tag color={getColor(company)}>{company.ticker}</Tag>;
}
