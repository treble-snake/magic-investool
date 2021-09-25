import useSWR from 'swr'
import Link from 'next/link';
import {Wrapper} from '../../components/Wrapper';
import {fetcher} from '../../libs/api';

export default function History() {
  const {data, error} = useSWR('/api/sectors', fetcher);
  if (error) {
    console.error(error);
  }
  return (
    <Wrapper>
      <h1>Sectors</h1>
      <h2>
        <Link href="/">
          <a>Back to home</a>
        </Link>
      </h2>
      <p>
        {error && 'failed to load'}
        {
          JSON.stringify(data || error, null, 2)
        }
      </p>
    </Wrapper>
  );
}