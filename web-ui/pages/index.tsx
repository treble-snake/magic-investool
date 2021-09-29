import type {NextPage} from 'next';
import useSWR from 'swr';
import {fetcher} from '../libs/api';
import {ApiError} from '../components/error/ApiError';
import {Col, Empty, Row, Spin, Typography} from 'antd';
import {SuggestionData} from './api/suggestion';
// TODO: not perfect
import {CompanyStock} from '@investool/engine/dist/types';
import {CompanyCard} from '../components/company-card/CompanyCard';

const Home: NextPage = () => {
  const {
    data,
    error,
    mutate
  } = useSWR<SuggestionData>('/api/suggestion', fetcher);
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
        <CompanyCard company={it} actionsCallback={mutate} />
      </Col>)}
    </Row>;
  }

  return (
    <>
      <Typography.Title>Up this month</Typography.Title>
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
