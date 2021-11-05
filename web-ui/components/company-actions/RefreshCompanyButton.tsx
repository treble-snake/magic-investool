import {ReloadOutlined} from '@ant-design/icons';
import {OperationButton} from '../common/OperationButton';
import {CoreCompany} from '@investool/engine';

type Props = {
  company: CoreCompany,
  callback: Function
};

export const RefreshCompanyButton = ({company, callback}: Props) => {
  return <OperationButton url={`/api/refresh/${company.ticker}`}
                          onSuccess={callback}
                          type={'primary'} ghost icon={<ReloadOutlined />}
  />;
};