import React from 'react';
import {UiCompanyStock} from '../../../pages/api/magic-formula';
import {DataPartConfig, DataParts} from '../../company/DataParts';
import {DataAgeRow} from './DataAgeRow';

const CustomWidth: Record<DataParts, number> = Object.freeze({
  [DataParts.Overview]: 118,
  [DataParts.Price]: 118,
  [DataParts.Revenue]: 100,
  [DataParts.Trends]: 110
});

type Props = {
  dates: UiCompanyStock['lastUpdates']
}
export const DataAgeBlock = ({dates}: Props) => {
  return <>
    {
      Object.values(DataParts)
        .map(it => DataPartConfig[it])
        .map(({id, label, preset, propName}) => (
          <DataAgeRow label={label} date={dates[propName]} preset={preset}
                   width={CustomWidth[id]} key={id} />
        ))
    }
  </>;
};