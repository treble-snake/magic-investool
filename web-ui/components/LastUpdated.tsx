import {Tag} from 'antd';
import {toDate} from '../libs/date';
import moment from 'moment';
import {CSSProperties} from 'react';

type Props = {
  date: string | number;
  showDiff?: boolean;
  style?: CSSProperties;
  preset?: ColorPreset;
}

export type ColorPreset = {
  rotten: number;
  stale: number;
  fresh: number;
}

export const Presets = {
  normal: {
    fresh: 12,
    stale: 24,
    rotten: 48
  },
  realtime: {
    fresh: 0.25,
    stale: 1,
    rotten: 2
  },
  monthly: {
    fresh: 24 * 30,
    stale: 24 * 30 * 2,
    rotten: 24 * 30 * 3,
  }
};

const getColor = (hoursDiff: number, preset: ColorPreset = Presets.normal) => {
  if (hoursDiff > preset.rotten) {
    return 'red';
  }
  if (hoursDiff > preset.stale) {
    return 'gold';
  }
  return hoursDiff > preset.fresh ? 'yellow' : 'green';
};

export const LastUpdated = ({date, style, showDiff = true, preset}: Props) => {
  const diff = Math.abs(moment().diff(moment(date), 'minutes'));
  const hours = diff / 60;
  return <Tag color={getColor(hours, preset)} style={{...style}}>
    {
      showDiff ?
        moment.duration(moment(date).diff(moment())).humanize(true) :
        toDate(date)
    }
  </Tag>;
};
