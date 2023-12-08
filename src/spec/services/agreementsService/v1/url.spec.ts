import { expect } from 'chai';
import { agreementsServiceURL } from 'main/services/agreementsService/v1/url';

describe('Agrements Service URL helpers', () => {
  describe('statusURL', () => {
    it('returns the status url', () => {
      expect(agreementsServiceURL.statusURL().toString()).to.eq('http://agreements-service.com/agreements');
    });
  });

  describe('agreementLotSuppliersExportURL', () => {
    it('returns the agreement lot suppliers export url', () => {
      expect(agreementsServiceURL.agreementLotSuppliersExportURL('agreementId-1234', 'lotId-1234').toString()).to.eq('http://agreements-service.com/agreements/agreementId-1234/lots/lotId-1234/suppliers/export');
    });
  });
});
