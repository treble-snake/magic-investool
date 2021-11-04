import styles from './wrapper.module.css';
import Head from 'next/head';
import Link from 'next/link';
import {Badge, Layout, Menu} from 'antd';
import {useRouter} from 'next/router';
import useSWR from 'swr';
import {ChangelogItem} from '../../pages/api/magic-formula/changelog';
import {fetcher} from '../../libs/api';

export const Wrapper = ({children}: any) => {
  const router = useRouter();
  const {data: unseen} =
    useSWR<ChangelogItem[]>('/api/magic-formula/changelog/unseen', fetcher);

  return <div className={styles.main}>
    <Head>
      <title>Magic InvesTool</title>
      <meta name="description" content="Not an investment advice" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Layout>
      <Layout.Header>
        <Menu theme="dark" mode="horizontal" selectedKeys={[router.asPath]}>
          <Menu.Item key="/">
            <Link href={'/'}>Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="/portfolio">
            <Link href={'/portfolio'}>Portfolio</Link>
          </Menu.Item>
          <Menu.Item key="/magic-formula">
            <Link href={'/magic-formula'}>Magic Formula</Link>
          </Menu.Item>
          <Menu.Item key="/magic-formula/changelog">
            <Link href={'/magic-formula/changelog'}>
              MF Changelog
            </Link>
            <Badge dot count={unseen?.length || 0}>
              <span style={{color: 'transparent'}}>.</span>
            </Badge>
          </Menu.Item>
          <Menu.Item key="/history">
            <Link href={'/history'}>History</Link>
          </Menu.Item>
          <Menu.Item key="/settings">
            <Link href={'/settings'}>Settings</Link>
          </Menu.Item>
        </Menu>
      </Layout.Header>
      <Layout.Content className={styles.content}>
        {children}
      </Layout.Content>
    </Layout>
  </div>;
};