import {DisplayData} from '../common/DataDisplay';
import {AccountData} from '../../pages/api/account';
import {
  Alert,
  Button,
  Checkbox,
  Form,
  Input,
  Select,
  Tooltip,
  Typography
} from 'antd';
import React, {useState} from 'react';
import {QuestionCircleOutlined} from '@ant-design/icons';
import {sendSimpleRequest} from '../common/ApiButton';

export const AccountForm = () => {
  const [loading, setLoading] = useState(false);

  const cacheTimeTooltip = <span>
    Yahoo Cache Time, hrs{' '}
    <Tooltip
      title={'Since you have limited API calls with Yahoo, it\'s recommended to cache the data.\n' +
        'Set for how many hours you are comfortable with.'}>
    <QuestionCircleOutlined />
  </Tooltip>
  </span>;

  const priceCheckIntervalTooltip = <span>
    Price check interval, minutes{' '}
    <Tooltip
      title={'Keep in mind it\'ll use up Yahoo API key daily quota'}>
    <QuestionCircleOutlined />
  </Tooltip>
  </span>;

  return <>
    <Typography.Title level={4}>Account Details</Typography.Title>
    <DisplayData<AccountData>
      apiUrl={'/api/account'}>
      {({data, mutate}) => {
        const onFinish = (values: any) => {
          if (!loading) {
            return sendSimpleRequest(`/api/account`, mutate, setLoading, 'POST', values);
          }
        };

        return <Form
          name="userAccount"
          labelCol={{span: 4}}
          wrapperCol={{span: 8}}
          initialValues={data}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Magic Formula login"
            name="magicFormulaLogin"
            rules={[{
              required: true,
              message: 'Please input magic formula login'
            }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Magic Formula Password"
            name="magicFormulaPassword"
            rules={[{
              required: true,
              message: 'Please input your magic formula password'
            }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Yahoo Finance API keys"
            name="yahooApiKeys"
            rules={[{
              required: true,
              message: 'Please input at least one API key'
            }]}
          >
            <Select mode={'tags'} />
          </Form.Item>

          <Form.Item
            label={cacheTimeTooltip}
            name="yahooCacheThreshold"
            rules={[{required: true, message: 'Please input yahoo cache time'}]}
            wrapperCol={{span: 2}}
          >
            <Input type={'number'} />
          </Form.Item>

          <Typography.Title level={5}>Price notifications</Typography.Title>
          <Form.Item>
            <Alert type={'warning'} showIcon
                   message={<>
                     <div>Only available in the standalone version now.</div>
                     <div>Restart the app to apply settings after saving them.
                       Sorry 😬
                     </div>
                   </>}
            />
          </Form.Item>

          <Form.Item
            valuePropName="checked"
            label={'Enable periodic price checks'}
            name={'priceSchedulerEnabled'}
          >
            <Checkbox />
          </Form.Item>

          <Form.Item
            label={priceCheckIntervalTooltip}
            name="priceSchedulerIntervalMin"
            wrapperCol={{span: 2}}
          >
            <Input type={'number'} />
          </Form.Item>

          <Form.Item
            valuePropName="checked"
            label={'Enable price in-app notifications'}
            name={'priceNotificationsEnabled'}
          >
            <Checkbox />
          </Form.Item>

          <Form.Item wrapperCol={{offset: 4, span: 8}}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save
            </Button>
          </Form.Item>
        </Form>;
      }}
    </DisplayData>
  </>;
};