import type {NextApiRequest, NextApiResponse} from 'next';
import {
  defaultContext,
  portfolioOperations
} from '@investool/engine';
import {SectorQty} from '../../../engine/src/portfoio/operations';
import {Unpacked} from '../../libs/types';
import {rankOperations} from '@investool/engine';

export type SuggestionData = {
  suggestion: Unpacked<ReturnType<ReturnType<typeof rankOperations>['makeSuggestion']>>
  sectors: SectorQty[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuggestionData>
) {
  const context = defaultContext();
  const sectors = await portfolioOperations(context).getSectors();
  const suggestion = await rankOperations(context).makeSuggestion('2021-10-10');

  res.status(200).json({
    suggestion, sectors
  });
}
