import {CoreCompany} from '@investool/engine';
import {Tooltip} from 'antd';
import {EyeInvisibleOutlined, EyeOutlined} from '@ant-design/icons';
import {ApiButton} from '../common/ApiButton';
import {Hidden} from '../../libs/cross-platform/types';

type Props = {
  company: CoreCompany & Partial<Hidden>,
  callback: Function
};

export const HideCompanyButton = ({company, callback}: Props) => {
  const isHidden = 'hidden' in company && company.hidden;
  // Maybe: add Tooltip to OperationButton ?
  return <Tooltip title={isHidden ? 'Show' : 'Hide'}>
    <ApiButton url={`/api/hide/${company.ticker}`}
               onSuccess={callback}
               icon={isHidden ? <EyeOutlined/> : <EyeInvisibleOutlined/>}
    />
  </Tooltip>;
};