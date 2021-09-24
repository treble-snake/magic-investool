import {FileStorage, makeFileStorage} from '../../storage/file';
import {MAGIC_FORMULA_FILENAME} from '../../common/config';
import {MagicFormulaStorage} from './MagicFormulaStorage.types';
import {CompanyStock} from '../../common/types/companies.types';

type MagicFormulaData = {
  companies: CompanyStock[];
  lastUpdate: string;
}

export const fileMagicFormulaStorage = (
  storage: FileStorage<MagicFormulaData> = makeFileStorage(MAGIC_FORMULA_FILENAME)
): MagicFormulaStorage => {
  return {
    async findAll(): Promise<CompanyStock[]> {
      const data = await storage.read();
      return data?.companies ?? [];
    },
    save(companies: CompanyStock[]): Promise<void> {
      return storage.write({
        lastUpdate: new Date().toISOString(),
        companies
      });
    }
  };
};
