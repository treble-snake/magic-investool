import {Button, Space, Table, Tag} from 'antd';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {objectComparator,} from '../../libs/objectComparator';
import {DetailsLink} from '../../components/DetailsLink';
import {HistoryData} from '../api/history';
import {HistoryRecord} from '@investool/engine/dist/portfoio/storage/HistoryStorage.types';
import {toDate} from '../../libs/date';
import React from 'react';
import {ApiButton} from '../../components/common/ApiButton';
import {PortfolioOperation} from '../../components/company-actions/transaction/PortfolioOperation';
import moment from 'moment';
import {TransactionModal} from '../../components/company-actions/transaction/TransactionModal';
import {DisplayData} from '../../components/common/DataDisplay';

const {Column} = Table;

export default function History() {
  return <DisplayData<HistoryData> apiUrl={'/api/history'}>
    {({data, mutate}) => {
      return (<>
        <Space style={{marginBottom: 15}}>
          <PortfolioOperation onSuccess={mutate} isBuy
                              presetValues={{date: moment()}}
                              lockValues={false} />
          <PortfolioOperation onSuccess={mutate}
                              presetValues={{date: moment()}}
                              lockValues={false} />
        </Space>

        <Table dataSource={data.history}
               rowKey={'id'}
               size={'small'}
               pagination={false}
        >
          <Column<HistoryRecord> title={'Date'} dataIndex={'date'}
                                 sorter={objectComparator('date')}
                                 defaultSortOrder={'ascend'}
                                 render={(date) => <Tag>{toDate(date)}</Tag>}
          />

          <Column<HistoryRecord> title={'Type'} dataIndex={'type'}
                                 sorter={objectComparator('type')}
                                 render={(type) => <Tag
                                   color={type === 'BUY' ? 'blue' : 'red'}>
                                   {type}
                                 </Tag>}
          />

          <Column<HistoryRecord> title={'Ticker'} dataIndex={'ticker'}
                                 sorter={objectComparator('ticker')}
                                 render={(name) => <Tag>{name}</Tag>}
          />

          <Column<HistoryRecord> title={'Name'} dataIndex={'name'}
                                 sorter={objectComparator('name')}
                                 render={(name, item) => <DetailsLink
                                   ticker={item.ticker}>
                                   {name}
                                 </DetailsLink>}
          />

          <Column<HistoryRecord> title={'Qty x Price'} dataIndex={'price'}
                                 sorter={objectComparator('price')}
                                 render={(value, item) => <Tag>{item.qty} x
                                   ${value}</Tag>}
          />

          <Column<HistoryRecord> title={'Actions'}
                                 render={(_, item) => <Space>
                                   <TransactionModal
                                     url={`/api/history/${item.id}`}
                                     method={'PUT'}
                                     onSuccess={mutate}
                                     title={'Edit Transaction'}
                                     presetValues={{
                                       ticker: item.ticker,
                                       qty: item.qty,
                                       price: item.price,
                                       date: moment(item.date)
                                     }}
                                     lockedValues={['ticker']}
                                   >
                                     {({onClick}: any) => (
                                       <Button icon={<EditOutlined />}
                                               onClick={onClick} />
                                     )}
                                   </TransactionModal>

                                   <ApiButton confirm
                                              url={`/api/history/${item.id}`}
                                              method={'DELETE'}
                                              onSuccess={mutate}
                                              danger
                                              icon={<DeleteOutlined />} />
                                 </Space>}
          />

        </Table>
      </>);
    }}
  </DisplayData>;
}