import { expect } from 'chai';
import { searchURL } from 'main/services/gCloud/search/url';

describe('G-Cloud Search URL helpers', () => {
  describe('statusURL', () => {
    it('returns the status url', () => {
      expect(searchURL.statusURL().toString()).to.eq('http://g-cloud-search.com/_status');
    });
  });
});
