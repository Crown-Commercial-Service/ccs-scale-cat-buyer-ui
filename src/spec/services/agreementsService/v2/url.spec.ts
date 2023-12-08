import { expect } from 'chai';
import { agreementsServiceURL } from 'main/services/agreementsService/v2/url';

describe('Agrements Service URL helpers', () => {
  describe('agreementLotSuppliersExportURL', () => {
    it('returns the agreement lot suppliers export url', () => {
      expect(agreementsServiceURL.agreementLotSuppliersExportURL('agreementId-1234', 'lotId-1234').toString()).to.eq('http://agreements-service-aws.com/agreements-service/agreements/agreementId-1234/lots/lotId-1234/suppliers/export');
    });

    it('returns the agreement lot suppliers export url with the formatted lot', () => {
      expect(agreementsServiceURL.agreementLotSuppliersExportURL('agreementId-1234', 'Lot lotId-1234').toString()).to.eq('http://agreements-service-aws.com/agreements-service/agreements/agreementId-1234/lots/lotId-1234/suppliers/export');
    });
  });
});
