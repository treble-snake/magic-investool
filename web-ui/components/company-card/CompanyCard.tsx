import {
  InsightRecommendationType,
  ValuationType
} from '@investool/engine/dist/types';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  QuestionOutlined,
  VerticalAlignMiddleOutlined
} from '@ant-design/icons';
import {Card, Descriptions, Statistic, Timeline} from 'antd';
import {omit} from 'ramda';
import {SectorTag} from '../sector/SectorTag';
import {LastUpdated} from '../LastUpdated';
import {Revenue} from './Revenue';
import {CompanyActions} from '../company-actions/CompanyActions';
import {DetailsLink} from '../DetailsLink';
import {TickerTag} from '../company/TickerTag';
import {UiCompanyStock} from '../../pages/api/magic-formula';
import {UiPortfolioCompany} from '../../pages/api/portfolio';
import {RefreshCompanyButton} from '../company-actions/RefreshCompanyButton';
import React from 'react';
import {PurchasePerformance} from './PurchasePerformance';

type Props = {
  company: UiCompanyStock | UiPortfolioCompany,
  actionsCallback: Function,
  showActions?: boolean
}

const {Item} = Descriptions;

const ValuationIcons = Object.freeze({
  [ValuationType.Overvalued]: <ArrowUpOutlined />,
  [ValuationType.Undervalued]: <ArrowDownOutlined />,
  [ValuationType.NearFair]: <VerticalAlignMiddleOutlined />,
  [ValuationType.Unknown]: <QuestionOutlined />,
});

const ValuationColors = Object.freeze({
  [ValuationType.Overvalued]: '#3f8600',
  [ValuationType.Undervalued]: '#cf1322',
  [ValuationType.NearFair]: '#1a3a8d',
  [ValuationType.Unknown]: '#6c6c6c',
});

const InsightColors = Object.freeze({
  [InsightRecommendationType.Buy]: '#3f8600',
  [InsightRecommendationType.Sell]: '#cf1322',
  [InsightRecommendationType.Hold]: '#1a3a8d',
  [InsightRecommendationType.Unknown]: '#6c6c6c',
});

export const CompanyCard = ({company, actionsCallback, showActions}: Props) => {
  const valuationType = company.valuation.data.type || ValuationType.Unknown;
  const ValuationIcon = ValuationIcons[company.valuation.data.type];
  const valuationColor = ValuationColors[company.valuation.data.type];

  const insightType = company.recommendation.data.insight.type || InsightRecommendationType.Unknown;
  const insightColor = InsightColors[insightType];
  const withActions = (prop: any) => showActions ? prop : undefined;

  const title = withActions(<>
    <TickerTag company={company} />
    <DetailsLink ticker={company.ticker}>
      {company.name}
    </DetailsLink>
  </>);

  const extra = withActions(<>
    <LastUpdated date={company.lastUpdated} showDiff />
    <RefreshCompanyButton company={company}
                          callback={actionsCallback} />
  </>);

  return <Card title={title}
               extra={extra}
               style={withActions({marginBottom: 15})}
               size={'small'}
               actions={withActions([
                 <CompanyActions key={'actions'} company={company}
                                 callback={actionsCallback} />
               ])}
  >
    <Descriptions size={'small'} layout={'vertical'}>
      <Item contentStyle={{display: 'block'}}>
        <SectorTag sector={company.sector} showQty={false} />
        <PurchasePerformance company={company} />
      </Item>
      <Item contentStyle={{textAlign: 'center'}}>
        <Statistic
          title={valuationType}
          prefix={ValuationIcon}
          valueStyle={{color: valuationColor}}
          valueRender={() => (<>
            {Math.round(company.valuation.data.percentage * 100)}%
            <br />
            ${company.price || '-'}
          </>)}
        />
      </Item>
      <Item>
        <Statistic
          title={insightType}
          value={company.recommendation.data.insight.price || '-'}
          valueStyle={{color: insightColor}}
          prefix={'$'}
        />
      </Item>

      <Item>
        <Revenue data={company.revenue.data} />
      </Item>

      <Item>
        <Timeline mode={'left'} style={{width: '100%'}}>
          {
            Object.entries(omit(['period'], company.recommendation.data.trend))
              .map(([key, value]) => (
                <Timeline.Item label={key} key={key}>
                  {value}
                </Timeline.Item>)
              )
          }
        </Timeline>
      </Item>


      <Item label={'Rank'}>
        <Timeline mode={'left'} style={{width: '100%'}}>
          {
            Object.entries(company.rank)
              .map(([key, value]) => (
                <Timeline.Item label={key.replace(/^by/, '')} key={key}>
                  {value}
                </Timeline.Item>)
              )
          }
        </Timeline>
      </Item>
    </Descriptions>
  </Card>;
};