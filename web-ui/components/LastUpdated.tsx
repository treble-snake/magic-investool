import {Tag} from 'antd';
import {toDate} from '../libs/date';
import moment from 'moment';

type Props = {
  date: string | number;
  showDiff?: boolean;
  prefix?: boolean;
}

const getColor = (hoursDiff: number) => {
  if (hoursDiff > 48) {
    return 'red';
  }
  if (hoursDiff > 24) {
    return 'gold';
  }
  return hoursDiff > 12 ? 'yellow' : 'green';
};

export const LastUpdated = ({date, prefix = false, showDiff = true}: Props) => {
  const diff = Math.abs(moment().diff(moment(date), 'hour'));

  return <Tag color={getColor(diff)}>
    {prefix ? 'Upd: ' : ''}
    {
      showDiff ?
        moment.duration(moment(date).diff(moment())).humanize(true) :
        toDate(date)
    }
  </Tag>;
};
