import {CompanyStock} from '@investool/engine/dist/types';
import {PortfolioCompany} from '@investool/engine';
import {PortfolioOperation} from './transaction/PortfolioOperation';
import {RefreshCompanyButton} from './RefreshCompanyButton';
import {Space} from 'antd';
import {HideCompanyButton} from './HideCompanyButton';
import moment from 'moment';
import {RemoveAlertButton} from './price-alert/RemoveAlertButton';
import {SetAlertButton} from './price-alert/SetAlertButton';
import {UiCompanyStock} from '../../pages/api/magic-formula';
import {UiPortfolioCompany} from '../../libs/cross-platform/types';

type Props = {
  company: UiCompanyStock | UiPortfolioCompany,
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

    company.priceAlert ?
      buttons.push(<RemoveAlertButton key={'removeAlert'} company={company} callback={callback} />) :
      buttons.push(<SetAlertButton key={'setAlert'} company={company} callback={callback} />);
  }

  return <Space>
    {buttons}
  </Space>;
};