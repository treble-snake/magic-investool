import styles from './wrapper.module.css';
import Head from 'next/head';
import Link from 'next/link';
import {Badge, Layout, Menu} from 'antd';
import {useRouter} from 'next/router';
import useSWR from 'swr';
import {ChangelogItem} from '../../pages/api/magic-formula/changelog';
import {fetcher} from '../../libs/api';
import {PortfolioData} from '../../pages/api/portfolio';
import {getTotalPL} from '../../libs/utils/getTotalPL';
import React from 'react';
import {CaretDownOutlined, CaretUpOutlined} from '@ant-design/icons';

const getProfitLossIcon = (data?: PortfolioData) => {
  if (!data?.companies || data.companies.length === 0) {
    return null;
  }

  const {plSum, hasMissingValues} = getTotalPL(data.companies);
  if (hasMissingValues) {
    return null;
  }

  return plSum > 0 ?
    <CaretUpOutlined style={{color: '#52c41a'}} /> :
    <CaretDownOutlined style={{color: 'red'}} />;
};

export const MainLayout = ({children}: any) => {
  const router = useRouter();
  const {data: unseen} =
    useSWR<ChangelogItem[]>('/api/magic-formula/changelog/unseen', fetcher);
  // TODO: might be a simpler endpoint
  const {data: portfolio} =
    useSWR<PortfolioData>('/api/portfolio', fetcher);

  return <div className={styles.main}>
    <Head>
      <title>Magic InvesTool</title>
      <meta name="description" content="Not an investment advice" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Layout>
      <Layout.Header>
        <Menu theme="dark" mode="horizontal" selectedKeys={[router.asPath]}
              items={[
                {
                  key: '/',
                  label: <Link href={'/'}>Dashboard</Link>,
                },
                {
                  key: '/portfolio',
                  label: <>
                    <Link href={'/portfolio'}>Portfolio</Link>
                    {getProfitLossIcon(portfolio)}
                  </>
                },
                {
                  key: '/magic-formula',
                  label: <Link href={'/magic-formula'}>Magic Formula</Link>
                },
                {
                  key: '/magic-formula/changelog',
                  label: <>
                    <Link href={'/magic-formula/changelog'}>
                      MF Changelog
                    </Link>
                    <Badge dot count={unseen?.length || 0}>
                      <span style={{color: 'transparent'}}>.</span>
                    </Badge>
                  </>
                },
                {
                  key: '/history',
                  label: <Link href={'/history'}>History</Link>
                },
                {
                  key: '/settings',
                  label: <Link href={'/settings'}>Settings</Link>
                }
              ]}>
        </Menu>
      </Layout.Header>
      <Layout.Content className={styles.content}>
        {children}
      </Layout.Content>
    </Layout>
  </div>;
};