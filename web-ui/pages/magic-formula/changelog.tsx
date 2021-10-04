import useSWR from 'swr';
import {fetcher} from '../../libs/api';
import {Spin, Table, Tag} from 'antd';
import {comparator} from 'ramda';
import {ApiError} from '../../components/error/ApiError';
import {ChangelogData} from '../api/magic-formula/changelog';
import {ChangelogEntry} from '@investool/engine/dist/magic-formula/changelog/ChangelogStorage.types';
import {toDate} from '../../libs/date';
import {ChangelogCard} from '../../components/magic-formula/ChangelogCard';
import styles from './changelog.module.css';
import {ActionButton} from '../../components/magic-formula/ActionButton';
import {DeleteOutlined} from '@ant-design/icons';

const {Column} = Table;

export default function MagicFormula() {
  const {
    data,
    error,
    mutate
  } = useSWR<ChangelogData>('/api/magic-formula/changelog', fetcher);
  // TODO: API results code duplication
  if (error) {
    return <ApiError error={error} />;
  }

  if (!data) {
    return <Spin size={'large'} />;
  }

  return (
    <>
      {/*<div style={{marginBottom: 15}}>*/}
      {/*  <ActionButton text={'Sync MagicFormula'} url={'/api/magic-formula/sync'}*/}
      {/*                icon={<DownloadOutlined/>} callback={mutate}/>*/}
      {/*  <ActionButton text={'Update financial data'} url={'/api/magic-formula/update'}*/}
      {/*                icon={<ReloadOutlined />} callback={mutate}/>*/}
      {/*</div>*/}
      <Table dataSource={data}
             rowKey={'id'}
             size={'small'}
             pagination={false}
      >
        <Column<ChangelogEntry> title={'Date'} dataIndex={'date'}
                                className={styles.column}
                                sorter={comparator((a, b) => a.date < b.date)}
                                defaultSortOrder={'descend'}
                                render={(date) => {
                                  return <Tag>{toDate(date)}</Tag>;
                                }}
        />

        <Column<ChangelogEntry> title={'Changes'} key={'changes'}
                                className={styles.column}
                                render={(_, item) => {
                                  return <ChangelogCard entry={item}/>;
                                }}
        />


        <Column<ChangelogEntry> title={'Actions'} key={'Actions'}
                                className={styles.column}
                                render={(_, item) => <ActionButton
                                  url={`/api/magic-formula/changelog/${item.id}`}
                                  method={'DELETE'}
                                  text={'Delete'} callback={mutate}
                                  icon={<DeleteOutlined/>}
                                />}
        />

      </Table>
    </>
  );
}