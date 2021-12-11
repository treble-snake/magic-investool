import {UiCompanyStock} from '../../pages/api/magic-formula';
import {Tag, Typography} from 'antd';
import {PresetColorType, PresetStatusColorType} from 'antd/lib/_util/colors';
import {UiPortfolioCompany} from '../../libs/cross-platform/types';

const {Text} = Typography;

type TickerTagCompany = Pick<UiPortfolioCompany | UiCompanyStock, 'hidden' | 'ticker'>;

function getColor(company: TickerTagCompany): (PresetColorType | PresetStatusColorType) {
  return company.hidden ? 'red' : 'default';
}

export function TickerTag({company}: { company: TickerTagCompany }) {
  return <Tag color={getColor(company)}>
    <Text copyable>{company.ticker}</Text>
  </Tag>;
}
