import {CoreCompany} from '@investool/engine';
import {Tooltip} from 'antd';
import {EyeInvisibleOutlined, EyeOutlined} from '@ant-design/icons';
import {OperationButton} from '../common/OperationButton';
import {Hidden} from '../../libs/types';

type Props = {
  company: CoreCompany & Partial<Hidden>,
  callback: Function
};

export const HideCompanyButton = ({company, callback}: Props) => {
  const isHidden = 'hidden' in company && company.hidden;
  return <Tooltip title={isHidden ? 'Show' : 'Hide'}>
    <OperationButton url={`/api/hide/${company.ticker}`}
                     onSuccess={callback}
                     icon={isHidden ? <EyeOutlined/> : <EyeInvisibleOutlined/>}
    />
  </Tooltip>;
};