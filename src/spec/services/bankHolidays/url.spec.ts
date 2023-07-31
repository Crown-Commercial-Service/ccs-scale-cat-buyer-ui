import { expect } from 'chai';
import { bankHolidaysURL } from 'main/services/bankHolidays/url';

describe('Bank Holidays URL helpers', () => {
  describe('statusURL', () => {
    it('returns the status url', () => {
      expect(bankHolidaysURL.statusURL().toString()).to.eq('https://www.gov.uk/bank-holidays.json');
    });
  });
});
