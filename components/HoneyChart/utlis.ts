import {PERIOD, PeriodName} from "../../constants/periods";
import formatDate  from 'date-fns/format';

export const getStartDate = (periodName: PeriodName) => {
  const date = new Date();
  switch (periodName) {
    case PERIOD.one_month:
      date.setMonth(date.getMonth() - 1);
      break;
    case PERIOD.three_month:
      date.setMonth(date.getMonth() - 3);
      break;
    case PERIOD.six_month:
      date.setMonth(date.getMonth() - 6);
      break;
    default:
      date.setFullYear(date.getFullYear() - 1);
  }

  return date;
};

export const getFormattedDate = (timestamp: number, period: PeriodName) => {
  const date = new Date(timestamp);
  switch (period) {
    case "one_month":
      return formatDate(date, 'dd MMM');
    case "three_month":
      return formatDate(date, 'dd MMM');
    case "six_month":
      return formatDate(date, 'dd MMM');
    default:
      return formatDate(date, 'MM/dd/yyyy');
  }
}