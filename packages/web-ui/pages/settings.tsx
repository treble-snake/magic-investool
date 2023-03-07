import React, {useState} from 'react';
import {Card, Divider, Empty, Tag} from 'antd';
import {SettingsData} from './api/settings';
import {DeleteOutlined} from '@ant-design/icons';
import {ApiButton, sendSimpleRequest} from '../components/common/ApiButton';
import {DisplayData} from '../components/common/DataDisplay';
import {AccountForm} from '../components/user/AccountForm';

export default function Settings() {
  const [loading, setLoading] = useState(false);

  return <>
    <AccountForm />
    <Divider />
    <DisplayData<SettingsData> apiUrl={'/api/settings'}>
      {({data, mutate}) => {
        const sendRequest = async (ticker: string) => {
          if (!loading) {
            return sendSimpleRequest(`/api/hide/${ticker}`, mutate, setLoading);
          }
        };

        const clearButton = <ApiButton url={`/api/clearHidden`}
                                       text={'Remove all'}
                                       icon={<DeleteOutlined />}
                                       onSuccess={mutate} />;
        return <Card title={'Hidden tickers'}
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
        </Card>;
      }}
    </DisplayData>
  </>;
}
