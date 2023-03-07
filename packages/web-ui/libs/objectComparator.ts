import {comparator} from 'ramda';

export const objectComparator = <T>(prop: keyof T) =>
  comparator<T>((a, b) => a[prop] < b[prop]);
