import React, {useState} from 'react';
import {fetcher} from '../libs/api';
import {ApiError} from '../components/error/ApiError';
import useSWR from 'swr';
import {Card, Empty, Spin, Tag} from 'antd';
import {SettingsData} from './api/settings';
import {DeleteOutlined} from '@ant-design/icons';
import {
  ApiButton,
  sendSimpleRequest
} from '../components/common/ApiButton';

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const {
    data,
    error,
    mutate
  } = useSWR<SettingsData>('/api/settings', fetcher);

  if (error) {
    return <ApiError error={error} />;
  }

  if (!data) {
    return <Spin size={'large'} />;
  }

  const sendRequest = async (ticker: string) => {
    if (!loading) {
      return sendSimpleRequest(`/api/hide/${ticker}`, mutate, setLoading);
    }
  };

  const clearButton = <ApiButton url={`/api/clearHidden`}
                                 text={'Remove all'}
                                 icon={<DeleteOutlined />}
                                 onSuccess={mutate} />;
  return <>
    <Card title={'Hidden tickers'}
          style={{maxWidth: 500}}
          extra={clearButton}
    >
      {
        data.hiddenTickers.length > 0 ?
          data.hiddenTickers.map((it) => {
            return <Tag closable key={it}
                        onClose={() => sendRequest(it)}>
              {it}
            </Tag>;
          }) :
          <Empty />
      }
    </Card>
  </>;
}
