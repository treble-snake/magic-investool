import {Typography} from 'antd';

type Props = { ticker: string, children: any; }

export const DetailsLink = ({children, ticker}: Props) => {
  return <a href={`https://finance.yahoo.com/quote/${ticker}`}
            target={'_blank'} rel={'noreferrer noopener'}>
    <Typography.Text copyable style={{color: '#1890ff'}}>
      {children || ticker}
    </Typography.Text>
  </a>;
};