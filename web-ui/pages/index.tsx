import type {NextPage} from 'next';
import {Button, Col, Empty, Row, Space, Typography} from 'antd';
import {DashboardData} from './api/dashboard';
import {CompanyCard} from '../components/company-card/CompanyCard';
import {useState} from 'react';
import {UiCompanyStock} from './api/magic-formula';
import {UiPortfolioCompany} from './api/portfolio';
import {Hidden} from '../libs/types';
import {concat, reduce} from 'ramda';
import {DisplayData} from '../components/common/DataDisplay';
import {HiddenTickersSwitch} from '../components/common/HiddenTickersSwitch';

const Dashboard: NextPage = () => {
  const [nextMonth, setNextMonth] = useState(false);
  const [isHiddenShown, setShowHidden] = useState(false);

  return <DisplayData<DashboardData>
    apiUrl={'/api/dashboard?nextMonth=' + nextMonth}>
    {({data, mutate}) => {
      function list(items: (UiCompanyStock | UiPortfolioCompany)[]) {
        if (items.length === 0) {
          return <Empty />;
        }

        return <Row gutter={16}>
          {items.map((it) => <Col span={8} key={it.ticker}>
            <CompanyCard showActions company={it} actionsCallback={mutate} />
          </Col>)}
        </Row>;
      }

      const allItems = reduce<Hidden[], Hidden[]>(concat, [], Object.values(data?.suggestions || {}));
      const suggestions: DashboardData['suggestions'] = {
        ...data.suggestions,
        toBuy: data.suggestions.toBuy.filter(it => isHiddenShown || !it.hidden),
        toBuyMore: data.suggestions.toBuyMore.filter(it => isHiddenShown || !it.hidden),
      };

      return (
        <>
          <Space style={{marginBottom: 15, marginTop: 15}}>
            <Button size={'large'} type={nextMonth ? 'default' : 'primary'}
                    onClick={() => setNextMonth(false)}>
              This month
            </Button>
            <Button size={'large'} type={nextMonth ? 'primary' : 'dashed'}
                    onClick={() => setNextMonth(true)}>
              Next month
            </Button>
            <HiddenTickersSwitch list={allItems} state={isHiddenShown}
                                 setState={setShowHidden} />
          </Space>
          <Typography.Title level={3}>To Buy More</Typography.Title>
          <div>
            {list(suggestions.toBuyMore)}
          </div>
          <Typography.Title level={3}>To Sell</Typography.Title>
          {list(suggestions.toSell)}
          <Typography.Title level={3}>To Buy New Ones</Typography.Title>
          {list(suggestions.toBuy)}
        </>
      );
    }}
  </DisplayData>;


};

export default Dashboard;
