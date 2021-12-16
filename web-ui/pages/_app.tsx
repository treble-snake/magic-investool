import '../styles/globals.css';
import '../styles/globals.css';
import type {AppProps} from 'next/app';
import {MainLayout} from '../components/main-layout/MainLayout';
import React, {Component} from 'react';
import {DisplayData} from '../components/common/DataDisplay';
import {AccountData} from './api/account';
import {OnboardingPage} from '../components/onboarding/OnboardingPage';

function MyApp({Component, pageProps}: AppProps) {
  return <DisplayData<AccountData>
    apiUrl={'/api/account'}>
    {({data, mutate}) => {
      let content;
      if (
        !data.yahooApiKey ||
        !data.magicFormulaLogin ||
        !data.magicFormulaPassword
      ) {
        content = <OnboardingPage />;
      } else {
        content = <Component {...pageProps} />;
      }

      return <MainLayout>
        {content}
      </MainLayout>;
    }}
  </DisplayData>;
}

export default MyApp;
