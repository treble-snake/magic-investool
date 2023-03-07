import type {NextPage} from 'next';
import {Button, Empty, Radio, Space, Typography} from 'antd';
import {DashboardData} from './api/dashboard';
import React, {useState} from 'react';
import {Hidden, UiPortfolioCompany} from '../libs/cross-platform/types';
import {concat, reduce} from 'ramda';
import {DisplayData} from '../components/common/DataDisplay';
import {HiddenTickersSwitch} from '../components/common/HiddenTickersSwitch';
import {ApiButton} from '../components/common/ApiButton';
import {DownloadOutlined} from '@ant-design/icons';
import {SuggestionList} from '../components/dashboard/SuggestionList';

enum SellFilter {
  all = 'all',
  loss = 'loss',
  profit = 'profit'
}

const filterSellOffers = (items: UiPortfolioCompany[], filter: SellFilter) => {
  if (filter === SellFilter.all) {
    return items;
  }

  return items.filter(it => {
    const price = it.price || 0;
    const bep = it.breakEvenPrice;
    return (price > bep && filter === SellFilter.profit) ||
      (price <= bep && filter === SellFilter.loss);
  });
};

// TODO: separate Title + Suggestion list components
const Dashboard: NextPage = () => {
  const [isHiddenShown, setShowHidden] = useState(false);
  const [sellFilter, setSellFilter] = useState(SellFilter.all);
  const [addMonths, setAddMonths] = useState(0);

  return <DisplayData<DashboardData>
    apiUrl={'/api/dashboard?addMonths=' + addMonths}>
    {({data, mutate}) => {
      if (data.isMagicFormulaEmpty) {
        return <Empty
          description={'Your Magic Formula list is empty.'}>
          <ApiButton url={'/api/magic-formula/sync'} onSuccess={mutate}
                     text={'Sync MagicFormula'} icon={<DownloadOutlined />} />
        </Empty>;
      }

      const allItems = reduce<Hidden[], Hidden[]>(concat, [], Object.values(data?.suggestions || {}));
      const suggestions: DashboardData['suggestions'] = {
        ...data.suggestions,
        toBuy: data.suggestions.toBuy.filter(it => isHiddenShown || !it.hidden),
        toBuyMore: data.suggestions.toBuyMore.filter(it => isHiddenShown || !it.hidden),
      };

      return (
        <>
          <Space style={{marginBottom: 15, marginTop: 15}}>
            {
              ['This month', 'Next month', '+2', '+3'].map((label, index) => (
                <Button size={'large'} key={index}
                        type={addMonths === index ? 'primary' : 'default'}
                        onClick={() => setAddMonths(index)}>
                  {label}
                </Button>
              ))
            }
            <HiddenTickersSwitch list={allItems} state={isHiddenShown}
                                 setState={setShowHidden} />
          </Space>
          <Typography.Title level={3}>To Buy More</Typography.Title>
          <SuggestionList companies={suggestions.toBuyMore}
                          actionsCallback={mutate} />

          <Typography.Title level={3}>
            <span>To Sell</span>
            <Radio.Group value={sellFilter} buttonStyle="solid"
                         onChange={(e) => setSellFilter(e.target.value)}
                         style={{position: 'absolute', marginLeft: 7}}
            >
              <Radio.Button value={SellFilter.loss}>Loss</Radio.Button>
              <Radio.Button value={SellFilter.all}>All</Radio.Button>
              <Radio.Button value={SellFilter.profit}>Profit</Radio.Button>
            </Radio.Group>
          </Typography.Title>
          <SuggestionList
            companies={filterSellOffers(suggestions.toSell as UiPortfolioCompany[], sellFilter)}
            actionsCallback={mutate} />

          <Typography.Title level={3}>To Buy New Ones</Typography.Title>
          <SuggestionList companies={suggestions.toBuy}
                          actionsCallback={mutate} />
        </>
      );
    }}
  </DisplayData>;
};

export default Dashboard;
