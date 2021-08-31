import {StateComparison} from './compareState';
import {writeFile} from 'fs/promises';
import {MagicCompany} from '../../common/companies';

if (!process.env.REPORT_DIR) {
  throw new Error('No report dir');
}
export const REPORT_DIR = process.env.REPORT_DIR +
  (process.env.REPORT_DIR.endsWith('/') ? '' : '/');

const mapCompanies = (items: MagicCompany[]) =>
  items.map(it => `${it.ticker}: ${it.name}`).join('\n');

export const creatReport = (changes: StateComparison) => {
  const date = new Date().toISOString().split('.')[0]; // w/o ms and tz

  const chunks = [];
  if (changes.added.length > 0) {
    chunks.push('+ Added:\n' + mapCompanies(changes.added));
  }
  if (changes.removed.length > 0) {
    chunks.push('- Removed:\n' + mapCompanies(changes.removed));
  }

  return writeFile(`${REPORT_DIR}${date}_change_report.txt`, chunks.join('\n\n'));
};