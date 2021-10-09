import {Button, message} from 'antd';
import {fetcher} from '../../libs/api';
import {ReactNode, useState} from 'react';

type Props = {
  url: string,
  text: string | null,
  icon?: ReactNode,
  method?: string,
  callback: Function
}
export const ActionButton = ({url, text, icon, callback, method}: Props) => {
  const [loading, setLoading] = useState(false);

  const click = async () => {
    setLoading(true);
    fetcher(url, undefined, {method})
      .then(() => {
        callback();
        message.success('Operation succeeded!');
      })
      .catch((e) => {
        console.error(e);
        message.error('Operation failed.');
      })
      .finally(() => setLoading(false));
  };

  return <Button type={'default'} icon={icon} onClick={click}
                 loading={loading} disabled={loading}
  >
    {text}
  </Button>;
};