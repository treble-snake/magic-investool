import {Space} from 'antd';
import React from 'react';
import {EyeInvisibleTwoTone} from '@ant-design/icons';
import {UiCompanyStock} from '../../pages/api/magic-formula';
import {UiPortfolioCompany} from '../../pages/api/portfolio';
import {DetailsLink} from '../DetailsLink';

type Props = {
  company: UiCompanyStock | UiPortfolioCompany;
  icons: JSX.Element[]
}

export const TableCompanyName = ({company, icons}: Props) => {
  const name = 'sharesQty' in company ?
    `${company.name} x ${company.sharesQty}` :
    company.name;

  return <Space>
    {
      company.hidden ?
        icons.concat(<EyeInvisibleTwoTone twoToneColor={'red'}
                                          key={'hidden'} />) :
        icons
    }
    <DetailsLink ticker={company.ticker}>
      {name}
    </DetailsLink>
  </Space>;
};
