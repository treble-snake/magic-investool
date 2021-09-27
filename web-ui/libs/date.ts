import {format} from 'date-fns';

export const toDate = (date: Date) => {
  return format(date, 'dd.MM.yyyy');
}