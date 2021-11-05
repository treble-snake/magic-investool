import {Hidden} from '../../libs/types';
import {Checkbox} from 'antd';
import {ReactNode, useState} from 'react';

export const useHiddenSwitch = (list: Hidden[]) => {
  const [isHiddenShown, setShowHidden] = useState(false);
  const hiddenQty = list.filter(it => it.hidden).length;

  let HiddenSwitch: ReactNode = null;
  if (hiddenQty > 0) {
    HiddenSwitch = <Checkbox checked={isHiddenShown}
                             onChange={() => setShowHidden(!isHiddenShown)}>
      Show {hiddenQty} hidden tickers
    </Checkbox>;
  }

  return {isHiddenShown, HiddenSwitch};
};