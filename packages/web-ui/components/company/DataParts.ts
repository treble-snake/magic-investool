import {UiCompanyStock} from '../../pages/api/magic-formula';
import {DataAgePreset, DataAgeThresholds} from './data-age/DataAgeHelpers';

// TODO: should come from backend ?
export enum DataParts {
  Overview = 'Overview',
  Price = 'Price',
  Revenue = 'Revenue',
  Trends = 'Trends'
}

export const DataPartConfig: Record<DataParts, {
  id: DataParts,
  label: string,
  propName: keyof (UiCompanyStock['lastUpdates']),
  preset: DataAgeThresholds,
}> = {
  [DataParts.Overview]: {
    id: DataParts.Overview,
    label: 'Basics',
    propName: 'alphavantageOverview',
    preset: DataAgePreset.normal
  },
  [DataParts.Price]: {
    id: DataParts.Price,
    label: 'Price',
    propName: 'finnhubPrice',
    preset: DataAgePreset.realtime
  },
  [DataParts.Revenue]: {
    id: DataParts.Revenue,
    label: 'Revenue',
    propName: 'alphavantageIncome',
    preset: DataAgePreset.monthly
  },
  [DataParts.Trends]: {
    id: DataParts.Trends,
    label: 'Trends',
    propName: 'finnhubRecommendation',
    preset: DataAgePreset.normal
  }
};