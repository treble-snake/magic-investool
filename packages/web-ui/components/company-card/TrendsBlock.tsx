import {Timeline, TimelineItemProps} from 'antd';
import {UiCompanyStock} from '../../pages/api/magic-formula';

type Trends = UiCompanyStock['recommendation']['data']['trend'];

type Props = {
  trends: Trends;
}

type TrendKeys = Omit<Trends, 'date' | 'period'>;

const TRENDS_OPTIONS: Record<keyof TrendKeys, string> = Object.freeze({
  strongBuy: 'green',
  buy: 'green',
  hold: 'blue',
  sell: 'red',
  strongSell: 'red'
});

export const TrendsBlock = ({trends}: Props) => {
  const items: TimelineItemProps[] =
    Object.entries(TRENDS_OPTIONS).map(([key, color]) => {
      const qty = trends[key as keyof TrendKeys];
      return {
        key,
        label: key,
        children: qty,
        color: qty > 0 ? color : 'grey'
      };
    });

  return <Timeline mode={'left'} style={{width: '100%'}} items={items} />;
};