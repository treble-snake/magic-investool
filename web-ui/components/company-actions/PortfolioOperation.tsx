import {fetcher} from '../../libs/api';
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal
} from 'antd';
import {useState} from 'react';
import {ApiError} from '../error/ApiError';
import moment, {Moment} from 'moment';

type FormValues = {
  ticker: string,
  qty: number,
  price: number,
  date: Moment
}

type Props = {
  isBuy?: boolean,
  fixedValues?: Partial<FormValues>,
  callback: Function
}

// TODO: memo?
export const PortfolioOperation = ({fixedValues = {}, isBuy = false, callback}: Props) => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [error, setError] = useState<null | Error>(null);
  const [form] = Form.useForm();
  const endpoint = isBuy ? 'buy' : 'sell';

  const close = () => {
    form.resetFields();
    setLoading(false);
    setError(null);
    setIsModalVisible(false);
  };

  const handle = async () => {
    setLoading(true);
    setError(null);
    try {
      const values: FormValues = await form.validateFields().catch(() => null);
      if (values) {
        await fetcher(`/api/${endpoint}/${values.ticker}`, {
          qty: values.qty,
          price: values.price,
          date: values.date.toISOString()
        });
        close();
        message.success('Operation complete!');
        callback();
      }
    } catch (e: any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  return <>
    <Button type={'primary'} danger={!isBuy} onClick={() => setIsModalVisible(true)}>
      {isBuy ? 'Buy' : 'Sell'}
    </Button>
    <Modal title={`${isBuy ? 'Buy' : 'Sell'} Company`} visible={isModalVisible}
           onOk={handle}
           confirmLoading={loading}
           onCancel={close}>
      <Form form={form} layout={'horizontal'} size={'small'}
            initialValues={{
              ...fixedValues,
              date: fixedValues?.date || moment()
            }}>
        <Form.Item name={'ticker'} label={'Ticker'} rules={[{required: true}]}>
          <Input disabled={Boolean(fixedValues?.ticker)} />
        </Form.Item>
        <Form.Item name={'qty'} label={'Quantity'} rules={[{required: true}]}>
          <InputNumber disabled={Boolean(fixedValues?.qty)} />
        </Form.Item>
        <Form.Item name={'price'} label={'Price'} rules={[{required: true}]}>
          <InputNumber disabled={Boolean(fixedValues?.price)} />
        </Form.Item>
        <Form.Item name={'date'} label={'Date'} rules={[{required: true}]}>
          <DatePicker />
        </Form.Item>
      </Form>
      <ApiError error={error} />
    </Modal>
  </>;
};