import React, {useState} from 'react';
import {fetcher} from '../libs/api';
import {ApiError} from '../components/error/ApiError';
import useSWR from 'swr';
import {Button, Empty, message, Spin, Tag, Typography} from 'antd';
import {SettingsData} from './api/settings';

const {Title} = Typography;

function ClearHiddenTickersButton({callback}: { callback: Function }) {
  // TODO: create some "use request" hook
  const [loading, setLoading] = useState(false);
  const sendRequest = async () => {
    setLoading(true);
    try {
      await fetcher(`/api/clearHidden`);
      message.success('Operation complete!');
      callback();
    } catch (e) {
      message.error('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return <Button onClick={sendRequest} loading={loading} disabled={loading}>
    Remove all
  </Button>;
}

export default function Settings() {
  const {
    data,
    error,
    mutate
  } = useSWR<SettingsData>('/api/settings', fetcher);
  const [loading, setLoading] = useState(false);

  if (error) {
    return <ApiError error={error} />;
  }

  if (!data) {
    return <Spin size={'large'} />;
  }

  // TODO: create some "use request" hook
  const sendRequest = async (ticker: string) => {
    if (loading) {
      return;
    }

    setLoading(true);
    try {
      await fetcher(`/api/hide/${ticker}`);
      message.success('Operation complete!');
      mutate();
    } catch (e) {
      message.error('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return <>
    <Title level={3}>Hidden tickers</Title>

    <div style={{marginBottom: 15}}>
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
    </div>
    <ClearHiddenTickersButton callback={mutate} />
  </>;
}