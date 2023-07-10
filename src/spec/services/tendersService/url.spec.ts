import { expect } from 'chai';
import { tendersServiceURL } from 'main/services/tendersService/url';

describe('Tenders Service URL helpers', () => {
  describe('statusURL', () => {
    it('returns the status url', () => {
      expect(tendersServiceURL.statusURL()).to.eq('http://tenders-service.com');
    });
  });
});
