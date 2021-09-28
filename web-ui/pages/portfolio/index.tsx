import useSWR from 'swr';
import {fetcher} from '../../libs/api';
import {Button, Spin, Table, Tag, Tooltip} from 'antd';
import {PortfolioCompany} from '@investool/engine';
import {toDate} from '../../libs/date';
import {formatDistanceToNow} from 'date-fns';
import {PortfolioData} from '../api/portfolio';
import {ApiError} from '../../components/error/ApiError';
import {companyComparator} from '../../libs/companyComparator';
import {ReloadOutlined} from '@ant-design/icons';
import {SectorTag} from '../../components/sector/SectorTag';
import {LastUpdated} from '../../components/LastUpdated';
import {CompanyCard} from '../../components/company-card/CompanyCard';

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

  // TODO: mark items in MgF list

  return (
    <>
      <Table dataSource={data.companies} rowKey={'ticker'}
             size={'small'} pagination={false}
             expandable={{
               expandedRowRender: (item) => {
                 return <CompanyCard company={item} mutate={() =>{}}/>
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
                                  render={(name) => <SectorTag sector={name}/>}
        />

        <Column<PortfolioCompany> title={'Purchased at'}
                                  dataIndex={'purchaseDate'}
                                  sorter={companyComparator('purchaseDate')}
                                  defaultSortOrder={'ascend'}
                                  render={(date) => toDate(new Date(date))}
        />

        <Column<PortfolioCompany> title={'Data from'} dataIndex={'lastUpdated'}
                                  sorter={companyComparator('lastUpdated')}
                                  render={(date) => <LastUpdated date={date} />}
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