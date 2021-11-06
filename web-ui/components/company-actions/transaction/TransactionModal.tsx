import {fetcher} from '../../../libs/api';
import {DatePicker, Form, Input, InputNumber, message, Modal} from 'antd';
import React, {useState} from 'react';
import {ApiError} from '../../error/ApiError';
import {Moment} from 'moment';
import {identity, indexBy} from 'ramda';

export type TransactionFormValues = {
  ticker: string,
  qty: number,
  price: number,
  date: Moment
}

type Props = {
  url: string | ((values: TransactionFormValues) => string),
  method?: string,
  title: string
  onSuccess: Function,
  children: (props: { onClick: Function }) => JSX.Element,
  presetValues?: Partial<TransactionFormValues>,
  lockedValues?: (keyof TransactionFormValues)[],
}

// TODO: memo?
export const TransactionModal = (props: Props) => {
  const {
    presetValues = {},
    lockedValues = [],
    method
  } = props;

  const lockMap = indexBy(identity, lockedValues);

  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [error, setError] = useState<null | Error>(null);
  const [form] = Form.useForm();

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
      const values: TransactionFormValues = await form.validateFields().catch(() => null);
      const url = typeof props.url === 'string' ?
        props.url :
        props.url(values);

      if (values) {
        await fetcher(url, {
          qty: values.qty,
          price: values.price,
          date: values.date.toISOString()
        }, method ? {method} : {});
        props.onSuccess();
        message.success('Operation complete!');
        close();
      }
    } catch (e: any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  return <>
    {props.children({onClick: () => setIsModalVisible(true)})}

    <Modal title={props.title} visible={isModalVisible}
           onOk={handle}
           confirmLoading={loading}
           onCancel={close}>
      <Form form={form} layout={'horizontal'} size={'small'}
            initialValues={{...presetValues}}>
        <Form.Item name={'ticker'} label={'Ticker'} rules={[{required: true}]}>
          <Input disabled={Boolean(lockMap['ticker'])} />
        </Form.Item>
        <Form.Item name={'qty'} label={'Quantity'} rules={[{required: true}]}>
          <InputNumber disabled={Boolean(lockMap['qty'])} />
        </Form.Item>
        <Form.Item name={'price'} label={'Price'} rules={[{required: true}]}>
          <InputNumber disabled={Boolean(lockMap['price'])} />
        </Form.Item>
        <Form.Item name={'date'} label={'Date'} rules={[{required: true}]}>
          <DatePicker disabled={Boolean(lockMap['date'])} />
        </Form.Item>
      </Form>
      <ApiError error={error} />
    </Modal>
  </>;
};