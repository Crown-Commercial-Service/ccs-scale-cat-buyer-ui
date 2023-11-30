import { expect } from 'chai';
import moment from 'moment';
import { calculateMonthIncrement } from '@utils/calculateMonthIncrement';

describe('Calculate month increment', () => {
  it('should throw an error when the start date is invalid', () => {
    expect(() => calculateMonthIncrement(null as moment.Moment)).to.throw('Start Date is invalid');
  });

  it('should throw an error when the months to add is null', () => {
    const startDate = moment('2023-05-04');

    expect(() => calculateMonthIncrement(startDate, null)).to.throw('monthsToAdd is invalid');
  });

  describe('when no month to add is parsed', () => {
    it('should return 2023-06-04 when the start date is 2023-05-04', () => {
      const startDate = moment('2023-05-04');

      expect(calculateMonthIncrement(startDate).format('YYYY-MM-DD')).to.eq('2023-06-04');
    });

    it('should return 2023-05-30 when the start date is 2023-04-30 (the end of a month with less days than the next)', () => {
      const startDate = moment('2023-04-30');

      expect(calculateMonthIncrement(startDate).format('YYYY-MM-DD')).to.eq('2023-05-30');
    });

    it('should return 2023-03-01 when the start date is 2023-01-31 (the end of a month with more days than the next)', () => {
      const startDate = moment('2023-01-31');

      expect(calculateMonthIncrement(startDate).format('YYYY-MM-DD')).to.eq('2023-03-01');
    });
  });

  describe('when a number of month to add is parsed', () => {
    it('should return 2023-09-04 when the start date is 2023-05-04 and the number of months to add is 4', () => {
      const startDate = moment('2023-05-04');

      expect(calculateMonthIncrement(startDate, 4).format('YYYY-MM-DD')).to.eq('2023-09-04');
    });

    it('should return 2023-05-04 when the start date is 2023-05-04 and the number of months to add is 0', () => {
      const startDate = moment('2023-05-04');

      expect(calculateMonthIncrement(startDate, 0).format('YYYY-MM-DD')).to.eq('2023-05-04');
    });

    it('should return 2023-07-30 when the start date is 2023-04-30 (the end of a month with less days than the next) and the number of months to add is 3', () => {
      const startDate = moment('2023-04-30');

      expect(calculateMonthIncrement(startDate, 3).format('YYYY-MM-DD')).to.eq('2023-07-30');
    });

    it('should return 2023-12-01 when the start date is 2023-01-31 (the end of a month with more days than the next) and the number of months to add is 10', () => {
      const startDate = moment('2023-01-31');

      expect(calculateMonthIncrement(startDate, 10).format('YYYY-MM-DD')).to.eq('2023-12-01');
    });
  });
});
