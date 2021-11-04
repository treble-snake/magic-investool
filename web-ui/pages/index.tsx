import type {NextPage} from 'next';
import useSWR from 'swr';
import {fetcher} from '../libs/api';
import {ApiError} from '../components/error/ApiError';
import {Button, Col, Empty, Row, Space, Spin, Typography} from 'antd';
import {EyeInvisibleOutlined, EyeOutlined} from '@ant-design/icons';
import {DashboardData} from './api/dashboard';
import {CompanyCard} from '../components/company-card/CompanyCard';
import {useState} from 'react';
import {UiCompanyStock} from './api/magic-formula';
import {UiPortfolioCompany} from './api/portfolio';

const Home: NextPage = () => {
  const [nextMonth, setNextMonth] = useState(false);
  const [isHiddenShown, setShowHidden] = useState(false);

  const {
    data,
    error,
    mutate
  } = useSWR<DashboardData>('/api/dashboard?nextMonth=' + nextMonth, fetcher);
  if (error) {
    return <ApiError error={error} />;
  }

  if (!data) {
    return <Spin size={'large'} />;
  }

  function list(items: (UiCompanyStock | UiPortfolioCompany)[]) {
    if (items.length === 0) {
      return <Empty />;
    }

    return <Row gutter={16}>
      {items.map((it) => <Col span={8} key={it.ticker}>
        <CompanyCard showHeader company={it} actionsCallback={mutate} />
      </Col>)}
    </Row>;
  }

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
        <Button onClick={() => setShowHidden(!isHiddenShown)}
                icon={isHiddenShown ? <EyeInvisibleOutlined /> :
                  <EyeOutlined />}>
          {isHiddenShown ? 'Hide' : 'Show'} hidden tickers
        </Button>
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
};

export default Home;
