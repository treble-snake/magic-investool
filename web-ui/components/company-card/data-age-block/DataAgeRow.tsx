import {Col, Row} from 'antd';
import React from 'react';

import {DataAgeThresholds} from '../../company/data-age/DataAgeHelpers';
import {LastUpdated} from '../../company/data-age/LastUpdated';

type DataAgeRowProps = {
  label: string,
  date: string,
  width: number,
  preset?: DataAgeThresholds;
};
export const DataAgeRow = ({label, date, width, preset}: DataAgeRowProps) => {
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