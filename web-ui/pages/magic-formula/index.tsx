import useSWR from 'swr';
import {fetcher} from '../../libs/api';
import {Button, Space, Spin, Table, Tag} from 'antd';
import {comparator} from 'ramda';
import {UiCompanyStock, MagicData} from '../api/magic-formula';
import {ApiError} from '../../components/error/ApiError';
import {
  CheckCircleTwoTone,
  DownloadOutlined,
  ReloadOutlined,
  EyeInvisibleTwoTone,
  EyeInvisibleOutlined,
  EyeOutlined
} from '@ant-design/icons';
import {objectComparator} from '../../libs/objectComparator';
import {SectorTag} from '../../components/sector/SectorTag';
import {LastUpdated} from '../../components/LastUpdated';
import {CompanyCard} from '../../components/company-card/CompanyCard';
import {CompanyActions} from '../../components/company-actions/CompanyActions';
import {DetailsLink} from '../../components/DetailsLink';
import {ActionButton} from '../../components/magic-formula/ActionButton';
import {useState} from 'react';
import {TickerTag} from '../../components/company/TickerTag';

const {Column} = Table;

// function Ticker({company}: { company: UiCompanyStock }) {
//   const color = company.owned ? 'default' : (
//     company.hidden ? 'red' : 'blue'
//   );
//
//   return <Tag color={color}>{company.ticker}</Tag>;
// }

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
  const [isHiddenShown, setShowHidden] = useState(false);

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

  const hiddenQty = data.magic.filter(it => it.hidden).length;
  return (
    <>
      <Space style={{marginBottom: 15}}>
        <ActionButton text={'Sync MagicFormula'} url={'/api/magic-formula/sync'}
                      icon={<DownloadOutlined />} callback={mutate} />
        <ActionButton text={'Update financial data'}
                      url={'/api/magic-formula/update'}
                      icon={<ReloadOutlined />} callback={mutate} />
        {
          hiddenQty > 0 ?
            <Button onClick={() => setShowHidden(!isHiddenShown)}
                    icon={isHiddenShown ? <EyeInvisibleOutlined /> :
                      <EyeOutlined />}>
              {isHiddenShown ? 'Hide' : 'Show'} {hiddenQty} hidden tickers
            </Button>
            : null
        }

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
                                render={(_, item) => <Tag>{item.rank.total}</Tag>}
        />

        <Column<UiCompanyStock> title={'Ticker'} dataIndex={'ticker'}
                                sorter={objectComparator('ticker')}
                                render={(_, item) => <TickerTag company={item} />}
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