import type {NextApiRequest, NextApiResponse} from 'next';
import {defaultContext} from '@investool/engine';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<void>
) {
  if (req.method !== 'DELETE') {
    return res.status(405).send();
  }

  const id = req.query.id as string;
  await defaultContext().mfChangelogStorage.delete(id);

  res.status(204).send();
}
