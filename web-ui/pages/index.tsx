import type {NextPage} from 'next';
import useSWR from 'swr';
import {PortfolioData} from './api/portfolio';
import {fetcher} from '../libs/api';
import {ApiError} from '../components/error/ApiError';
import {Spin} from 'antd';
import {SuggestionData} from './api/suggestion';
import {CompanyStock} from '@investool/engine';

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

  function list(c: CompanyStock[]) {
    if (c.length === 0) {
      return <p>Nothing</p>;
    }

    return <ul>
      {c.map(it => <li key={it.ticker}>{it.name}</li>)}
    </ul>;
  }

  return (
    <>
      <p>To Buy More:</p>
      {list(data.suggestion.toBuyMore)}
      <p>To Sell:</p>
      {list(data.suggestion.toSell)}
      <p>To Buy New Ones:</p>
      {list(data.suggestion.toBuy)}
    </>
  );
};

export default Home;
