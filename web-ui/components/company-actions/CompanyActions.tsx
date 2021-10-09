import {CompanyStock} from '@investool/engine/dist/types';
import {PortfolioCompany} from '@investool/engine';
import {PortfolioOperation} from './PortfolioOperation';
import {RefreshCompanyButton} from './RefreshCompanyButton';
import {Space} from 'antd';

type Props = {
  company: CompanyStock | PortfolioCompany,
  callback: Function
}

export const CompanyActions = ({company, callback}: Props) => {
  const buttons = [
    <RefreshCompanyButton company={company} callback={callback}
                          key={'refresh'} />,
    <PortfolioOperation isBuy callback={callback} key={'buy'} fixedValues={{
      ticker: company.ticker,
      qty: undefined
    }} />
  ];

  if ('sharesQty' in company) {
    buttons.push(
      <PortfolioOperation key={'sell'} callback={callback} fixedValues={{
        ticker: company.ticker,
        qty: company.sharesQty
      }} />
    );
  }

  return <Space>
    {buttons}
  </Space>;
};