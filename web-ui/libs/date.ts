import {format} from 'date-fns';

export const toDate = (date: Date | string) => {
  return format(typeof date === 'string' ? new Date(date) : date, 'dd.MM.yyyy');
};