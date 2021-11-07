import {Badge, Table, Tag} from 'antd';
import {comparator} from 'ramda';
import {ChangelogResponse} from '../api/magic-formula/changelog';
import {toDate} from '../../libs/date';
import {ChangelogCard} from '../../components/magic-formula/ChangelogCard';
import styles from './changelog.module.css';
import {DeleteOutlined} from '@ant-design/icons';
import {ApiButton} from '../../components/common/ApiButton';
import {DisplayData} from '../../components/common/DataDisplay';

const {Column} = Table;

function renderDate(_: any, item: ChangelogResponse[0]) {
  return <Badge dot count={item.unseen ? 1 : 0}>
    <Tag color={item.unseen ? 'blue' : 'default'}>
      {toDate(item.date)}
    </Tag>
  </Badge>;
}

export default function MagicFormula() {
  return <DisplayData<ChangelogResponse>
    apiUrl={'/api/magic-formula/changelog'}>
    {({data, mutate}) => {
      return (<Table dataSource={data}
                     rowKey={'id'}
                     size={'small'}
                     pagination={false}
      >
        <Column<ChangelogResponse[0]> title={'Date'} dataIndex={'date'}
                                      className={styles.column}
                                      sorter={comparator((a, b) => a.date < b.date)}
                                      defaultSortOrder={'descend'}
                                      render={renderDate}
        />

        <Column<ChangelogResponse[0]> title={'Changes'} key={'changes'}
                                      className={styles.column}
                                      render={(_, item) => {
                                        return <ChangelogCard entry={item} />;
                                      }}
        />

        <Column<ChangelogResponse[0]> title={'Actions'} key={'Actions'}
                                      className={styles.column}
                                      render={(_, item) => <ApiButton confirm
                                                                      url={`/api/magic-formula/changelog/${item.id}`}
                                                                      method={'DELETE'}
                                                                      onSuccess={mutate}
                                                                      danger
                                                                      icon={
                                                                        <DeleteOutlined />}
                                      />}
        />

      </Table>);
    }}
  </DisplayData>;
}