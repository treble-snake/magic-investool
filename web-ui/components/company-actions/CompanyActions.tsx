import {CompanyStock} from '@investool/engine/dist/types';
import {PortfolioCompany} from '@investool/engine';
import {PortfolioOperation} from './PortfolioOperation';
import styles from './CompanyActions.module.css';
import {RefreshCompanyButton} from './RefreshCompanyButton';

type Props = {
  company: CompanyStock | PortfolioCompany,
  callback: Function
}

export const CompanyActions = ({company, callback}: Props) => {
  const buttons = [
    <RefreshCompanyButton company={company} callback={callback} key={'refresh'} />,
    <span className={styles.button} key={'buy'}>
      <PortfolioOperation isBuy callback={callback} fixedValues={{
        ticker: company.ticker,
        qty: undefined
      }} />
    </span>
  ];

  if ('sharesQty' in company) {
    buttons.push(<span className={styles.button} key={'sell'}>
        <PortfolioOperation fixedValues={{
          ticker: company.ticker,
          qty: company.sharesQty
        }} callback={callback} />
    </span>);
  }

  return <>
    {buttons}
  </>;
};