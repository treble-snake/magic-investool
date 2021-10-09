import {CompanyStock} from '@investool/engine/dist/types';
import {PortfolioCompany} from '@investool/engine';
import {Button, message} from 'antd';
import {ReloadOutlined} from '@ant-design/icons';
import {fetcher} from '../../libs/api';
import {useState} from 'react';

type Props = {
  company: CompanyStock | PortfolioCompany,
  callback: Function
}

export const RefreshCompanyButton = ({company, callback}: Props) => {
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      await fetcher(`/api/refresh/${company.ticker}`);
      message.success('Operation complete!');
      callback();
    } catch (e) {
      message.error('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return <Button type={'primary'} ghost onClick={refresh} disabled={loading}
                 icon={<ReloadOutlined spin={loading} />} key={'refresh'} />;
};