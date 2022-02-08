import '../styles/globals.css';
import '../styles/globals.css';
import type {AppProps} from 'next/app';
import {MainLayout} from '../components/main-layout/MainLayout';
import React, {Component} from 'react';
import {DisplayData} from '../components/common/DataDisplay';
import {AccountData} from './api/account';
import {OnboardingPage} from '../components/onboarding/OnboardingPage';
import {Alert} from 'antd';

function MyApp({Component, pageProps}: AppProps) {
  return <DisplayData<AccountData>
    apiUrl={'/api/account'}>
    {({data, mutate}) => {
      let content;
      if (
        !data.yahooApiKeys ||
        data.yahooApiKeys.length === 0 ||
        !data.magicFormulaLogin ||
        !data.magicFormulaPassword
      ) {
        content = <OnboardingPage />;
      } else {
        content = <Component {...pageProps} />;
      }

      return <MainLayout>
        <Alert.ErrorBoundary>
          {content}
        </Alert.ErrorBoundary>
      </MainLayout>;
    }}
  </DisplayData>;
}

export default MyApp;
