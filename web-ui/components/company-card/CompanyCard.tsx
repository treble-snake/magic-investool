import {
  CompanyStock,
  InsightRecommendationType,
  ValuationType
} from '@investool/engine/dist/types';
import {PortfolioCompany} from '@investool/engine';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  QuestionOutlined,
  ReloadOutlined,
  VerticalAlignMiddleOutlined
} from '@ant-design/icons';
import {Button, Card, Descriptions, Statistic, Tag, Timeline} from 'antd';
import {toDate} from '../../libs/date';
import {comparator, omit} from 'ramda';
import {format} from 'date-fns';
import {fetcher} from '../../libs/api';
import {SectorTag} from '../sector/SectorTag';
import {LastUpdated} from '../LastUpdated';

type Props = {
  company: CompanyStock | PortfolioCompany,
  mutate: Function
}

const {Item} = Descriptions;

export const CompanyCard = ({company, mutate}: Props) => {
  const dataRefresher = (ticker: string) => async () => {
    await fetcher(`/api/refresh/${ticker}`);
    mutate();
  };

  const sellHandler = (ticker: string) => async () => {
    await fetcher(`/api/buy/${ticker}`, {price: 101});
    mutate();
  };

  const ValuationIcon = {
    [ValuationType.Overvalued]: <ArrowUpOutlined />,
    [ValuationType.Undervalued]: <ArrowDownOutlined />,
    [ValuationType.NearFair]: <VerticalAlignMiddleOutlined />,
    [ValuationType.Unknown]: <QuestionOutlined />,
  }[company.valuation.data.type];
  const valuationColor = {
    [ValuationType.Overvalued]: '#3f8600',
    [ValuationType.Undervalued]: '#cf1322',
    [ValuationType.NearFair]: '#1a3a8d',
    [ValuationType.Unknown]: '#6c6c6c',
  }[company.valuation.data.type] || '#6c6c6c';

  const insightType = company.recommendation.data.insight.type || InsightRecommendationType.Unknown;
  const insightColor = {
    [InsightRecommendationType.Buy]: '#3f8600',
    [InsightRecommendationType.Sell]: '#cf1322',
    [InsightRecommendationType.Hold]: '#1a3a8d',
    [InsightRecommendationType.Unknown]: '#6c6c6c',
  }[insightType];

  const title = <>
    {`${company.ticker} / ${company.name}`}{' '}
    <LastUpdated date={company.lastUpdated} showDiff={false}/>
  </>;

  const actions = <>
    <Button type={'primary'} size={'small'} icon={<ReloadOutlined />}
            onClick={dataRefresher(company.ticker)} />
    {' '}
    <Button type={'primary'} size={'small'}
            onClick={sellHandler(company.ticker)}
    >Do it!</Button>
  </>;

  return <Card title={title} size={'small'}
               extra={actions}
               style={{marginBottom: 15}}
  >
    <Descriptions size={'small'} layout={'vertical'}>
      <Item>
        <SectorTag sector={company.sector} showQty={false}/>
      </Item>
      <Item>
        <Statistic
          title={company.valuation.data.type}
          value={company.valuation.data.percentage}
          precision={2}
          valueStyle={{color: valuationColor}}
          prefix={ValuationIcon}
          suffix="%"
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
        <Timeline mode={'left'} style={{width: '100%'}}>
          {
            company.revenue.data
              .sort(comparator((a, b) => a.date > b.date))
              .map(it => <Timeline.Item
                key={it.timestamp}
                label={format(it.timestamp * 1000, 'yyyy/MM')}>
                {it.valueStr}
              </Timeline.Item>)
          }
        </Timeline>
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
}