import useSWR from 'swr';
import {fetcher} from '../../libs/api';
import {Button, Spin, Table, Tag, Tooltip} from 'antd';
import {PortfolioCompany} from '@investool/engine';
import {toDate} from '../../libs/date';
import {formatDistanceToNow} from 'date-fns';
import {PortfolioData} from '../api/portfolio';
import {prop, sum} from 'ramda';
import {ApiError} from '../../components/error/ApiError';
import {companyComparator} from '../../libs/companyComparator';
import {ReloadOutlined} from '@ant-design/icons';

const {Column} = Table;

export default function Portfolio() {
  const {
    data,
    error,
    mutate
  } = useSWR<PortfolioData>('/api/portfolio', fetcher);
  if (error) {
    return <ApiError error={error} />;
  }

  if (!data) {
    return <Spin size={'large'} />;
  }

  const maxSector = Math.max(...data.sectors.map(prop('qty')));
  const avgSector = sum(data.sectors.map(prop('qty'))) / data.sectors.length;

  // TODO: mark items in MgF list

  return (
    <>
      <Table dataSource={data.companies} rowKey={'ticker'}
             size={'small'} pagination={false}
             expandable={{
               expandedRowRender: (item) => {
                 return <Tag>Details will be here</Tag>
               }
             }}
      >
        <Column<PortfolioCompany> title={'Ticker'} dataIndex={'ticker'}
                                  sorter={companyComparator('ticker')}
                                  render={(name) => <Tag>{name}</Tag>}
        />

        <Column<PortfolioCompany> title={'Name'} dataIndex={'name'}
                                  sorter={companyComparator('name')}
                                  render={(name, company) => `${name} x ${company.sharesQty}`}
        />

        <Column<PortfolioCompany> title={'Sector'} dataIndex={'sector'}
                                  sorter={(a, b) => {
                                    if (a.sector === b.sector) {
                                      return 0;
                                    }
                                    const sectorA = data.sectors.find(it => it.name === a.sector)!;
                                    const sectorB = data.sectors.find(it => it.name === b.sector)!;
                                    if (sectorA.qty === sectorB.qty) {
                                      return sectorA.name > sectorB.name ? 1 : -1;
                                    }

                                    return sectorA.qty - sectorB.qty;
                                  }}
                                  render={(name) => {
                                    const sector = data.sectors.find(it => it.name === name);
                                    const value = sector?.qty || 0;
                                    const color = value === maxSector ? 'gold' :
                                      (value >= avgSector ? 'yellow' : 'green');
                                    return <Tag
                                      color={color}>{name} x{value}</Tag>;
                                  }}
        />

        <Column<PortfolioCompany> title={'Purchased at'}
                                  dataIndex={'purchaseDate'}
                                  sorter={companyComparator('purchaseDate')}
                                  defaultSortOrder={'ascend'}
                                  render={(date) => toDate(new Date(date))}
        />

        <Column<PortfolioCompany> title={'Data from'} dataIndex={'lastUpdated'}
                                  sorter={companyComparator('lastUpdated')}
                                  render={(date) => formatDistanceToNow(new Date(date), {
                                    includeSeconds: false,
                                    addSuffix: true
                                  })}
        />

        <Column<PortfolioCompany> title={'Actions'} dataIndex={'Actions'}
                                  render={(_, item) => {
                                    return <>
                                      <Tooltip title={'Refresh data'}>
                                        <Button type={'primary'}
                                                icon={<ReloadOutlined />}
                                                onClick={() => {
                                                  mutate();
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