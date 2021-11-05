import {Button, ButtonProps, message} from 'antd';
import {useState} from 'react';
import {fetcher} from '../../libs/api';

export async function sendSimpleRequest(
  url: string,
  onSuccess: Function,
  setLoading: (x: boolean) => void
) {
  setLoading(true);
  try {
    await fetcher(url);
    message.success('Operation complete!');
    onSuccess();
  } catch (e) {
    message.error('Operation failed');
  } finally {
    setLoading(false);
  }
}

type OpButtProps = ButtonProps & {
  url: string,
  name?: string,
  onSuccess: Function
};

export function OperationButton(props: OpButtProps) {
  const {url, onSuccess, name, ...rest} = props;
  const [loading, setLoading] = useState(false);
  const sendRequest = () => sendSimpleRequest(url, onSuccess, setLoading);

  return <Button {...rest} onClick={sendRequest} loading={loading}
                 disabled={loading}>
    {name}
  </Button>;
}