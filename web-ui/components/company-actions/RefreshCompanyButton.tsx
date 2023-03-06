import {DownOutlined, ReloadOutlined} from '@ant-design/icons';
import {sendSimpleRequest} from '../common/ApiButton';
import React, {useState} from 'react';
import {Badge, Dropdown, MenuProps, Space, Tooltip} from 'antd';
import {LastUpdated} from '../company/data-age/LastUpdated';
import {UiCompanyStock} from '../../pages/api/magic-formula';
import {UiPortfolioCompany} from '../../libs/cross-platform/types';
import {last, prop, sortBy} from 'ramda';
import {
  getDataAge
} from '../company/data-age/DataAgeHelpers';
import {DataParts, DataPartConfig} from '../company/DataParts';

type Props = {
  company: UiCompanyStock | UiPortfolioCompany,
  callback: Function
};

export const RefreshCompanyButton = ({company, callback}: Props) => {
  const [loading, setLoading] = useState(false);
  const {lastUpdates} = company;
  const mainUrl = `/api/refresh/${company.ticker}`;
  const prepareRequest = (url: string) => () => sendSimpleRequest(url, callback, setLoading);

  const items: MenuProps['items'] = Object.values(DataPartConfig)
    .map(({id, label, preset, propName}) => (
      {
        label: <Space style={{justifyContent: 'space-between', width: '100%'}}>
          <Space>{<ReloadOutlined style={{color: '#096dd9'}} />}{label}</Space>
          <LastUpdated date={lastUpdates[propName]} preset={preset} showDiff />
        </Space>,
        key: id,
        onClick: prepareRequest(`${mainUrl}?part=${id}`),
      }
    ));

  // Display a badge dot on refresh button
  const sortedAges = sortBy(
    prop('weight'),
    Object.values(DataPartConfig)
      .map(it => getDataAge(lastUpdates[it.propName], it.preset))
  );
  const worse = last(sortedAges)!;

  return (
    <Badge dot={worse.name !== 'fresh'} color={worse.color}>
      <Dropdown.Button onClick={prepareRequest(mainUrl)}
                       loading={loading}
                       disabled={loading}
                       menu={{
                         disabled: loading,
                         items
                       }}
                       icon={<DownOutlined />}
                       buttonsRender={([leftButton, rightButton]) => [
                         <Tooltip title="Update all" key="leftButton">
                           {
                             // TODO: better way ?
                             React.cloneElement(
                               leftButton as React.ReactElement<any, string>,
                               {style: {paddingLeft: 10, paddingRight: 10}}
                             )
                           }
                         </Tooltip>,
                         rightButton,
                       ]}
      >
        {loading ? null : <ReloadOutlined />}
      </Dropdown.Button>
    </Badge>
  );
};