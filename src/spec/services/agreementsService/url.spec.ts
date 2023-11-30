import { expect } from 'chai';
import { agreementsServiceURL } from 'main/services/agreementsService/url';

describe('Agrements Service URL helpers', () => {
  describe('statusURL', () => {
    it('returns the status url', () => {
      expect(agreementsServiceURL.statusURL().toString()).to.eq('http://agreements-service.com/agreements');
    });
  });
});
