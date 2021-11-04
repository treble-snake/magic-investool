import {UiCompanyStock} from '../../pages/api/magic-formula';
import {UiPortfolioCompany} from '../../pages/api/portfolio';
import {Tag} from 'antd';
import {PresetColorType, PresetStatusColorType} from 'antd/lib/_util/colors';
import {UiSuggestedCompany} from '../../pages/api/suggestion';

function getColor(company: UiCompanyStock | UiPortfolioCompany | UiSuggestedCompany): (PresetColorType | PresetStatusColorType) {
  const usual = 'owned' in company ? 'blue' : 'default';
  return company.hidden ? 'red' : usual;
}

export function TickerTag({company}: { company: UiCompanyStock | UiPortfolioCompany | UiSuggestedCompany }) {
  return <Tag color={getColor(company)}>{company.ticker}</Tag>;
}
