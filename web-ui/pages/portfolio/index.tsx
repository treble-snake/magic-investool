import {Space, Table, Tag} from 'antd';
import {toDate} from '../../libs/date';
import {PortfolioData, UiPortfolioCompany} from '../api/portfolio';
import {objectComparator} from '../../libs/objectComparator';
import {SectorTag} from '../../components/sector/SectorTag';
import {LastUpdated} from '../../components/LastUpdated';
import {CompanyCard} from '../../components/company-card/CompanyCard';
import {CompanyActions} from '../../components/company-actions/CompanyActions';
import {PortfolioOperation} from '../../components/company-actions/transaction/PortfolioOperation';
import {TickerTag} from '../../components/company/TickerTag';
import moment from 'moment';
import {DisplayData} from '../../components/common/DataDisplay';
import {TableCompanyName} from '../../components/common/TableCompanyName';

const {Column} = Table;

function CompanyName({company}: { company: UiPortfolioCompany }) {
  return <TableCompanyName company={company} icons={
    company.hasMagic ? [<Tag key={'magic'}>Magic</Tag>] : []
  } />;
}

export default function Portfolio() {
  return <DisplayData<PortfolioData> apiUrl={'/api/portfolio'}>
    {({data, mutate}) => {
      return (
        <>
          <Space style={{marginBottom: 15}}>
            <PortfolioOperation onSuccess={mutate} isBuy
                                presetValues={{date: moment()}}
                                lockValues={false} />
          </Space>

          <Table dataSource={data.companies} rowKey={'ticker'}
                 size={'small'} pagination={false}
                 expandable={{
                   expandedRowRender: (item) => (
                     <CompanyCard company={item} actionsCallback={mutate} />
                   )
                 }}
          >
            <Column<UiPortfolioCompany> title={'Ticker'} dataIndex={'ticker'}
                                        sorter={objectComparator('ticker')}
                                        render={(_, item) => (
                                          <TickerTag company={item} />
                                        )}
            />

            <Column<UiPortfolioCompany> title={'Name'} dataIndex={'name'}
                                        sorter={objectComparator('name')}
                                        render={(_, company) => (
                                          <CompanyName company={company} />
                                        )}
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
                                        render={(name) => (
                                          <SectorTag sector={name} />
                                        )}
            />

            <Column<UiPortfolioCompany> title={'Purchased at'}
                                        dataIndex={'purchaseDate'}
                                        sorter={objectComparator('purchaseDate')}
                                        defaultSortOrder={'ascend'}
                                        render={(date) => toDate(new Date(date))}
            />

            <Column<UiPortfolioCompany> title={'Data from'}
                                        dataIndex={'lastUpdated'}
                                        sorter={objectComparator('lastUpdated')}
                                        render={(date) => (
                                          <LastUpdated date={date} />
                                        )}
            />

            <Column<UiPortfolioCompany> title={'Actions'} dataIndex={'Actions'}
                                        render={(_, item) => (
                                          <CompanyActions company={item}
                                                          callback={mutate} />
                                        )}
            />
          </Table>
        </>
      );
    }}
  </DisplayData>;
}