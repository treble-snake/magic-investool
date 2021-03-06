import {Divider, Tag} from 'antd';
import {CoreCompany} from '@investool/engine';
import {MinusSquareOutlined, PlusSquareOutlined} from '@ant-design/icons';
import {ChangelogResponse} from '../../pages/api/magic-formula/changelog';

type Props = {
  entry: ChangelogResponse[0]
}

const renderItems = (items: CoreCompany[], added: boolean) => {
  return items.map(it => {
    return <div key={it.ticker}>
      <Tag color={added ? 'green' : 'red'}
           icon={added ?
             <PlusSquareOutlined /> :
             <MinusSquareOutlined />
           }>
        {it.ticker}: {it.name}
      </Tag>
    </div>;
  });
};

export const ChangelogCard = ({entry}: Props) => {
  const data = renderItems(entry.added, true);

  if (entry.added.length > 0 && entry.removed.length > 0) {
    data.push(<Divider key={'divider'} type={'horizontal'} />);
  }

  data.push(...renderItems(entry.removed, false));

  return <>
    {data}
  </>;
};