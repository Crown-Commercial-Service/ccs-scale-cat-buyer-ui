import { expect } from 'chai';
import Sinon from 'sinon';
import { AgreementDetail } from '@common/middlewares/models/agreement-detail';
import { LotDetail } from '@common/middlewares/models/lot-detail';
import { LotSupplier } from '@common/middlewares/models/lot-supplier';
import { AgreementLotEventType, AgreementServiceHealthResponse } from 'main/services/types/agreementsService/v2/api';
import { agreementsServiceAPI } from 'main/services/agreementsService/v2/api';
import { FetchResultOK, FetchResultStatus } from 'main/services/types/helpers/api';
import { setupServer } from 'msw/node';
import { http } from 'msw';
import { matchHeaders, mswEmptyResponseWithStatus, mswJSONResponse } from 'spec/support/mswHelpers';
import { assertRedisCalls, assertRedisCallsWithCache, creatRedisMockSpy } from 'spec/support/mocks/redis';
import { assertPerformanceLoggerCalls, creatPerformanceLoggerMockSpy } from 'spec/support/mocks/performanceLogger';


describe('Agrements Service API helpers', () => {
  const baseURL = process.env.AGREEMENTS_SERVICE_AWS_API_URL;
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': process.env.AGREEMENTS_SERVICE_AWS_API_KEY
  };
  const agreementId = 'agreementId-1234';
  const lotId = 'lotId-1234';

  const getAgreementData = { name: 'myName', endDate: 'myEndDate' };
  const getAgreementLotData = {
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
  const getAgreementLotsData = [getAgreementLotData];
  const getAgreementLotSuppliersData = [
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
  const getAgreementLotEventTypesData = [{ type: 'myType' }];
  const getAgreementsServiceHealthResultData = {
    status: 'ok'
  };

  const restHandlers = [
    http.get(`${baseURL}/agreements-service/agreements/${agreementId}`, ({ request }) => {
      if (matchHeaders(request, headers)) {
        return mswJSONResponse(getAgreementData);
      }

      return mswEmptyResponseWithStatus(400);
    }),
    http.get(`${baseURL}/agreements-service/agreements/${agreementId}/lots`, ({ request }) => {
      if (matchHeaders(request, headers)) {
        return mswJSONResponse(getAgreementLotsData);
      }

      return mswEmptyResponseWithStatus(400);
    }),
    http.get(`${baseURL}/agreements-service/agreements/${agreementId}/lots/${lotId}`, ({ request }) => {
      if (matchHeaders(request, headers)) {
        return mswJSONResponse(getAgreementLotData);
      }

      return mswEmptyResponseWithStatus(400);
    }),
    http.get(`${baseURL}/agreements-service/agreements/${agreementId}/lots/${lotId}/suppliers`, ({ request }) => {
      if (matchHeaders(request, headers)) {
        return mswJSONResponse(getAgreementLotSuppliersData);
      }

      return mswEmptyResponseWithStatus(400);
    }),
    http.get(`${baseURL}/agreements-service/agreements/${agreementId}/lots/${lotId}/event-types`, ({ request }) => {
      if (matchHeaders(request, headers)) {
        return mswJSONResponse(getAgreementLotEventTypesData);
      }

      return mswEmptyResponseWithStatus(400);
    }),
    http.get(`${baseURL}/agreements-service/health`, ({ request }) => {
      if (matchHeaders(request, headers)) {
        return mswJSONResponse(getAgreementsServiceHealthResultData);
      }

      return mswEmptyResponseWithStatus(400);
    }),
  ];
  
  const server = setupServer(...restHandlers);
  const mock = Sinon.createSandbox();

  before(() => server.listen({ onUnhandledRequest: 'error' }));

  after(() => server.close());

  afterEach(() => {
    mock.restore();
    server.resetHandlers();
  });

  describe('getAgreement', () => {
    describe('when no data is cached', () => {
      it('calls the get agreement endpoint with the correct url and headers and logs the performance', async () => {
        const redisSpy = creatRedisMockSpy(mock);
        const performanceLoggerSpy = creatPerformanceLoggerMockSpy(mock, {
          name: 'agreement service',
          message: `Feached agreement from the Agreement service API for agreement: ${agreementId}`
        });

        const findAgreementResult = await agreementsServiceAPI.getAgreement(agreementId) as FetchResultOK<AgreementDetail>;

        expect(findAgreementResult.status).to.eq(FetchResultStatus.OK);
        expect(findAgreementResult.data).to.eql(getAgreementData);

        assertRedisCalls(redisSpy, 'get_agreements_agreementId-1234', getAgreementData, 3600);
        assertPerformanceLoggerCalls(performanceLoggerSpy);
      });
    });

    describe('when data is cached', () => {
      it('does not call the get agreement endpoint but still returns the data and logs the performance', async () => {
        const redisSpy = creatRedisMockSpy(mock, getAgreementData);
        const performanceLoggerSpy = creatPerformanceLoggerMockSpy(mock, {
          name: 'agreement service',
          message: `Feached agreement from the Agreement service API for agreement: ${agreementId}`
        });

        const findAgreementResult = await agreementsServiceAPI.getAgreement(agreementId) as FetchResultOK<AgreementDetail>;

        expect(findAgreementResult.status).to.eq(FetchResultStatus.OK);
        expect(findAgreementResult.data).to.eql(getAgreementData);

        assertRedisCallsWithCache(redisSpy, 'get_agreements_agreementId-1234');
        assertPerformanceLoggerCalls(performanceLoggerSpy);
      });
    });
  });

  describe('getAgreementLots', () => {
    describe('when no data is cached', () => {
      it('calls the get agreement lots endpoint with the correct url and headers and logs the performance', async () => {
        const redisSpy = creatRedisMockSpy(mock);
        const performanceLoggerSpy = creatPerformanceLoggerMockSpy(mock, {
          name: 'agreement service',
          message: `Feached agreement lots from the Agreement service API for agreement: ${agreementId}`
        });

        const getAgreementLotsResult = await agreementsServiceAPI.getAgreementLots(agreementId) as FetchResultOK<LotDetail[]>;

        expect(getAgreementLotsResult.status).to.eq(FetchResultStatus.OK);
        expect(getAgreementLotsResult.data).to.eql(getAgreementLotsData);

        assertRedisCalls(redisSpy, 'get_agreements_agreementId-1234_lots', getAgreementLotsData, 3600);
        assertPerformanceLoggerCalls(performanceLoggerSpy);
      });
    });

    describe('when data is cached', () => {
      it('does not call the get agreement lots endpoint but still returns the data and logs the performance', async () => {
        const redisSpy = creatRedisMockSpy(mock, getAgreementLotsData);
        const performanceLoggerSpy = creatPerformanceLoggerMockSpy(mock, {
          name: 'agreement service',
          message: `Feached agreement lots from the Agreement service API for agreement: ${agreementId}`
        });

        const getAgreementLotsResult = await agreementsServiceAPI.getAgreementLots(agreementId) as FetchResultOK<LotDetail[]>;

        expect(getAgreementLotsResult.status).to.eq(FetchResultStatus.OK);
        expect(getAgreementLotsResult.data).to.eql(getAgreementLotsData);

        assertRedisCallsWithCache(redisSpy, 'get_agreements_agreementId-1234_lots');
        assertPerformanceLoggerCalls(performanceLoggerSpy);
      });
    });
  });

  describe('getAgreementLot', () => {
    describe('when no data is cached', () => {
      it('calls the get agreement lot endpoint with the correct url and headers and logs the performance', async () => {
        const redisSpy = creatRedisMockSpy(mock);
        const performanceLoggerSpy = creatPerformanceLoggerMockSpy(mock, {
          name: 'agreement service',
          message: `Feached agreement lot from the Agreement service API for agreement: ${agreementId}, lot: ${lotId}`
        });

        const findAgreementLotResult = await agreementsServiceAPI.getAgreementLot(agreementId, lotId) as FetchResultOK<LotDetail>;

        expect(findAgreementLotResult.status).to.eq(FetchResultStatus.OK);
        expect(findAgreementLotResult.data).to.eql(getAgreementLotData);

        assertRedisCalls(redisSpy, 'get_agreements_agreementId-1234_lots_lotId-1234', getAgreementLotData, 3600);
        assertPerformanceLoggerCalls(performanceLoggerSpy);
      });

      describe('and the lot is in the old format', () => {
        it('calls the get agreement lot endpoint with the correct url and headers and logs the performance', async () => {
          const redisSpy = creatRedisMockSpy(mock);
          const performanceLoggerSpy = creatPerformanceLoggerMockSpy(mock, {
            name: 'agreement service',
            message: `Feached agreement lot from the Agreement service API for agreement: ${agreementId}, lot: ${lotId}`
          });
  
          const findAgreementLotResult = await agreementsServiceAPI.getAgreementLot(agreementId, `Lot ${lotId}`) as FetchResultOK<LotDetail>;

          expect(findAgreementLotResult.status).to.eq(FetchResultStatus.OK);
          expect(findAgreementLotResult.data).to.eql(getAgreementLotData);
  
          assertRedisCalls(redisSpy, 'get_agreements_agreementId-1234_lots_lotId-1234', getAgreementLotData, 3600);
          assertPerformanceLoggerCalls(performanceLoggerSpy);
        });
      });
    });

    describe('when data is cached', () => {
      it('does not call the get agreement lot endpoint but still returns the data and logs the performance', async () => {
        const redisSpy = creatRedisMockSpy(mock, getAgreementLotData);
        const performanceLoggerSpy = creatPerformanceLoggerMockSpy(mock, {
          name: 'agreement service',
          message: `Feached agreement lot from the Agreement service API for agreement: ${agreementId}, lot: ${lotId}`
        });

        const findAgreementLotResult = await agreementsServiceAPI.getAgreementLot(agreementId, lotId) as FetchResultOK<LotDetail>;

        expect(findAgreementLotResult.status).to.eq(FetchResultStatus.OK);
        expect(findAgreementLotResult.data).to.eql(getAgreementLotData);

        assertRedisCallsWithCache(redisSpy, 'get_agreements_agreementId-1234_lots_lotId-1234');
        assertPerformanceLoggerCalls(performanceLoggerSpy);
      });
    });
  });

  describe('getAgreementLotSuppliers', () => {
    describe('when no data is cached', () => {
      it('calls the get agreement lot suppliers endpoint with the correct url and headers and logs the performance', async () => {
        const redisSpy = creatRedisMockSpy(mock);
        const performanceLoggerSpy = creatPerformanceLoggerMockSpy(mock, {
          name: 'agreement service',
          message: `Feached agreement lot suppliers from the Agreement service API for agreement: ${agreementId}, lot: ${lotId}`
        });

        const getAgreementLotSuppliersResult = await agreementsServiceAPI.getAgreementLotSuppliers(agreementId, lotId) as FetchResultOK<LotSupplier[]>;

        expect(getAgreementLotSuppliersResult.status).to.eq(FetchResultStatus.OK);
        expect(getAgreementLotSuppliersResult.data).to.eql(getAgreementLotSuppliersData);

        assertRedisCalls(redisSpy, 'get_agreements_agreementId-1234_lots_lotId-1234_suppliers', getAgreementLotSuppliersData, 900);
        assertPerformanceLoggerCalls(performanceLoggerSpy);
      });

      describe('and the lot is in the old format', () => {
        it('calls the get agreement lot suppliers endpoint with the correct url and headers and logs the performance', async () => {
          const redisSpy = creatRedisMockSpy(mock);
          const performanceLoggerSpy = creatPerformanceLoggerMockSpy(mock, {
            name: 'agreement service',
            message: `Feached agreement lot suppliers from the Agreement service API for agreement: ${agreementId}, lot: ${lotId}`
          });
  
          const getAgreementLotSuppliersResult = await agreementsServiceAPI.getAgreementLotSuppliers(agreementId, `Lot ${lotId}`) as FetchResultOK<LotSupplier[]>;
  
          expect(getAgreementLotSuppliersResult.status).to.eq(FetchResultStatus.OK);
          expect(getAgreementLotSuppliersResult.data).to.eql(getAgreementLotSuppliersData);
  
          assertRedisCalls(redisSpy, 'get_agreements_agreementId-1234_lots_lotId-1234_suppliers', getAgreementLotSuppliersData, 900);
          assertPerformanceLoggerCalls(performanceLoggerSpy);
        });
      });
    });

    describe('when data is cached', () => {
      it('does not call the get agreement lot suppliers endpoint but still returns the data and logs the performance', async () => {
        const redisSpy = creatRedisMockSpy(mock, getAgreementLotSuppliersData);
        const performanceLoggerSpy = creatPerformanceLoggerMockSpy(mock, {
          name: 'agreement service',
          message: `Feached agreement lot suppliers from the Agreement service API for agreement: ${agreementId}, lot: ${lotId}`
        });

        const getAgreementLotSuppliersResult = await agreementsServiceAPI.getAgreementLotSuppliers(agreementId, lotId) as FetchResultOK<LotSupplier[]>;

        expect(getAgreementLotSuppliersResult.status).to.eq(FetchResultStatus.OK);
        expect(getAgreementLotSuppliersResult.data).to.eql(getAgreementLotSuppliersData);

        assertRedisCallsWithCache(redisSpy, 'get_agreements_agreementId-1234_lots_lotId-1234_suppliers');
        assertPerformanceLoggerCalls(performanceLoggerSpy);
      });
    });
  });

  describe('getAgreementLotEventTypes', () => {
    describe('when no data is cached', () => {
      it('calls the get agreement lot event types endpoint with the correct url and headers and logs the performance', async () => {
        const redisSpy = creatRedisMockSpy(mock);
        const performanceLoggerSpy = creatPerformanceLoggerMockSpy(mock, {
          name: 'agreement service',
          message: `Feached agreement lot event types from the Agreement service API for agreement: ${agreementId}, lot: ${lotId}`
        });

        const getAgreementLotEventTypesResult = await agreementsServiceAPI.getAgreementLotEventTypes(agreementId, lotId) as FetchResultOK<AgreementLotEventType[]>;

        expect(getAgreementLotEventTypesResult.status).to.eq(FetchResultStatus.OK);
        expect(getAgreementLotEventTypesResult.data).to.eql(getAgreementLotEventTypesData);

        assertRedisCalls(redisSpy, 'get_agreements_agreementId-1234_lots_lotId-1234_event_types', getAgreementLotEventTypesData, 3600);
        assertPerformanceLoggerCalls(performanceLoggerSpy);
      });

      describe('and the lot is in the old format', () => {
        it('calls the get agreement lot event types endpoint with the correct url and headers and logs the performance', async () => {
          const redisSpy = creatRedisMockSpy(mock);
          const performanceLoggerSpy = creatPerformanceLoggerMockSpy(mock, {
            name: 'agreement service',
            message: `Feached agreement lot event types from the Agreement service API for agreement: ${agreementId}, lot: ${lotId}`
          });
  
          const getAgreementLotEventTypesResult = await agreementsServiceAPI.getAgreementLotEventTypes(agreementId, `Lot ${lotId}`) as FetchResultOK<AgreementLotEventType[]>;
  
          expect(getAgreementLotEventTypesResult.status).to.eq(FetchResultStatus.OK);
          expect(getAgreementLotEventTypesResult.data).to.eql(getAgreementLotEventTypesData);
  
          assertRedisCalls(redisSpy, 'get_agreements_agreementId-1234_lots_lotId-1234_event_types', getAgreementLotEventTypesData, 3600);
          assertPerformanceLoggerCalls(performanceLoggerSpy);
        });
  
      });
    });

    describe('when data is cached', () => {
      it('does not call the get agreement lot event types endpoint but still returns the data and logs the performance', async () => {
        const redisSpy = creatRedisMockSpy(mock, getAgreementLotEventTypesData);
        const performanceLoggerSpy = creatPerformanceLoggerMockSpy(mock, {
          name: 'agreement service',
          message: `Feached agreement lot event types from the Agreement service API for agreement: ${agreementId}, lot: ${lotId}`
        });

        const getAgreementLotEventTypesResult = await agreementsServiceAPI.getAgreementLotEventTypes(agreementId, lotId) as FetchResultOK<AgreementLotEventType[]>;

        expect(getAgreementLotEventTypesResult.status).to.eq(FetchResultStatus.OK);
        expect(getAgreementLotEventTypesResult.data).to.eql(getAgreementLotEventTypesData);

        assertRedisCallsWithCache(redisSpy, 'get_agreements_agreementId-1234_lots_lotId-1234_event_types');
        assertPerformanceLoggerCalls(performanceLoggerSpy);
      });
    });
  });

  describe('getAgreementsServiceHealth', () => {
    it('calls the status endpoind', async () => {
      const getAgreementsServiceHealthResult = await agreementsServiceAPI.getAgreementsServiceHealth() as FetchResultOK<AgreementServiceHealthResponse>;

      expect(getAgreementsServiceHealthResult.status).to.eq(FetchResultStatus.OK);
      expect(getAgreementsServiceHealthResult.data).to.eql(getAgreementsServiceHealthResultData);
    });
  });
});
