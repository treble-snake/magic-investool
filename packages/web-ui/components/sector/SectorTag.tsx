import useSWR from 'swr';
import {fetcher} from '../../libs/api';
import {identity, memoizeWith, prop, sum} from 'ramda';
import {SectorsData} from '../../pages/api/sectors';
import {Tag} from 'antd';

const getMax = memoizeWith(JSON.stringify,
  (sectors: SectorsData) => Math.max(...sectors.map(prop('qty'))));
const getAvg = memoizeWith(JSON.stringify,
  (sectors: SectorsData) => sum(sectors.map(prop('qty'))) / sectors.length);

const getColor = (max: number, average: number, value: number) => {
  if (value === 0) {
    return 'blue';
  }

  if (value === max) {
    return 'gold';
  }

  return value > average ? 'yellow' : 'green';
};


type Props = { sector: string, showQty?: boolean };
export const SectorTag = ({sector, showQty = true}: Props) => {
  const {data: sectors, error} = useSWR<SectorsData>('/api/sectors', fetcher);

  if (!sectors || error) {
    return <Tag>{sector}</Tag>;
  }

  const maxSector = getMax(sectors);
  const avgSector = getAvg(sectors);
  const qty = sectors.find(it => it.name === sector)?.qty || 0;

  const text = showQty ? `${sector} x${qty}` : sector;
  return <Tag color={getColor(maxSector, avgSector, qty)}>{text}</Tag>;
};