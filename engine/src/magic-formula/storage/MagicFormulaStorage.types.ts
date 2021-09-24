import {CompanyStock} from '../../common/types/companies.types';

export interface MagicFormulaStorage {
  findAll(): Promise<CompanyStock[]>;

  save(records: CompanyStock[]): Promise<void>;
}
