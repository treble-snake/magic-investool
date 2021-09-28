import {differenceInHours, formatDistanceToNow} from 'date-fns';
import {Tag} from 'antd';
import {toDate} from '../libs/date';

type Props = { date: string | number; showDiff?: boolean; }

const getColor = (hoursDiff: number) => {
  if (hoursDiff > 48) {
    return 'red';
  }
  if (hoursDiff > 24) {
    return 'gold';
  }
  return hoursDiff > 12 ? 'yellow' : 'green';
};

export const LastUpdated = ({date, showDiff = true}: Props) => {
  const value = new Date(date);
  const diff = Math.abs(differenceInHours(value, new Date()));

  return <Tag color={getColor(diff)}>
    {
      showDiff ?
        formatDistanceToNow(new Date(date), {
          includeSeconds: false,
          addSuffix: true
        }) :
        toDate(value)
    }
  </Tag>;
};
