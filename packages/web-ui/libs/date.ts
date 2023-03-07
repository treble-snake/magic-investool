import moment from 'moment';

export const toDate = (date: Date | string | number) => {
  return moment(date).format('DD.MM.YYYY');
};