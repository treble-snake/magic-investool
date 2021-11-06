import {CompanyStock} from '@investool/engine/dist/types';
import {PortfolioCompany} from '@investool/engine';
import {PortfolioOperation} from './transaction/PortfolioOperation';
import {RefreshCompanyButton} from './RefreshCompanyButton';
import {Space} from 'antd';
import {HideCompanyButton} from './HideCompanyButton';
import moment from 'moment';

type Props = {
  company: CompanyStock | PortfolioCompany,
  callback: Function
}

export const CompanyActions = ({company, callback}: Props) => {
  const buttons = [
    <HideCompanyButton company={company} callback={callback} key={'hide'} />,
    <RefreshCompanyButton company={company} callback={callback}
                          key={'refresh'} />,
    <PortfolioOperation isBuy onSuccess={callback} key={'buy'} presetValues={{
      ticker: company.ticker,
      date: moment()
    }} />
  ];

  if ('sharesQty' in company) {
    buttons.push(
      <PortfolioOperation key={'sell'} onSuccess={callback} presetValues={{
        ticker: company.ticker,
        qty: company.sharesQty,
        date: moment()
      }} />
    );
  }

  return <Space>
    {buttons}
  </Space>;
};