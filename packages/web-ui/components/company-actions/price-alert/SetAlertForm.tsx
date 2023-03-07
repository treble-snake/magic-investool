import {Button, Form, Input} from 'antd';

type Props = {
  defaultValue: number,
  loading: boolean,
}

export const SetAlertForm = ({defaultValue, loading}: Props) => {
  return <Form layout={'inline'}
               name={'priceAlert'}
               autoComplete="off"
               initialValues={{price: defaultValue}}
  >
    <Form.Item name="price" rules={[{required: true}]}>
      <Input prefix={'$'} type={'number'} placeholder={'Price, $'}
             style={{width: 100}} />
    </Form.Item>

    <Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>OK</Button>
    </Form.Item>
  </Form>;
};