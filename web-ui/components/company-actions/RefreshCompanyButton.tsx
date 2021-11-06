import {ReloadOutlined} from '@ant-design/icons';
import {ApiButton} from '../common/ApiButton';
import {CoreCompany} from '@investool/engine';

type Props = {
  company: CoreCompany,
  callback: Function
};

export const RefreshCompanyButton = ({company, callback}: Props) => {
  return <ApiButton url={`/api/refresh/${company.ticker}`}
                    onSuccess={callback}
                    type={'primary'} ghost icon={<ReloadOutlined />}
  />;
};