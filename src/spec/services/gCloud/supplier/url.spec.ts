import { expect } from 'chai';
import { supplierURL } from 'main/services/gCloud/supplier/url';

describe('G-Cloud Supplier URL helpers', () => {
  describe('statusURL', () => {
    it('returns the status url', () => {
      expect(supplierURL.statusURL().toString()).to.eq('http://g-cloud-supplier.com/_status');
    });
  });
});
