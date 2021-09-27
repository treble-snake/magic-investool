import styles from './wrapper.module.css';
import Head from 'next/head';
import Link from 'next/link';
import {Layout, Menu} from 'antd';
import {useRouter} from 'next/router';

export const Wrapper = ({children}: any) => {
  const router = useRouter();

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
            <Link href={'/'}>Home</Link>
          </Menu.Item>
          <Menu.Item key="/portfolio">
            <Link href={'/portfolio'}>Portfolio</Link>
          </Menu.Item>
          <Menu.Item key="/magic-formula">
            <Link href={'/magic-formula'}>Magic Formula</Link>
          </Menu.Item>
          <Menu.Item key="/history">
            <Link href={'/history'}>History</Link>
          </Menu.Item>
        </Menu>
      </Layout.Header>
      <Layout.Content className={styles.content}>
        {children}
      </Layout.Content>
    </Layout>
  </div>;
};