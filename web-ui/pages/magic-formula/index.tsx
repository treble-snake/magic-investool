import useSWR from 'swr';
import {fetcher} from '../../libs/api';
import {Button, Spin, Table, Tag, Tooltip} from 'antd';
import {formatDistanceToNow} from 'date-fns';
import {comparator, prop, sum} from 'ramda';
import {MagicCompany, MagicData} from '../api/magic-formula';
import {ApiError} from '../../components/error/ApiError';
import {CheckCircleTwoTone, ReloadOutlined} from '@ant-design/icons';
import {companyComparator} from '../../libs/companyComparator';
import {SectorTag} from '../../components/sector/SectorTag';
import {LastUpdated} from '../../components/LastUpdated';
import {CompanyCard} from '../../components/company-card/CompanyCard';

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

  return (
    <>
      <Table dataSource={data.magic}
             rowKey={'ticker'}
             size={'small'}
             pagination={false}
             expandable={{
               expandedRowRender: (item) => {
                 return <CompanyCard company={item} mutate={() =>{}}/>
               }
             }}
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
                              render={(name) => <SectorTag sector={name} />}
        />

        <Column<MagicCompany> title={'Data from'} dataIndex={'lastUpdated'}
                              sorter={companyComparator('lastUpdated')}
                              render={(date) => <LastUpdated date={date} />}
        />

        <Column<MagicCompany> title={'Actions'} dataIndex={'Actions'}
                              render={(_, item) => {
                                return <>
                                  <Tooltip title={'Refresh data'}>
                                    <Button type={'primary'}
                                            icon={<ReloadOutlined />}
                                            onClick={() => {
                                              mutate({
                                                magic: data.magic.splice(0, 1)
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