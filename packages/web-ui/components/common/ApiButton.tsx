import {Button, ButtonProps, message, Modal} from 'antd';
import {useState} from 'react';
import {fetcher} from '../../libs/api';

const {confirm} = Modal;

export async function sendSimpleRequest(
  url: string,
  onSuccess: Function,
  setLoading: (x: boolean) => void,
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  body?: any
) {
  setLoading(true);
  try {
    await fetcher(url, body, {method});
    message.success('Operation complete!');
    onSuccess();
  } catch (e) {
    console.error(e);
    message.error('Operation failed');
  } finally {
    setLoading(false);
  }
}

type ApiButtonProps = ButtonProps & {
  url: string,
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  text?: string,
  onSuccess: Function,
  confirm?: boolean
};

// Maybe: change `name` to `tooltip`
// Maybe: use `children` instead of `name`

export function ApiButton(props: ApiButtonProps) {
  const {url, onSuccess, text, method, confirm: needsConfirm, ...rest} = props;
  const [loading, setLoading] = useState(false);
  const sendRequest = needsConfirm ?
    () => confirm({
      title: 'Are you sure?',
      okText: 'Yes',
      okButtonProps: {danger: true},
      onOk: () => sendSimpleRequest(url, onSuccess, setLoading, method)
    }) :
    () => sendSimpleRequest(url, onSuccess, setLoading, method);

  return <Button {...rest} onClick={sendRequest} loading={loading}
                 disabled={loading}>
    {text}
  </Button>;
}