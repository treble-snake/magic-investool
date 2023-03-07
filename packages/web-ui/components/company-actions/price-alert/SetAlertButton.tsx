import {Button, Form, Popover} from 'antd';
import {BellOutlined, CheckCircleTwoTone} from '@ant-design/icons';
import {PortfolioCompany} from '@investool/engine';
import {SetAlertForm} from './SetAlertForm';
import {useState} from 'react';
import {sendSimpleRequest} from '../../common/ApiButton';

type Props = {
  company: PortfolioCompany,
  callback: Function
}

export const SetAlertButton = ({company, callback}: Props) => {
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendRequest = (values: any) => {
    if (!loading) {
      return sendSimpleRequest(`/api/alerts/${company.ticker}`,
        callback, setLoading, 'PUT', values);
    }
  };

  return <Form.Provider onFormFinish={(_, {forms}) => {
    forms.priceAlert.validateFields()
      .then(sendRequest)
      .catch(() => console.debug('Wrong price value'));
  }}>
    <Popover title={'Set price alert'}
             content={
               <SetAlertForm defaultValue={company.breakEvenPrice}
                             loading={loading} />
             }>
      <Form name={'quickPriceAlert'}>
        <Button onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                htmlType={'submit'}
                icon={
                  hovered ?
                    <CheckCircleTwoTone /> :
                    <BellOutlined />
                } />
      </Form>
    </Popover>
  </Form.Provider>;
};
