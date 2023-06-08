import { expect } from 'chai';
import { MomentFactory } from '@utils/momentFactory';
import Sinon from 'sinon';

describe('Moment factory', () => {
  describe('current date methods', () => {
    let clock: Sinon.SinonFakeTimers;
    const now = new Date('2023-05-03T14:45:00');

    beforeEach(() => {
      clock = Sinon.useFakeTimers(now.getTime());
    });

    afterEach(() => {
      clock.restore();
    });

    it('returns 2023-05-03T14:45:00.000 for currentDateTime', () => {
      expect(MomentFactory.currentDateTime().format('YYYY-MM-DDTHH:mm:ss.SSS')).to.eq('2023-05-03T14:45:00.000');
    });

    it('returns 2023-05-03T14:45:00.000 for currentDate', () => {
      expect(MomentFactory.currentDate().format('YYYY-MM-DDTHH:mm:ss.SSS')).to.eq('2023-05-03T00:00:00.000');
    });
  });

  describe('.maxDate', () => {
    expect(MomentFactory.maxDate().format('YYYY-MM-DDTHH:mm:ss.SSS')).to.eq('9999-12-31T00:00:00.000');
  });

  describe('.parse', () => {
    it('should throw an error when an empty string is parsed', () => {
      expect(() => MomentFactory.parse('')).to.throw('Value must be defined');
    });

    it('returns 2023-05-04T00:00:00.000 when just the date is parsed', () => {
      expect(MomentFactory.parse('2023-05-04').format('YYYY-MM-DDTHH:mm:ss.SSS')).to.eq('2023-05-04T00:00:00.000');
    });

    it('returns 2023-05-04T17:23:32.000 when just the date and time is parsed', () => {
      expect(MomentFactory.parse('2023-05-04T17:23:32').format('YYYY-MM-DDTHH:mm:ss.SSS')).to.eq(
        '2023-05-04T17:23:32.000'
      );
    });
  });
});
