import {UiPortfolioCompany} from '../../pages/api/portfolio';
import {UiCompanyStock} from '../../pages/api/magic-formula';
import {CompanyCard} from '../company-card/CompanyCard';
import {Col, Empty, Row} from 'antd';

type Props = {
  companies: (UiPortfolioCompany | UiCompanyStock)[],
  actionsCallback: Function
};

export const SuggestionList = ({companies, actionsCallback}: Props) => {
  if (companies.length === 0) {
    return <Empty />;
  }

  return <Row gutter={16}>
    {
      companies.map((it) => (
        <Col span={8} key={it.ticker}>
          <CompanyCard showActions company={it}
                       actionsCallback={actionsCallback} />
        </Col>
      ))}
  </Row>;
};