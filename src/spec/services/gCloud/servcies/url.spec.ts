import { expect } from 'chai';
import { serviceURL } from 'main/services/gCloud/service/url';

describe('G-Cloud Service URL helpers', () => {
  describe('statusURL', () => {
    it('returns the status url', () => {
      expect(serviceURL.statusURL().toString()).to.eq('http://g-cloud-services.com/_status');
    });
  });
});
