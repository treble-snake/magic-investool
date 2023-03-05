import {DownOutlined, ReloadOutlined} from '@ant-design/icons';
import {ApiButton, sendSimpleRequest} from '../common/ApiButton';
import {CoreCompany} from '@investool/engine';
import React, {useState} from 'react';
import {Dropdown, Space, Tooltip} from 'antd';
import type {MenuProps} from 'antd';

type Props = {
  company: CoreCompany,
  callback: Function
};

enum DataParts {
  Overview = 'Basic',
  Price = 'Price',
  Revenue = 'Revenue',
  Trends = 'Trends'
}

export const RefreshCompanyButton = ({company, callback}: Props) => {
  const [loading, setLoading] = useState(false);
  const mainUrl = `/api/refresh/${company.ticker}`;
  const prepareRequest = (url: string) => () => sendSimpleRequest(url, callback, setLoading);

  const reloadIcon = <ReloadOutlined style={{color: '#096dd9'}} />;
  const items: MenuProps['items'] = Object.entries(DataParts).map(([key, value]) => (
    {
      label: <Space>{reloadIcon}{value}</Space>,
      key,
      onClick: prepareRequest(`${mainUrl}?part=${key}`),
    }
  ));

  return <Dropdown.Button onClick={prepareRequest(mainUrl)}
                          loading={loading}
                          disabled={loading}
                          menu={{
                            disabled: loading,
                            items
                          }}
                          icon={<DownOutlined />}
                          buttonsRender={([leftButton, rightButton]) => [
                            <Tooltip title="Update all" key="leftButton">
                              {leftButton}
                            </Tooltip>,
                            rightButton,
                          ]}
  >
    {loading ? null : reloadIcon}
  </Dropdown.Button>;
};