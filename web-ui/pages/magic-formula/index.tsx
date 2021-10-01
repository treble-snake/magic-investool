import useSWR from 'swr';
import {fetcher} from '../../libs/api';
import {Button, Spin, Table, Tag} from 'antd';
import {comparator} from 'ramda';
import {MagicCompany, MagicData} from '../api/magic-formula';
import {ApiError} from '../../components/error/ApiError';
import {
  CheckCircleTwoTone,
  DownloadOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import {objectComparator} from '../../libs/objectComparator';
import {SectorTag} from '../../components/sector/SectorTag';
import {LastUpdated} from '../../components/LastUpdated';
import {CompanyCard} from '../../components/company-card/CompanyCard';
import {CompanyActions} from '../../components/company-actions/CompanyActions';
import {DetailsLink} from '../../components/DetailsLink';
import {PortfolioOperation} from '../../components/company-actions/PortfolioOperation';
import {ActionButton} from '../../components/magic-formula/ActionButton';

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

  if (!data) {
    return <Spin size={'large'} />;
  }

  return (
    <>
      <div style={{marginBottom: 15}}>
        <ActionButton text={'Sync MagicFormula'} url={'/api/magic-formula/sync'}
                      icon={<DownloadOutlined/>} callback={mutate}/>
        <ActionButton text={'Update financial data'} url={'/api/magic-formula/update'}
                      icon={<ReloadOutlined />} callback={mutate}/>
      </div>
      <Table dataSource={data.magic}
             rowKey={'ticker'}
             size={'small'}
             pagination={false}
             expandable={{
               expandedRowRender: (item) => {
                 return <CompanyCard company={item} actionsCallback={mutate} />;
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
                              sorter={objectComparator('ticker')}
                              render={(name, item) => {
                                return <Tag
                                  color={item.owned ? 'default' : 'blue'}>{name}</Tag>;
                              }}
        />

        <Column<MagicCompany> title={'Name'} dataIndex={'name'}
                              sorter={objectComparator('name')}
                              render={(name, item) => {
                                return <>
                                  {
                                    item.owned ?
                                      <CheckCircleTwoTone
                                        twoToneColor={'#52c41a'}
                                        style={{paddingRight: 7}} />
                                      : null
                                  }
                                  <DetailsLink ticker={item.ticker}>
                                    {name}
                                  </DetailsLink>
                                </>;
                              }}
        />

        <Column<MagicCompany> title={'Sector'} dataIndex={'sector'}
                              sorter={objectComparator('sector')}
                              render={(name) => <SectorTag sector={name} />}
        />

        <Column<MagicCompany> title={'Data from'} dataIndex={'lastUpdated'}
                              sorter={objectComparator('lastUpdated')}
                              render={(date) => <LastUpdated date={date} />}
        />

        <Column<MagicCompany> title={'Actions'} dataIndex={'Actions'}
                              render={(_, item) =>
                                <CompanyActions company={item}
                                                callback={mutate} />}
        />

      </Table>
    </>
  );
}