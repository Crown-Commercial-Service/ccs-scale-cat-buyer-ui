import Sinon from 'sinon';
import { AgreementDetail } from '@common/middlewares/models/agreement-detail';
import { LotDetail } from '@common/middlewares/models/lot-detail';
import { LotSupplier } from '@common/middlewares/models/lot-supplier';
import { AgreementLotEventType } from 'main/services/types/agreementsService/api';
import { expect } from 'chai';
import { agreementsServiceAPI } from 'main/services/agreementsService/api';
import { FetchResultOK, FetchResultStatus } from 'main/services/types/helpers/api';
import { Interceptable, MockAgent, setGlobalDispatcher } from 'undici';
import { assertRedisCalls, assertRedisCallsWithCache, creatRedisMockSpy } from 'test/utils/mocks/redis';

describe('Agrements Service API helpers', () => {
  const mock = Sinon.createSandbox();

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

  afterEach(() => {
    mock.restore();
  });

  describe('getAgreement', () => {
    const data = { name: 'myName', endDate: 'myEndDate' };

    describe('when no data is cached', () => {
      it('calls the get agreement endpoint with the correct url and headers', async () => {
        const mockRedisClientSpy = creatRedisMockSpy(mock);

        mockPool.intercept({
          method: 'GET',
          path: `/agreements/${agreementId}`,
          headers: headers
        }).reply(200, data);

        const findAgreementResult = await agreementsServiceAPI.getAgreement(agreementId) as FetchResultOK<AgreementDetail>;

        expect(findAgreementResult.status).to.eq(FetchResultStatus.OK);
        expect(findAgreementResult.data).to.eql(data);

        assertRedisCalls(mockRedisClientSpy, 'get_agreements_agreementId-1234', data, 3600);
      });
    });

    describe('when data is cached', () => {
      it('does not call the get agreement endpoint but still returns the data', async () => {
        const mockRedisClientSpy = creatRedisMockSpy(mock, data);

        const findAgreementResult = await agreementsServiceAPI.getAgreement(agreementId) as FetchResultOK<AgreementDetail>;

        expect(findAgreementResult.status).to.eq(FetchResultStatus.OK);
        expect(findAgreementResult.data).to.eql(data);

        assertRedisCallsWithCache(mockRedisClientSpy, 'get_agreements_agreementId-1234');
      });
    });
  });

  describe('getAgreementLots', () => {
    const data = [
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
    ];

    describe('when no data is cached', () => {
      it('calls the get agreement lots endpoint with the correct url and headers', async () => {
        const mockRedisClientSpy = creatRedisMockSpy(mock);

        mockPool.intercept({
          method: 'GET',
          path: `/agreements/${agreementId}/lots`,
          headers: headers
        }).reply(200, data);

        const getAgreementLotsResult = await agreementsServiceAPI.getAgreementLots(agreementId) as FetchResultOK<LotDetail[]>;

        expect(getAgreementLotsResult.status).to.eq(FetchResultStatus.OK);
        expect(getAgreementLotsResult.data).to.eql(data);

        assertRedisCalls(mockRedisClientSpy, 'get_agreements_agreementId-1234_lots', data, 3600);
      });
    });

    describe('when data is cached', () => {
      it('does not call the get agreement lots endpoint but still returns the data', async () => {
        const mockRedisClientSpy = creatRedisMockSpy(mock, data);

        const getAgreementLotsResult = await agreementsServiceAPI.getAgreementLots(agreementId) as FetchResultOK<LotDetail[]>;

        expect(getAgreementLotsResult.status).to.eq(FetchResultStatus.OK);
        expect(getAgreementLotsResult.data).to.eql(data);

        assertRedisCallsWithCache(mockRedisClientSpy, 'get_agreements_agreementId-1234_lots');
      });
    });
  });

  describe('getAgreementLot', () => {
    const lotId = 'lotId-1234';
    const data = {
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
    };

    describe('when no data is cached', () => {
      it('calls the get agreement lot endpoint with the correct url and headers', async () => {
        const mockRedisClientSpy = creatRedisMockSpy(mock);

        mockPool.intercept({
          method: 'GET',
          path: `/agreements/${agreementId}/lots/${lotId}`,
          headers: headers
        }).reply(200, data);

        const findAgreementLotResult = await agreementsServiceAPI.getAgreementLot(agreementId, lotId) as FetchResultOK<LotDetail>;

        expect(findAgreementLotResult.status).to.eq(FetchResultStatus.OK);
        expect(findAgreementLotResult.data).to.eql(data);

        assertRedisCalls(mockRedisClientSpy, 'get_agreements_agreementId-1234_lots_lotId-1234', data, 3600);
      });
    });

    describe('when data is cached', () => {
      it('does not call the get agreement lot endpoint but still returns the data', async () => {
        const mockRedisClientSpy = creatRedisMockSpy(mock, data);

        const findAgreementLotResult = await agreementsServiceAPI.getAgreementLot(agreementId, lotId) as FetchResultOK<LotDetail>;

        expect(findAgreementLotResult.status).to.eq(FetchResultStatus.OK);
        expect(findAgreementLotResult.data).to.eql(data);

        assertRedisCallsWithCache(mockRedisClientSpy, 'get_agreements_agreementId-1234_lots_lotId-1234');
      });
    });
  });

  describe('getAgreementLotSuppliers', () => {
    const lotId = 'lotId-1234';
    const data = [
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
    ];

    describe('when no data is cached', () => {
      it('calls the get agreement lot suppliers endpoint with the correct url and headers', async () => {
        const mockRedisClientSpy = creatRedisMockSpy(mock);

        mockPool.intercept({
          method: 'GET',
          path: `/agreements/${agreementId}/lots/${lotId}/suppliers`,
          headers: headers
        }).reply(200, data);

        const getAgreementLotSuppliersResult = await agreementsServiceAPI.getAgreementLotSuppliers(agreementId, lotId) as FetchResultOK<LotSupplier[]>;

        expect(getAgreementLotSuppliersResult.status).to.eq(FetchResultStatus.OK);
        expect(getAgreementLotSuppliersResult.data).to.eql(data);

        assertRedisCalls(mockRedisClientSpy, 'get_agreements_agreementId-1234_lots_lotId-1234_suppliers', data, 900);
      });
    });

    describe('when data is cached', () => {
      it('does not call the get agreement lot suppliers endpoint but still returns the data', async () => {
        const mockRedisClientSpy = creatRedisMockSpy(mock, data);

        const getAgreementLotSuppliersResult = await agreementsServiceAPI.getAgreementLotSuppliers(agreementId, lotId) as FetchResultOK<LotSupplier[]>;

        expect(getAgreementLotSuppliersResult.status).to.eq(FetchResultStatus.OK);
        expect(getAgreementLotSuppliersResult.data).to.eql(data);

        assertRedisCallsWithCache(mockRedisClientSpy, 'get_agreements_agreementId-1234_lots_lotId-1234_suppliers');
      });
    });
  });

  describe('getAgreementLotEventTypes', () => {
    const lotId = 'lotId-1234';
    const data = [{ type: 'myType' }];

    describe('when no data is cached', () => {
      it('calls the get agreement lot event types endpoint with the correct url and headers', async () => {
        const mockRedisClientSpy = creatRedisMockSpy(mock);

        mockPool.intercept({
          method: 'GET',
          path: `/agreements/${agreementId}/lots/${lotId}/event-types`,
          headers: headers
        }).reply(200, data);

        const getAgreementLotEventTypesResult = await agreementsServiceAPI.getAgreementLotEventTypes(agreementId, lotId) as FetchResultOK<AgreementLotEventType[]>;

        expect(getAgreementLotEventTypesResult.status).to.eq(FetchResultStatus.OK);
        expect(getAgreementLotEventTypesResult.data).to.eql(data);

        assertRedisCalls(mockRedisClientSpy, 'get_agreements_agreementId-1234_lots_lotId-1234_event_types', data, 3600);
      });
    });

    describe('when data is cached', () => {
      it('does not call the get agreement lot event types endpoint but still returns the data', async () => {
        const mockRedisClientSpy = creatRedisMockSpy(mock, data);

        const getAgreementLotEventTypesResult = await agreementsServiceAPI.getAgreementLotEventTypes(agreementId, lotId) as FetchResultOK<AgreementLotEventType[]>;

        expect(getAgreementLotEventTypesResult.status).to.eq(FetchResultStatus.OK);
        expect(getAgreementLotEventTypesResult.data).to.eql(data);

        assertRedisCallsWithCache(mockRedisClientSpy, 'get_agreements_agreementId-1234_lots_lotId-1234_event_types');
      });
    });
  });
});
