import {Hidden} from '../../libs/cross-platform/types';
import {Checkbox} from 'antd';

type Props = {
  list: Hidden[],
  state: boolean,
  setState: (s: boolean) => void
}

export const HiddenTickersSwitch = (props: Props) => {
  const hiddenQty = props.list.filter(it => it.hidden).length;

  if (hiddenQty === 0) {
    return null;
  }

  return <Checkbox checked={props.state}
                   onChange={() => props.setState(!props.state)}>
    Show {hiddenQty} hidden tickers
  </Checkbox>;
};
