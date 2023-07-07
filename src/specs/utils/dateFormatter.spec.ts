import { describe, it, expect, beforeEach } from 'vitest';
import moment from 'moment-timezone';
import { DateFormater } from '@utils/dateFormatter';

describe('Date formatter', () => {
  let date: moment.Moment;

  beforeEach(() => {
    date = moment('2023-05-04T14:45:00+01').tz('Europe/London');
  });

  describe('.formatDate', () => {
    it('returns 2023-05-04', () => {
      expect(DateFormater.formatDate(date)).to.eq('2023-05-04');
    });
  });

  describe('.formatInputDate', () => {
    it('returns 4 5 2023', () => {
      expect(DateFormater.formatInputDate(date)).to.eq('4 5 2023');
    });
  });

  describe('.formatLongDate', () => {
    it('returns 4 May 2023', () => {
      expect(DateFormater.formatLongDate(date)).to.eq('4 May 2023');
    });
  });

  describe('.formatDateDDMMYYYY', () => {
    it('returns 04/05/2023', () => {
      expect(DateFormater.formatDateDDMMYYYY(date)).to.eq('04/05/2023');
    });
  });

  describe('.formatDateHHMMDDMMYYYY', () => {
    it('returns 13:45 / 04/05/2023', () => {
      expect(DateFormater.formatDateHHMMDDMMYYYY(date)).to.eq('13:45 / 04/05/2023');
    });
  });

  describe('.formatDateDD_MM_YYYY', () => {
    it('returns 04-05-2023', () => {
      expect(DateFormater.formatDateDD_MM_YYYY(date)).to.eq('04-05-2023');
    });
  });

  describe('.formatDayDate', () => {
    it('returns Thursday 4 May 2023', () => {
      expect(DateFormater.formatDayDate(date)).to.eq('Thursday 4 May 2023');
    });
  });

  describe('.formatLongDateAndTime', () => {
    it('returns 4 May 2023 at 1:45pm', () => {
      expect(DateFormater.formatLongDateAndTime(date)).to.eq('4 May 2023 at 2:45pm');
    });
  });
});
