import type {NextPage} from 'next';
import Link from 'next/link';
import {Wrapper} from '../components/Wrapper';

const Home: NextPage = () => {
  return (
    <Wrapper>
          Let's go to:<br/>
          <Link href={'/history'}><a>history</a></Link><br/>
          <Link href={'/portfolio'}><a>portfolio</a></Link>
    </Wrapper>
  )
}

export default Home
