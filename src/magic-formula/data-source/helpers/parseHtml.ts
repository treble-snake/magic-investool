import {JSDOM} from 'jsdom';
import {unescape} from 'html-escaper';
import {CoreCompany} from '../../../common/types/companies.types';

export const parseHtml = (html: string): CoreCompany[] => {
  const {document} = new JSDOM(html).window;

  const companies = Array.from(document.querySelectorAll('table.screeningdata tbody tr'))
    .map((row) => {
      return {
        name: unescape(row.querySelector('td:nth-child(1)')?.innerHTML || ''),
        ticker: row.querySelector('td:nth-child(2)')?.innerHTML || '',
      };
    })
    .filter(it => it.name);

  return companies;
};