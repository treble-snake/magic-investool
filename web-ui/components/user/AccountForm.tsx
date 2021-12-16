import {DisplayData} from '../common/DataDisplay';
import {AccountData} from '../../pages/api/account';
import {Button, Form, Input, Tooltip, Typography} from 'antd';
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
            label="Yahoo Finance API key"
            name="yahooApiKey"
            rules={[{
              required: true,
              message: 'Please input magic formula login'
            }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={cacheTimeTooltip}
            name="yahooCacheThreshold"
            rules={[{required: true, message: 'Please input yahoo cache time'}]}
            wrapperCol={{span: 2}}
          >
            <Input type={'number'} />
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