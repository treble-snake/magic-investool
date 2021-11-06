import type {NextApiRequest, NextApiResponse} from 'next';
import {defaultContext} from '@investool/engine';

type Body = {
  price: number,
  qty: number,
  date: string
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<void>
) {
  const id = req.query.id as string;
  if (req.method === 'DELETE') {
    await defaultContext().historyStorage.deleteRecord(id);

    res.status(204).send();
  }

  if (req.method === 'PUT') {
    const {price, qty, date} = req.body as Body;
    await defaultContext().historyStorage.updateRecord(
      id, {price, qty, date}
    )
    return res.status(204).send();
  }

  return res.status(405).send();
}
