import {Space, Table, Tag} from 'antd';
import {comparator} from 'ramda';
import {MagicData, UiCompanyStock} from '../api/magic-formula';
import {
  CheckCircleTwoTone,
  DownloadOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import {objectComparator} from '../../libs/objectComparator';
import {SectorTag} from '../../components/sector/SectorTag';
import {LastUpdated} from '../../components/company/data-age/LastUpdated';
import {CompanyCard} from '../../components/company-card/CompanyCard';
import {CompanyActions} from '../../components/company-actions/CompanyActions';
import {TickerTag} from '../../components/company/TickerTag';
import {ApiButton} from '../../components/common/ApiButton';
import {DisplayData} from '../../components/common/DataDisplay';
import {useState} from 'react';
import {HiddenTickersSwitch} from '../../components/common/HiddenTickersSwitch';
import {TableCompanyName} from '../../components/common/TableCompanyName';

const {Column} = Table;

function CompanyName({company}: { company: UiCompanyStock }) {
  const icons = [];
  if (company.owned) {
    icons.push(<CheckCircleTwoTone twoToneColor={'#52c41a'} key={'owned'} />);
  }
  return <TableCompanyName company={company} icons={icons}/>;
}

export default function MagicFormula() {
  const [isHiddenShown, setShowHidden] = useState(false);

  return <DisplayData<MagicData> apiUrl={'/api/magic-formula'}>
    {({data, mutate}) => {
      return (
        <>
          <Space style={{marginBottom: 15}}>
            <ApiButton url={'/api/magic-formula/sync'} onSuccess={mutate}
                       text={'Sync MagicFormula'} icon={<DownloadOutlined />} />
            <ApiButton url={'/api/magic-formula/update'} onSuccess={mutate}
                       text={'Update financial data'}
                       icon={<ReloadOutlined />} />
            <HiddenTickersSwitch list={data.magic} state={isHiddenShown}
                                 setState={setShowHidden} />
          </Space>

          <Table
            dataSource={data.magic.filter(it => isHiddenShown || !it.hidden)}
            rowKey={'ticker'}
            size={'small'}
            pagination={false}
            expandable={{
              expandedRowRender: (item) => (
                <CompanyCard company={item} actionsCallback={mutate} />
              )
            }}
          >
            <Column<UiCompanyStock> title={'Rank'} key={'rank'}
                                    sorter={comparator((a, b) => a.rank.total < b.rank.total)}
                                    defaultSortOrder={'ascend'}
                                    render={(_, item) => (
                                      <Tag>{item.rank.total}</Tag>
                                    )}
            />

            <Column<UiCompanyStock> title={'Ticker'} dataIndex={'ticker'}
                                    sorter={objectComparator('ticker')}
                                    render={(_, item) => (
                                      <TickerTag company={item} />
                                    )}
            />

            <Column<UiCompanyStock> title={'Name'} dataIndex={'name'}
                                    sorter={objectComparator('name')}
                                    render={(_, item) => (
                                      <CompanyName company={item} />
                                    )}
            />

            <Column<UiCompanyStock> title={'Sector'} dataIndex={'sector'}
                                    sorter={objectComparator('sector')}
                                    render={(name) => (
                                      <SectorTag sector={name} />
                                    )}
            />

            <Column<UiCompanyStock> title={'Data from'}
                                    dataIndex={'lastUpdated'}
                                    sorter={objectComparator('lastUpdated')}
                                    render={(date) => (
                                      <LastUpdated date={date} />
                                    )}
            />

            <Column<UiCompanyStock> title={'Actions'} dataIndex={'Actions'}
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