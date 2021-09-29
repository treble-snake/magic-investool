import {CompanyStock} from '@investool/engine/dist/types';
import {Timeline} from 'antd';
import {comparator} from 'ramda';
import {format} from 'date-fns';

type Props = {
  data: CompanyStock['revenue']['data']
}

const getColor = (current: number, prev?: number) => {
  if (!current) {
    return 'gray';
  }

  if (!prev) {
    return undefined;
  }

  return current > prev ? 'green' : 'red';
};

export const Revenue = ({data}: Props) => {
  // TODO: figure out style 100%
  return <Timeline mode={'left'} style={{width: '100%'}}>
    {
      data
        .sort(comparator((a, b) => a.date < b.date))
        .map((it, index, all) => <Timeline.Item
          key={it.date}
          label={format(new Date(it.date), 'yyyy/MM')}
          color={getColor(it.value, all[index - 1]?.value)}
        >
          {it.valueStr}
        </Timeline.Item>)
    }
  </Timeline>;
};