import type {NextPage} from 'next';
import useSWR from 'swr';
import {fetcher} from '../libs/api';
import {ApiError} from '../components/error/ApiError';
import {Button, Col, Empty, Row, Space, Spin, Typography} from 'antd';
import {SuggestionData} from './api/suggestion';
// TODO: importing from dist/ folder is not cool
import {CompanyStock} from '@investool/engine/dist/types';
import {CompanyCard} from '../components/company-card/CompanyCard';
import {useState} from 'react';

const Home: NextPage = () => {
  const [nextMonth, setNextMonth] = useState(false);
  const {
    data,
    error,
    mutate
  } = useSWR<SuggestionData>('/api/suggestion?nextMonth=' + nextMonth, fetcher);
  if (error) {
    return <ApiError error={error} />;
  }

  if (!data) {
    return <Spin size={'large'} />;
  }

  function list(items: CompanyStock[]) {
    if (items.length === 0) {
      return <Empty />;
    }

    return <Row gutter={16}>
      {items.map((it) => <Col span={8} key={it.ticker}>
        <CompanyCard showHeader company={it} actionsCallback={mutate} />
      </Col>)}
    </Row>;
  }

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
      </Space>
      <Typography.Title level={2}>To Buy More</Typography.Title>
      <div>
        {list(data.suggestion.toBuyMore)}
      </div>
      <Typography.Title level={2}>To Sell</Typography.Title>
      {list(data.suggestion.toSell)}
      <Typography.Title level={2}>To Buy New Ones</Typography.Title>
      {list(data.suggestion.toBuy)}
    </>
  );
};

export default Home;
