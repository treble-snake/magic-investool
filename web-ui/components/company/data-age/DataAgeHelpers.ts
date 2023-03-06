import moment from 'moment';

/** Values in hours */
export type DataAgeThresholds = {
  rotten: number;
  stale: number;
  fresh: number;
}

// TODO: should come from backend
export const DataAgePreset = {
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

type DataAge = 'fresh' | 'stale' | 'rotten' | 'garbage';
type DataAgeUiProps = { name: DataAge, color: string, weight: number };
export const DataAgeUi: Record<DataAge, DataAgeUiProps> = {
  fresh: {name: 'fresh', color: 'green', weight: 10},
  stale: {name: 'stale', color: 'yellow', weight: 20},
  rotten: {name: 'rotten', color: 'gold', weight: 30},
  garbage: {name: 'garbage', color: 'red', weight: 40}
};

export const getDataAge = (
  date: string | number,
  preset: DataAgeThresholds = DataAgePreset.normal
): DataAgeUiProps => {
  const diff = Math.abs(moment().diff(moment(date), 'minutes'));
  const hoursDiff = diff / 60;

  if (hoursDiff > preset.rotten) {
    return DataAgeUi.garbage;
  }
  if (hoursDiff > preset.stale) {
    return DataAgeUi.rotten;
  }
  return hoursDiff > preset.fresh ? DataAgeUi.stale : DataAgeUi.fresh;
};

