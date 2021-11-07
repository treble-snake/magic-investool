import useSWR from 'swr';
import {fetcher} from '../../libs/api';
import {Space, Spin, Table, Tag} from 'antd';
import {comparator} from 'ramda';
import {MagicData, UiCompanyStock} from '../api/magic-formula';
import {ApiError} from '../../components/error/ApiError';
import {
  CheckCircleTwoTone,
  DownloadOutlined,
  EyeInvisibleTwoTone,
  ReloadOutlined
} from '@ant-design/icons';
import {objectComparator} from '../../libs/objectComparator';
import {SectorTag} from '../../components/sector/SectorTag';
import {LastUpdated} from '../../components/LastUpdated';
import {CompanyCard} from '../../components/company-card/CompanyCard';
import {CompanyActions} from '../../components/company-actions/CompanyActions';
import {DetailsLink} from '../../components/DetailsLink';
import {TickerTag} from '../../components/company/TickerTag';
import {useHiddenSwitch} from '../../components/common/useHiddenSwitch';
import {ApiButton} from '../../components/common/ApiButton';

const {Column} = Table;

// TODO: duplicate code with Portfolio
function CompanyName({company}: { company: UiCompanyStock }) {
  const icons = [];
  if (company.owned) {
    icons.push(<CheckCircleTwoTone twoToneColor={'#52c41a'} key={'owned'} />);
  }
  if (company.hidden) {
    icons.push(<EyeInvisibleTwoTone twoToneColor={'red'} key={'hidden'} />);
  }

  return <Space>
    {icons}
    <DetailsLink ticker={company.ticker}>
      {company.name}
    </DetailsLink>
  </Space>;
}

export default function MagicFormula() {
  const {
    data,
    error,
    mutate
  } = useSWR<MagicData>('/api/magic-formula', fetcher);

  const {isHiddenShown, HiddenSwitch} = useHiddenSwitch(data?.magic || []);

  // TODO: API results code duplication
  if (error) {
    return <ApiError error={error} />;
  }

  if (!data) {
    return <Spin size={'large'} />;
  }

  return (
    <>
      <Space style={{marginBottom: 15}}>
        <ApiButton url={'/api/magic-formula/sync'} onSuccess={mutate}
                   text={'Sync MagicFormula'} icon={<DownloadOutlined />}/>
        <ApiButton url={'/api/magic-formula/update'} onSuccess={mutate}
                   text={'Update financial data'} icon={<ReloadOutlined />}/>
        {HiddenSwitch}
      </Space>

      <Table
        dataSource={data.magic.filter(it => isHiddenShown || !it.hidden)}
        rowKey={'ticker'}
        size={'small'}
        pagination={false}
        expandable={{
          expandedRowRender: (item) => {
            return <CompanyCard company={item} actionsCallback={mutate} />;
          }
        }}
      >
        <Column<UiCompanyStock> title={'Rank'} key={'rank'}
                                sorter={comparator((a, b) => a.rank.total < b.rank.total)}
                                defaultSortOrder={'ascend'}
                                render={(_, item) =>
                                  <Tag>{item.rank.total}</Tag>}
        />

        <Column<UiCompanyStock> title={'Ticker'} dataIndex={'ticker'}
                                sorter={objectComparator('ticker')}
                                render={(_, item) => <TickerTag
                                  company={item} />}
        />

        <Column<UiCompanyStock> title={'Name'} dataIndex={'name'}
                                sorter={objectComparator('name')}
                                render={(_, item) =>
                                  <CompanyName company={item} />}
        />

        <Column<UiCompanyStock> title={'Sector'} dataIndex={'sector'}
                                sorter={objectComparator('sector')}
                                render={(name) => <SectorTag sector={name} />}
        />

        <Column<UiCompanyStock> title={'Data from'} dataIndex={'lastUpdated'}
                                sorter={objectComparator('lastUpdated')}
                                render={(date) => <LastUpdated date={date} />}
        />

        <Column<UiCompanyStock> title={'Actions'} dataIndex={'Actions'}
                                render={(_, item) =>
                                  <CompanyActions company={item}
                                                  callback={mutate} />}
        />

      </Table>
    </>
  );
}