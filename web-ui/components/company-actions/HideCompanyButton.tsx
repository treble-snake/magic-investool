import {CompanyStock} from '@investool/engine/dist/types';
import {PortfolioCompany} from '@investool/engine';
import {Button, message, Tooltip} from 'antd';
import {EyeInvisibleOutlined, EyeOutlined} from '@ant-design/icons';
import {fetcher} from '../../libs/api';
import {useState} from 'react';
import {UiCompanyStock} from '../../pages/api/magic-formula';

type Props = {
  company: CompanyStock | PortfolioCompany | UiCompanyStock,
  callback: Function
}

export const HideCompanyButton = ({company, callback}: Props) => {
  const [loading, setLoading] = useState(false);

  // TODO: create some "use request" hook
  const sendRequest = async () => {
    setLoading(true);
    try {
      await fetcher(`/api/hide/${company.ticker}`);
      message.success('Operation complete!');
      callback();
    } catch (e) {
      message.error('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const isHidden = 'hidden' in company && company.hidden;
  return <Tooltip title={isHidden ? 'Show' : 'Hide'}>
    <Button onClick={sendRequest} disabled={loading}
                 icon={isHidden ? <EyeOutlined/> : <EyeInvisibleOutlined/>} />
  </Tooltip>;
};