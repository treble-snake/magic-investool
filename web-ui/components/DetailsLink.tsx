type Props = { ticker: string, children: any; }

export const DetailsLink = ({children, ticker}: Props) => {
  return <a href={`https://finance.yahoo.com/quote/${ticker}`}
            target={'_blank'} rel={'noreferrer noopener'}
            style={{color: '#1890ff'}}>
    {children || ticker}
  </a>;
};