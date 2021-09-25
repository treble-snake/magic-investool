import styles from './layout.module.css';
import Head from 'next/head';
import Link from 'next/link';
import {Layout, Menu} from 'antd';

export const Wrapper = ({children}: any) => {
  return <div className={styles.main}>
    <Head>
      <title>Magic InvesTool</title>
      <meta name="description" content="Not an investment advice" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Layout>
      <Layout.Header>
        <Menu theme="dark" mode="horizontal">
          <Menu.Item key="1">
            <Link href={'/'}>Home</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link href={'/portfolio'}>Portfolio</Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link href={'/magic-formula'}>Magic Formula</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link href={'/history'}>History</Link>
          </Menu.Item>
        </Menu>
      </Layout.Header>
      <Layout.Content>
        {children}
      </Layout.Content>
    </Layout>
  </div>;
};