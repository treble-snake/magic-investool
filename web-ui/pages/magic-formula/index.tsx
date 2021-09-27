import useSWR from 'swr';
import {fetcher} from '../../libs/api';
import {Button, Spin, Table, Tag, Tooltip} from 'antd';
import {formatDistanceToNow} from 'date-fns';
import {comparator, prop, sum} from 'ramda';
import {MagicCompany, MagicData} from '../api/magic-formula';
import {ApiError} from '../../components/error/ApiError';
import {CheckCircleTwoTone, ReloadOutlined} from '@ant-design/icons';
import {companyComparator} from '../../libs/companyComparator';

const {Column} = Table;

export default function MagicFormula() {
  const {
    data,
    error,
    mutate
  } = useSWR<MagicData>('/api/magic-formula', fetcher);
  // TODO: API results code duplication
  if (error) {
    return <ApiError error={error} />;
  }

  console.warn('res', data);
  if (!data) {
    return <Spin size={'large'} />;
  }

  const maxSector = Math.max(...data.sectors.map(prop('qty')));
  const avgSector = sum(data.sectors.map(prop('qty'))) / data.sectors.length;

  return (
    <>
      <Table dataSource={data.magic}
             rowKey={'ticker'}
             size={'small'}
             pagination={false}
      >
        <Column<MagicCompany> title={'Rank'} key={'rank'}
                              sorter={comparator((a, b) => a.rank.total < b.rank.total)}
                              defaultSortOrder={'ascend'}
                              render={(_, item) => {
                                return <Tag>{item.rank.total}</Tag>;
                              }}
        />

        <Column<MagicCompany> title={'Ticker'} dataIndex={'ticker'}
                              sorter={companyComparator('ticker')}
                              render={(name, item) => {
                                return <Tag
                                  color={item.owned ? 'default' : 'blue'}>{name}</Tag>;
                              }}
        />

        <Column<MagicCompany> title={'Name'} dataIndex={'name'}
                              sorter={companyComparator('name')}
                              render={(name, item) => {
                                return <>
                                  {
                                    item.owned ?
                                      <CheckCircleTwoTone
                                        twoToneColor={'#52c41a'}
                                        style={{paddingRight: 7}} />
                                      : null
                                  }
                                  {name}
                                </>;
                              }}
        />

        <Column<MagicCompany> title={'Sector'} dataIndex={'sector'}
                              sorter={companyComparator('sector')}
                              render={(name) => {
                                const sector = data.sectors.find(it => it.name === name);
                                const value = sector?.qty || 0;
                                const color = value === maxSector ? 'gold' :
                                  (value >= avgSector ? 'yellow' : 'green');
                                return <Tag
                                  color={value === 0 ? 'blue' : color}>{name} x{value}</Tag>;
                              }}
        />

        <Column<MagicCompany> title={'Data from'} dataIndex={'lastUpdated'}
                              sorter={companyComparator('lastUpdated')}
                              render={(date) => formatDistanceToNow(new Date(date), {
                                includeSeconds: false,
                                addSuffix: true
                              })}
        />

        <Column<MagicCompany> title={'Actions'} dataIndex={'Actions'}
                              render={(_, item) => {
                                return <>
                                  <Tooltip title={'Refresh data'}>
                                    <Button type={'primary'}
                                            icon={<ReloadOutlined />}
                                            onClick={() => {
                                              mutate({
                                                magic: data.magic.splice(0, 1),
                                                sectors: data.sectors
                                              });
                                            }}

                                    />
                                  </Tooltip>
                                </>;
                              }}
        />

      </Table>
    </>
  );
}