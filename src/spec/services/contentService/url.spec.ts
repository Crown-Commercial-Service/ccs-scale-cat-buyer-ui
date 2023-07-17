import { expect } from 'chai';
import { contentServiceURL } from 'main/services/contentService/url';

describe('Content service URL helpers', () => {
  describe('statusURL', () => {
    it('returns the status url', () => {
      expect(contentServiceURL.statusURL().toString()).to.eq('https://webprod-cms.crowncommercial.gov.uk/wp-json/wp-api-menus/v2/menus');
    });
  });
});
