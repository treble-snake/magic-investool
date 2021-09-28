import type {NextApiRequest, NextApiResponse} from 'next';
import {defaultContext, rankOperations} from '@investool/engine';
import {Unpacked} from '../../libs/types';

export type SuggestionData = {
  suggestion: Unpacked<ReturnType<ReturnType<typeof rankOperations>['makeSuggestion']>>
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuggestionData>
) {
  const context = defaultContext();
  // TODO: del or read from args
  const suggestion = await rankOperations(context)
    .makeSuggestion({customDate: '2021-10-10', size: 9});

  res.status(200).json({
    suggestion
  });
}
