import useSWR from 'swr';
import {fetcher} from '../../libs/api';
import {Spin, Table, Tag, Space} from 'antd';
import {EyeInvisibleTwoTone} from '@ant-design/icons';
import {toDate} from '../../libs/date';
import {PortfolioData, UiPortfolioCompany} from '../api/portfolio';
import {ApiError} from '../../components/error/ApiError';
import {objectComparator} from '../../libs/objectComparator';
import {SectorTag} from '../../components/sector/SectorTag';
import {LastUpdated} from '../../components/LastUpdated';
import {CompanyCard} from '../../components/company-card/CompanyCard';
import {CompanyActions} from '../../components/company-actions/CompanyActions';
import {DetailsLink} from '../../components/DetailsLink';
import {PortfolioOperation} from '../../components/company-actions/PortfolioOperation';
import {TickerTag} from '../../components/company/TickerTag';

const {Column} = Table;

function CompanyName({company}: { company: UiPortfolioCompany }) {
  const icons = [];
  if (company.hasMagic) {
    icons.push(<Tag key={'magic'}>Magic</Tag>);
  }
  if (company.hidden) {
    icons.push(<EyeInvisibleTwoTone twoToneColor={'red'} key={'hidden'} />);
  }

  return <Space>
    {icons}
    <DetailsLink ticker={company.ticker}>
      {company.name} x {company.sharesQty}
    </DetailsLink>
  </Space>;
}

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

  return (
    <>
      <div style={{marginBottom: 15}}>
        <PortfolioOperation callback={mutate} isBuy />
      </div>
      <Table dataSource={data.companies} rowKey={'ticker'}
             size={'small'} pagination={false}
             expandable={{
               expandedRowRender: (item) => {
                 return <CompanyCard company={item} actionsCallback={mutate} />;
               }
             }}
      >
        <Column<UiPortfolioCompany> title={'Ticker'} dataIndex={'ticker'}
                                  sorter={objectComparator('ticker')}
                                  render={(_, item) => <TickerTag company={item}/>}
        />

        <Column<UiPortfolioCompany> title={'Name'} dataIndex={'name'}
                                    sorter={objectComparator('name')}
                                    render={(_, company) =>
                                      <CompanyName company={company} />}
        />

        <Column<UiPortfolioCompany> title={'Sector'} dataIndex={'sector'}
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
                                  render={(name) => <SectorTag sector={name} />}
        />

        <Column<UiPortfolioCompany> title={'Purchased at'}
                                  dataIndex={'purchaseDate'}
                                  sorter={objectComparator('purchaseDate')}
                                  defaultSortOrder={'ascend'}
                                  render={(date) => toDate(new Date(date))}
        />

        <Column<UiPortfolioCompany> title={'Data from'} dataIndex={'lastUpdated'}
                                  sorter={objectComparator('lastUpdated')}
                                  render={(date) => <LastUpdated date={date} />}
        />

        <Column<UiPortfolioCompany> title={'Actions'} dataIndex={'Actions'}
                                  render={(_, item) =>
                                    <CompanyActions company={item}
                                                    callback={mutate} />}
        />
      </Table>
    </>
  );
}