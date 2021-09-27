import {comparator} from 'ramda';
import {CompanyStock} from '@investool/engine';

export const companyComparator = <T extends CompanyStock>(prop: keyof T) =>
  comparator<T>((a, b) => a[prop] < b[prop]);