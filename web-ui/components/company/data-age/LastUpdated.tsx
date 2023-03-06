import {Tag} from 'antd';
import {toDate} from '../../../libs/date';
import moment from 'moment';
import {CSSProperties} from 'react';
import {DataAgeThresholds, getDataAge} from './DataAgeHelpers';

type Props = {
  date: string | number;
  showDiff?: boolean;
  style?: CSSProperties;
  preset?: DataAgeThresholds;
}

export const LastUpdated = ({date, style, showDiff = true, preset}: Props) => {
  return <Tag color={getDataAge(date, preset).color} style={{...style}}>
    {
      showDiff ?
        moment.duration(moment(date).diff(moment())).humanize(true) :
        toDate(date)
    }
  </Tag>;
};
