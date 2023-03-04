import {Col, Row} from 'antd';
import React from 'react';
import {UiCompanyStock} from '../../pages/api/magic-formula';
import {ColorPreset, LastUpdated, Presets} from '../LastUpdated';

type RowProps = {
  label: string,
  date: string,
  width: number,
  preset?: ColorPreset;
};

const DateRow = ({label, date, width, preset}: RowProps) => {
  return <Row style={{justifyContent: 'space-between'}}>
    <Col>{label}</Col>
    <Col>
      <LastUpdated date={date} preset={preset}
                   style={{
                     marginRight: 0,
                     maxWidth: width,
                     overflow: 'hidden',
                     textOverflow: 'ellipsis'
                   }}
                   showDiff />
    </Col>
  </Row>;
};

type Props = {
  dates: UiCompanyStock['lastUpdates']
}

export const UpdatesBlock = ({dates}: Props) => {
  return <>
    <DateRow label={'Basic'} date={dates.alphavantageOverview} width={118} />
    <DateRow label={'Price'} preset={Presets.realtime} date={dates.finnhubPrice}
             width={118} />
    <DateRow label={'Revenue'} preset={Presets.monthly}
             date={dates.alphavantageIncome} width={100} />
    <DateRow label={'Trends'} date={dates.finnhubRecommendation} width={110} />
  </>;
};