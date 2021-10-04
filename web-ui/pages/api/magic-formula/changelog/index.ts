import type {NextApiRequest, NextApiResponse} from 'next';
import {defaultContext} from '@investool/engine';
import {Unpacked} from '../../../../libs/types';

export type ChangelogData =
  Unpacked<ReturnType<ReturnType<typeof defaultContext>['mfChangelogStorage']['findAll']>>

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChangelogData>
) {
  const context = defaultContext();
  const items = await context.mfChangelogStorage.findAll();

  res.status(200).json(items);
}
