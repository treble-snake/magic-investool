import {Button, message} from 'antd';
import {fetcher} from '../../libs/api';
import {ReactNode, useState} from 'react';
import styles from './ActionButton.module.css';

type Props = {
  url: string,
  text: string | null,
  icon?: ReactNode,
  callback: Function
}
export const ActionButton = ({url, text, icon, callback}: Props) => {
  const [loading, setLoading] = useState(false);

  const click = async () => {
    setLoading(true);
    fetcher(url)
      .then(() => {
        callback();
        message.success('Operation succeeded!')
      })
      .catch((e) => {
        console.error(e);
        message.error('Operation failed.')
      })
      .finally(() => setLoading(false));
  };

  return <Button type={'default'} icon={icon} className={styles.button}
                 onClick={click}
                 loading={loading} disabled={loading}
  >
    {text}
  </Button>;
};