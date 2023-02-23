import {CompanyStock} from '@investool/engine/dist/types';
import {Timeline} from 'antd';
import {comparator} from 'ramda';
import moment from 'moment';

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
  return <Timeline mode={'left'} style={{width: '100%'}}
                   items={
                     data.sort(comparator((a, b) => a.date < b.date))
                       .map((it, index, all) => ({
                         key: it.date,
                         label: moment(it.date).format('YYYY/MM'),
                         color: getColor(it.value, all[index - 1]?.value),
                         children: it.valueStr
                       }))
                   }
  />;
};