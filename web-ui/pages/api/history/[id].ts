import type {NextApiRequest, NextApiResponse} from 'next';
import {defaultContext, historyOperations} from '@investool/engine';

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
  const ops = historyOperations(defaultContext());

  if (req.method === 'DELETE') {
    await ops.delete(id);

    res.status(204).send();
  }

  if (req.method === 'PUT') {
    const {price, qty} = req.body as Body;
    await ops.updateOne(id, {price, qty});
    return res.status(204).send();
  }

  return res.status(405).send();
}
