import type {NextApiRequest, NextApiResponse} from 'next';
import {defaultContext, magicFormulaOperations} from '@investool/engine';
import {indexBy, prop} from 'ramda';

export type ChangelogItem =
  Awaited<ReturnType<ReturnType<typeof defaultContext>['mfChangelogStorage']['findAll']>>[0];

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
