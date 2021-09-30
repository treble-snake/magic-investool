import useSWR from 'swr';
import {fetcher} from '../../libs/api';
import {Spin, Table, Tag} from 'antd';
import {ApiError} from '../../components/error/ApiError';
import {objectComparator,} from '../../libs/objectComparator';
import {LastUpdated} from '../../components/LastUpdated';
import {DetailsLink} from '../../components/DetailsLink';
import {HistoryData} from '../api/history';
import {HistoryRecord} from '@investool/engine/dist/portfoio/storage/HistoryStorage.types';
import {toDate} from '../../libs/date';

const {Column} = Table;

export default function History() {
  const {
    data,
    error,
    mutate
  } = useSWR<HistoryData>('/api/history', fetcher);
  // TODO: API results code duplication
  if (error) {
    return <ApiError error={error} />;
  }

  if (!data) {
    return <Spin size={'large'} />;
  }

  return (
    <>
      <Table dataSource={data.history}
        // rowKey={'ticker'}
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
                               render={(value, item) => <Tag>{item.qty} x ${value}</Tag>}
        />

      </Table>
    </>
  );
}