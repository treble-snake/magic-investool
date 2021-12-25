import type {NextApiRequest, NextApiResponse} from 'next';
import {defaultContext} from '@investool/engine';
import {Unpacked} from '../../../../libs/types';
import {indexBy, prop} from 'ramda';
import {magicFormulaOperations} from '@investool/engine';

export type ChangelogItem =
  Unpacked<ReturnType<ReturnType<typeof defaultContext>['mfChangelogStorage']['findAll']>>[0];

export type ChangelogResponse = Array<ChangelogItem & {
  unseen: boolean
}>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChangelogResponse>
) {
  const context = defaultContext();

  // separate endpoint maybe?
  if (req.method === 'DELETE') {
    await magicFormulaOperations(context).cleanup(10);
  }

  const [items, unseen] = await Promise.all([
    context.mfChangelogStorage.findAll(),
    magicFormulaOperations(context).getUnseenChanges(60)
  ]);

  context.mfChangelogStorage.setLastSeen(new Date(), 60);

  const unseenById = indexBy(prop('id'), unseen);
  res.status(200).json(items.map((it) => ({
    ...it,
    unseen: Boolean(unseenById[it.id])
  })));
}
