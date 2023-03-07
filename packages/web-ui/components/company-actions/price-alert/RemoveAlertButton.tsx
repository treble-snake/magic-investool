import {Badge, Tooltip} from 'antd';
import {BellFilled, DeleteTwoTone} from '@ant-design/icons';
import {PortfolioCompany} from '@investool/engine';
import {ApiButton} from '../../common/ApiButton';
import {useState} from 'react';

type Props = {
  company: PortfolioCompany,
  callback: Function
}

const alertWorked = (price: number | null, alertPrice: number | undefined) => {
  if (!price || !alertPrice) {
    return false;
  }

  return price >= alertPrice;
};

export const RemoveAlertButton = ({company, callback}: Props) => {
  const [hovered, setHovered] = useState(false);
  const alertHasWorked = alertWorked(company.price, company.priceAlert?.price);

  return <Tooltip title={`Remove alert for $${company.priceAlert?.price}`}>
    <Badge dot count={alertHasWorked ? 1 : 0}>
      <ApiButton method={'DELETE'}
                 url={`/api/alerts/${company.ticker}`}
                 onMouseEnter={() => setHovered(true)}
                 onMouseLeave={() => setHovered(false)}
                 danger={hovered}
                 onSuccess={callback}
                 icon={
                   hovered ?
                     <DeleteTwoTone twoToneColor={'red'} /> :
                     <BellFilled />
                 }
      />
    </Badge>
  </Tooltip>;
};