import moment from 'moment';

const calculateMonthIncrement = (startDate: moment.Moment, monthsToAdd?: number): moment.Moment => {
  if (!startDate) {
    throw new Error('Start Date is invalid');
  }
  if (monthsToAdd === null) {
    throw new Error('monthsToAdd is invalid');
  }

  if (monthsToAdd === undefined) {
    monthsToAdd = 1;
  }

  const futureMonth = moment(startDate).add(monthsToAdd, 'M');

  if (monthsToAdd >= 0 && startDate.date() !== futureMonth.date() && futureMonth.daysInMonth() === futureMonth.date()) {
    futureMonth.add(1, 'd');
  }

  return futureMonth;
};

export { calculateMonthIncrement };
