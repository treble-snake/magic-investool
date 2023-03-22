import {DisplayData} from '../common/DataDisplay';
import {AccountData} from '../../pages/api/account';
import {Button, Checkbox, Form, Input, Tooltip, Typography} from 'antd';
import React, {useState} from 'react';
import {QuestionCircleOutlined} from '@ant-design/icons';
import {sendSimpleRequest} from '../common/ApiButton';

export const AccountForm = () => {
  const [loading, setLoading] = useState(false);

  const priceCheckIntervalTooltip = <span>
    Price check interval, minutes{' '}
    <Tooltip
      title={'Keep in mind it\'ll use up API key daily quota'}>
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
            label="Alpha Vantage API key"
            name="alphavantageApiKey"
            rules={[{
              required: true,
              message: 'Please input the API key'
            }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Finnhub API key"
            name="finnhubApiKey"
            rules={[{
              required: true,
              message: 'Please input the API key'
            }]}
          >
            <Input />
          </Form.Item>

          <Typography.Title level={5}>Date Updates</Typography.Title>
          <Typography.Paragraph>
            Automatically update Magic Formula list and company data in the background.
            Each time tries to update one portfolio and one Magic Formula company.
            Keep in mind it uses up API quotas.
          </Typography.Paragraph>

          <Form.Item
            valuePropName="checked"
            label={'Enable companies auto update'}
            name={'stockUpdatesEnabled'}
          >
            <Checkbox />
          </Form.Item>

          <Form.Item
            name="stockUpdatesIntervalMin"
            label={'Companies auto update interval, min'}
            wrapperCol={{span: 2}}
          >
            <Input type={'number'} />
          </Form.Item>

          <Typography.Title level={5}>Price notifications</Typography.Title>
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