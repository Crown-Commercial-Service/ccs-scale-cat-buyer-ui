import { AgreementDetail } from '@common/middlewares/models/agreement-detail';
import { LotDetail } from '@common/middlewares/models/lot-detail';
import { LotSupplier } from '@common/middlewares/models/lot-supplier';
import { expect } from 'chai';
import { agreementsServiceAPI } from 'main/services/agreementsService/api';
import { AgreementLotEventType } from 'main/services/types/agreementsService/api';
import { FetchResultOK, FetchResultStatus } from 'main/services/types/helpers/api';
import { Interceptable, MockAgent, setGlobalDispatcher } from 'undici';

describe('Agrements Service API helpers', () => {
  const baseURL = process.env.AGREEMENTS_SERVICE_API_URL;
  const headers = {
    'Content-Type': 'application/json',
  };
  const agreementId = 'agreementId-1234';
  let mockPool: Interceptable;

  beforeEach(() => {
    const mockAgent = new MockAgent();
    mockPool = mockAgent.get(baseURL);
    setGlobalDispatcher(mockAgent);
  });

  describe('getAgreement', () => {
    it('calls the get agreement endpoint with the correct url and headers', async () => {
      mockPool.intercept({
        method: 'GET',
        path: `/agreements/${agreementId}`,
        headers: headers
      }).reply(200, { name: 'myName', endDate: 'myEndDate' });

      const findAgreementResult = await agreementsServiceAPI.getAgreement(agreementId) as FetchResultOK<AgreementDetail>;

      expect(findAgreementResult.status).to.eq(FetchResultStatus.OK);
      expect(findAgreementResult.data).to.eql({ name: 'myName', endDate: 'myEndDate' });
    });
  });

  describe('getAgreementLots', () => {
    it('calls the get agreement lots endpoint with the correct url and headers', async () => {
      mockPool.intercept({
        method: 'GET',
        path: `/agreements/${agreementId}/lots`,
        headers: headers
      }).reply(200, [
        {
          number: 'myNumber',
          name: 'myName',
          startDate: 'myStartDate',
          endDate: 'myEndDate',
          description: 'myDescription',
          suppliers: 'mySuppliers',
          type: 'myType',
          routesToMarket: 'myRoutesToMarket',
          sectors: ['sectors'],
          relatedAgreementLots: [{}],
          rules: [{}]
        }
      ]);

      const getAgreementLotsResult = await agreementsServiceAPI.getAgreementLots(agreementId) as FetchResultOK<LotDetail[]>;

      expect(getAgreementLotsResult.status).to.eq(FetchResultStatus.OK);
      expect(getAgreementLotsResult.data).to.eql([
        {
          number: 'myNumber',
          name: 'myName',
          startDate: 'myStartDate',
          endDate: 'myEndDate',
          description: 'myDescription',
          suppliers: 'mySuppliers',
          type: 'myType',
          routesToMarket: 'myRoutesToMarket',
          sectors: ['sectors'],
          relatedAgreementLots: [{}],
          rules: [{}]
        }
      ]);
    });
  });

  describe('getAgreementLot', () => {
    it('calls the get agreement lot endpoint with the correct url and headers', async () => {
      const lotId = 'lotId-1234';

      mockPool.intercept({
        method: 'GET',
        path: `/agreements/${agreementId}/lots/${lotId}`,
        headers: headers
      }).reply(200, {
        number: 'myNumber',
        name: 'myName',
        startDate: 'myStartDate',
        endDate: 'myEndDate',
        description: 'myDescription',
        suppliers: 'mySuppliers',
        type: 'myType',
        routesToMarket: 'myRoutesToMarket',
        sectors: ['sectors'],
        relatedAgreementLots: [{}],
        rules: [{}]
      });

      const findAgreementLotResult = await agreementsServiceAPI.getAgreementLot(agreementId, lotId) as FetchResultOK<LotDetail>;

      expect(findAgreementLotResult.status).to.eq(FetchResultStatus.OK);
      expect(findAgreementLotResult.data).to.eql({
        number: 'myNumber',
        name: 'myName',
        startDate: 'myStartDate',
        endDate: 'myEndDate',
        description: 'myDescription',
        suppliers: 'mySuppliers',
        type: 'myType',
        routesToMarket: 'myRoutesToMarket',
        sectors: ['sectors'],
        relatedAgreementLots: [{}],
        rules: [{}]
      });
    });
  });

  describe('getAgreementLotSuppliers', () => {
    it('calls the get agreement lot suppliers endpoint with the correct url and headers', async () => {
      const lotId = 'lotId-1234';

      mockPool.intercept({
        method: 'GET',
        path: `/agreements/${agreementId}/lots/${lotId}/suppliers`,
        headers: headers
      }).reply(200, [
        {
          supplierName: 'mySupplierName',
          supplierAddress: {
            streetAddress: 'myStreetAddress',
            locality: 'myLocality',
            region: 'myRegion',
            postalCode: 'myPostalCode',
            countryName: 'myCountryName',
            countryCode: 'myCountryCode'
          },
          supplierContactName: 'mySupplierContactName',
          supplierContactEmail: 'mySupplierContactEmail',
          supplierWebsite: 'mySupplierWebsite',
          supplierId: 'mySupplierId',
          supplierOrganisation: 'mySupplierOrganisation',
          responseState: 'myResponseState',
          responseDate: 'myResponseDate',
          score: 'myScore',
          rank: 'myRank'
        }
      ]);

      const getAgreementLotSuppliersResult = await agreementsServiceAPI.getAgreementLotSuppliers(agreementId, lotId) as FetchResultOK<LotSupplier[]>;

      expect(getAgreementLotSuppliersResult.status).to.eq(FetchResultStatus.OK);
      expect(getAgreementLotSuppliersResult.data).to.eql([
        {
          supplierName: 'mySupplierName',
          supplierAddress: {
            streetAddress: 'myStreetAddress',
            locality: 'myLocality',
            region: 'myRegion',
            postalCode: 'myPostalCode',
            countryName: 'myCountryName',
            countryCode: 'myCountryCode'
          },
          supplierContactName: 'mySupplierContactName',
          supplierContactEmail: 'mySupplierContactEmail',
          supplierWebsite: 'mySupplierWebsite',
          supplierId: 'mySupplierId',
          supplierOrganisation: 'mySupplierOrganisation',
          responseState: 'myResponseState',
          responseDate: 'myResponseDate',
          score: 'myScore',
          rank: 'myRank'
        }
      ]);
    });
  });

  describe('getAgreementLotEventTypes', () => {
    it('calls the get agreement lot event types endpoint with the correct url and headers', async () => {
      const lotId = 'lotId-1234';

      mockPool.intercept({
        method: 'GET',
        path: `/agreements/${agreementId}/lots/${lotId}/event-types`,
        headers: headers
      }).reply(200, [{ type: 'myType' }]);

      const getAgreementLotEventTypesResult = await agreementsServiceAPI.getAgreementLotEventTypes(agreementId, lotId) as FetchResultOK<AgreementLotEventType[]>;

      expect(getAgreementLotEventTypesResult.status).to.eq(FetchResultStatus.OK);
      expect(getAgreementLotEventTypesResult.data).to.eql([{ type: 'myType' }]);
    });
  });
});
