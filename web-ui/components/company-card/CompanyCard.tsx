import {Card, Descriptions, Tag, Timeline} from 'antd';
import {SectorTag} from '../sector/SectorTag';
import {Revenue} from './Revenue';
import {CompanyActions} from '../company-actions/CompanyActions';
import {DetailsLink} from '../DetailsLink';
import {TickerTag} from '../company/TickerTag';
import {UiCompanyStock} from '../../pages/api/magic-formula';
import {RefreshCompanyButton} from '../company-actions/RefreshCompanyButton';
import React from 'react';
import {UiPortfolioCompany} from '../../libs/cross-platform/types';
import moment from 'moment';
import {PriceBlock} from './PriceBlock';
import {ProfitLossTag} from '../company/ProfitLossTag';
import {millify} from 'millify';
import {DataAgeBlock} from './data-age-block/DataAgeBlock';
import {TrendsBlock} from './TrendsBlock';

type Props = {
  company: UiCompanyStock | UiPortfolioCompany,
  actionsCallback: Function,
  showActions?: boolean
}

const {Item} = Descriptions;

export const CompanyCard = ({company, actionsCallback, showActions}: Props) => {
  const withActions = (prop: any) => showActions ? prop : undefined;

  const title = withActions(<>
    <TickerTag company={company} />
    <DetailsLink ticker={company.ticker}>
      {company.name}
    </DetailsLink>
  </>);

  const extra = withActions(<>
    <RefreshCompanyButton company={company}
                          callback={actionsCallback} />
  </>);

  return (
    <Card title={title}
          extra={extra}
          style={withActions({marginBottom: 15})}
          size={'small'}
          actions={withActions([
            <CompanyActions key={'actions'} company={company}
                            callback={actionsCallback} />
          ])}
    >
      <Descriptions size={'small'} layout={'vertical'}>
        <Item contentStyle={{display: 'block'}} label={'Basics'}>
          <SectorTag sector={company.sector} showQty={false} />
          <div style={{marginTop: 5}}>
            <ProfitLossTag company={company} prefixed />
          </div>
          <div style={{marginTop: 5}}>
            <Tag>M. Cap: {
              company.overview.marketCap ?
                `\$${millify(company.overview.marketCap)}` :
                '-'
            }</Tag>
          </div>
          <div style={{marginTop: 5}}>
            <Tag>P/E: {company.overview.peRatio || '-'}</Tag>
          </div>

        </Item>

        <Item contentStyle={{display: 'block'}} label={'Price'}>
          <PriceBlock company={company} />
        </Item>

        <Item contentStyle={{display: 'block'}} label={'Updates'}>
          <DataAgeBlock dates={company.lastUpdates} />
        </Item>

        <Item
          label={`Revenue (${moment(company.lastUpdates.alphavantageIncome).format('YYYY/MM')})`}>
          <Revenue data={company.revenue.data} />
        </Item>

        <Item
          label={`Trends (${moment(company.recommendation.data.trend.date).format('YYYY/MM')})`}>
          <TrendsBlock trends={company.recommendation.data.trend} />
        </Item>

        <Item label={'Rank'}>
          <Timeline mode={'left'} style={{width: '100%'}}
                    items={
                      Object.entries(company.rank)
                        .map(([key, value]) => (
                          {
                            key,
                            label: key.replace(/^by/, ''),
                            children: value
                          }
                        ))
                    } />
        </Item>
      </Descriptions>
    </Card>
  );
};