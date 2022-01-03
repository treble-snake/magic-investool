import {Space, Table, Tag, Tooltip} from 'antd';
import {toDate} from '../../libs/date';
import {PortfolioData, UiPortfolioCompany} from '../api/portfolio';
import {objectComparator} from '../../libs/objectComparator';
import {SectorTag} from '../../components/sector/SectorTag';
import {LastUpdated} from '../../components/LastUpdated';
import {CompanyCard} from '../../components/company-card/CompanyCard';
import {CompanyActions} from '../../components/company-actions/CompanyActions';
import {
  PortfolioOperation
} from '../../components/company-actions/transaction/PortfolioOperation';
import {TickerTag} from '../../components/company/TickerTag';
import moment from 'moment';
import {DisplayData} from '../../components/common/DataDisplay';
import {TableCompanyName} from '../../components/common/TableCompanyName';
import {ApiButton} from '../../components/common/ApiButton';
import React from 'react';
import {QuestionCircleOutlined, ReloadOutlined} from '@ant-design/icons';
import {ProfitLossTag} from '../../components/company/ProfitLossTag';
import {getTotalPL} from '../../libs/utils/getTotalPL';
import {formatMoney} from '../../libs/utils/formatMoney';

const {Column} = Table;

function plComparator(a: UiPortfolioCompany, b: UiPortfolioCompany) {
  if (!a.price || !a.breakEvenPrice) {
    return -1;
  }

  if (!b.price || !b.breakEvenPrice) {
    return 1;
  }

  return a.price / a.breakEvenPrice > b.price / b.breakEvenPrice ? 1 : -1;
}

function CompanyName({company}: { company: UiPortfolioCompany }) {
  return <TableCompanyName company={company} icons={
    company.hasMagic ? [<Tag key={'magic'}>Magic</Tag>] : []
  } />;
}

export default function Portfolio() {
  return <DisplayData<PortfolioData> apiUrl={'/api/portfolio'}>
    {({data, mutate}) => {
      const {plSum, hasMissingValues} = getTotalPL(data.companies);
      return (
        <>
          <Space style={{marginBottom: 15}}>
            <PortfolioOperation onSuccess={mutate} isBuy
                                presetValues={{date: moment()}}
                                lockValues={false} />
            <ApiButton url={'/api/portfolio/update'} onSuccess={mutate}
                       text={'Update financial data'}
                       icon={<ReloadOutlined />} />

            <Tooltip title={hasMissingValues ?
            'This value is incomplete, some items are missing pricing data' :
            'This is an approximate vlaue, don\'t tale it too seriously'}>
              <Tag
                color={hasMissingValues ? 'default' : (plSum > 0 ? 'green' : 'red')}>
                {'Total Unrealised P/L: '}
                {plSum > 0 ? '+' : '-'}
                {'$'}
                {formatMoney(Math.abs(plSum))}
                {' '}
                <QuestionCircleOutlined />
              </Tag>
            </Tooltip>

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

            <Column<UiPortfolioCompany> title={'P/L'} dataIndex={'ProfitLoss'}
                                        sorter={plComparator}
                                        render={(_, item) => (
                                          <ProfitLossTag company={item} />)}
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