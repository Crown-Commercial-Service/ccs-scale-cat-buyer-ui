import { describe, it, expect, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { AgreementDetail } from '@common/middlewares/models/agreement-detail';
import { LotDetail } from '@common/middlewares/models/lot-detail';
import { LotSupplier } from '@common/middlewares/models/lot-supplier';
import { AgreementLotEventType } from 'main/services/types/agreementsService/api';
import { agreementsServiceAPI } from 'main/services/agreementsService/api';
import { FetchResultOK, FetchResultStatus } from 'main/services/types/helpers/api';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { matchHeaders } from 'specs/support/mswMatchers';
import { assertRedisCalls, assertRedisCallsWithCache, creatRedisMockSpys } from 'specs/support/mocks/redis';
import { assertPerformanceLoggerCalls, creatPerformanceLoggerMockSpys } from 'specs/support/mocks/performanceLogger';


describe('Agrements Service API helpers', () => {
  const baseURL = process.env.AGREEMENTS_SERVICE_API_URL;
  const headers = {
    'Content-Type': 'application/json',
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

  const restHandlers = [
    rest.get(`${baseURL}/agreements/${agreementId}`, (req, res, ctx) => {
      if (matchHeaders(req, headers)) {
        return res(ctx.status(200), ctx.json(getAgreementData));
      }

      return res(ctx.status(400));
    }),
    rest.get(`${baseURL}/agreements/${agreementId}/lots`, (req, res, ctx) => {
      if (matchHeaders(req, headers)) {
        return res(ctx.status(200), ctx.json(getAgreementLotsData));
      }

      return res(ctx.status(400));
    }),
    rest.get(`${baseURL}/agreements/${agreementId}/lots/${lotId}`, (req, res, ctx) => {
      if (matchHeaders(req, headers)) {
        return res(ctx.status(200), ctx.json(getAgreementLotData));
      }

      return res(ctx.status(400));
    }),
    rest.get(`${baseURL}/agreements/${agreementId}/lots/${lotId}/suppliers`, (req, res, ctx) => {
      if (matchHeaders(req, headers)) {
        return res(ctx.status(200), ctx.json(getAgreementLotSuppliersData));
      }

      return res(ctx.status(400));
    }),
    rest.get(`${baseURL}/agreements/${agreementId}/lots/${lotId}/event-types`, (req, res, ctx) => {
      if (matchHeaders(req, headers)) {
        return res(ctx.status(200), ctx.json(getAgreementLotEventTypesData));
      }

      return res(ctx.status(400));
    }),
  ];
  
  const server = setupServer(...restHandlers);

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

  afterAll(() => server.close());

  afterEach(() => {
    vi.restoreAllMocks();
    server.resetHandlers();
  });

  describe('getAgreement', () => {
    describe('when no data is cached', () => {
      it('calls the get agreement endpoint with the correct url and headers and logs the performance', async () => {
        const redisSpys = creatRedisMockSpys(vi);
        const performanceLoggerSpys = creatPerformanceLoggerMockSpys(vi);

        const findAgreementResult = await agreementsServiceAPI.getAgreement(agreementId) as FetchResultOK<AgreementDetail>;

        expect(findAgreementResult.status).to.eq(FetchResultStatus.OK);
        expect(findAgreementResult.data).to.eql(getAgreementData);

        assertRedisCalls(redisSpys, 'get_agreements_agreementId-1234', getAgreementData, 3600);
        assertPerformanceLoggerCalls(performanceLoggerSpys, {
          name: 'agreement service',
          message: `Feached agreement from the Agreement service API for agreement: ${agreementId}`
        });
      });
    });

    describe('when data is cached', () => {
      it('does not call the get agreement endpoint but still returns the data and logs the performance', async () => {
        const redisSpys = creatRedisMockSpys(vi, getAgreementData);
        const performanceLoggerSpys = creatPerformanceLoggerMockSpys(vi);

        const findAgreementResult = await agreementsServiceAPI.getAgreement(agreementId) as FetchResultOK<AgreementDetail>;

        expect(findAgreementResult.status).to.eq(FetchResultStatus.OK);
        expect(findAgreementResult.data).to.eql(getAgreementData);

        assertRedisCallsWithCache(redisSpys, 'get_agreements_agreementId-1234');
        assertPerformanceLoggerCalls(performanceLoggerSpys, {
          name: 'agreement service',
          message: `Feached agreement from the Agreement service API for agreement: ${agreementId}`
        });
      });
    });
  });

  describe('getAgreementLots', () => {
    describe('when no data is cached', () => {
      it('calls the get agreement lots endpoint with the correct url and headers and logs the performance', async () => {
        const redisSpys = creatRedisMockSpys(vi);
        const performanceLoggerSpys = creatPerformanceLoggerMockSpys(vi);

        const getAgreementLotsResult = await agreementsServiceAPI.getAgreementLots(agreementId) as FetchResultOK<LotDetail[]>;

        expect(getAgreementLotsResult.status).to.eq(FetchResultStatus.OK);
        expect(getAgreementLotsResult.data).to.eql(getAgreementLotsData);

        assertRedisCalls(redisSpys, 'get_agreements_agreementId-1234_lots', getAgreementLotsData, 3600);
        assertPerformanceLoggerCalls(performanceLoggerSpys, {
          name: 'agreement service',
          message: `Feached agreement lots from the Agreement service API for agreement: ${agreementId}`
        });
      });
    });

    describe('when data is cached', () => {
      it('does not call the get agreement lots endpoint but still returns the data and logs the performance', async () => {
        const redisSpys = creatRedisMockSpys(vi, getAgreementLotsData);
        const performanceLoggerSpys = creatPerformanceLoggerMockSpys(vi);

        const getAgreementLotsResult = await agreementsServiceAPI.getAgreementLots(agreementId) as FetchResultOK<LotDetail[]>;

        expect(getAgreementLotsResult.status).to.eq(FetchResultStatus.OK);
        expect(getAgreementLotsResult.data).to.eql(getAgreementLotsData);

        assertRedisCallsWithCache(redisSpys, 'get_agreements_agreementId-1234_lots');
        assertPerformanceLoggerCalls(performanceLoggerSpys, {
          name: 'agreement service',
          message: `Feached agreement lots from the Agreement service API for agreement: ${agreementId}`
        });
      });
    });
  });

  describe('getAgreementLot', () => {
    describe('when no data is cached', () => {
      it('calls the get agreement lot endpoint with the correct url and headers and logs the performance', async () => {
        const redisSpys = creatRedisMockSpys(vi);
        const performanceLoggerSpys = creatPerformanceLoggerMockSpys(vi);

        const findAgreementLotResult = await agreementsServiceAPI.getAgreementLot(agreementId, lotId) as FetchResultOK<LotDetail>;

        expect(findAgreementLotResult.status).to.eq(FetchResultStatus.OK);
        expect(findAgreementLotResult.data).to.eql(getAgreementLotData);

        assertRedisCalls(redisSpys, 'get_agreements_agreementId-1234_lots_lotId-1234', getAgreementLotData, 3600);
        assertPerformanceLoggerCalls(performanceLoggerSpys, {
          name: 'agreement service',
          message: `Feached agreement lot from the Agreement service API for agreement: ${agreementId}, lot: ${lotId}`
        });
      });
    });

    describe('when data is cached', () => {
      it('does not call the get agreement lot endpoint but still returns the data and logs the performance', async () => {
        const redisSpys = creatRedisMockSpys(vi, getAgreementLotData);
        const performanceLoggerSpys = creatPerformanceLoggerMockSpys(vi);

        const findAgreementLotResult = await agreementsServiceAPI.getAgreementLot(agreementId, lotId) as FetchResultOK<LotDetail>;

        expect(findAgreementLotResult.status).to.eq(FetchResultStatus.OK);
        expect(findAgreementLotResult.data).to.eql(getAgreementLotData);

        assertRedisCallsWithCache(redisSpys, 'get_agreements_agreementId-1234_lots_lotId-1234');
        assertPerformanceLoggerCalls(performanceLoggerSpys, {
          name: 'agreement service',
          message: `Feached agreement lot from the Agreement service API for agreement: ${agreementId}, lot: ${lotId}`
        });
      });
    });
  });

  describe('getAgreementLotSuppliers', () => {
    describe('when no data is cached', () => {
      it('calls the get agreement lot suppliers endpoint with the correct url and headers and logs the performance', async () => {
        const redisSpys = creatRedisMockSpys(vi);
        const performanceLoggerSpys = creatPerformanceLoggerMockSpys(vi);

        const getAgreementLotSuppliersResult = await agreementsServiceAPI.getAgreementLotSuppliers(agreementId, lotId) as FetchResultOK<LotSupplier[]>;

        expect(getAgreementLotSuppliersResult.status).to.eq(FetchResultStatus.OK);
        expect(getAgreementLotSuppliersResult.data).to.eql(getAgreementLotSuppliersData);

        assertRedisCalls(redisSpys, 'get_agreements_agreementId-1234_lots_lotId-1234_suppliers', getAgreementLotSuppliersData, 900);
        assertPerformanceLoggerCalls(performanceLoggerSpys, {
          name: 'agreement service',
          message: `Feached agreement lot suppliers from the Agreement service API for agreement: ${agreementId}, lot: ${lotId}`
        });
      });
    });

    describe('when data is cached', () => {
      it('does not call the get agreement lot suppliers endpoint but still returns the data and logs the performance', async () => {
        const redisSpys = creatRedisMockSpys(vi, getAgreementLotSuppliersData);
        const performanceLoggerSpys = creatPerformanceLoggerMockSpys(vi);

        const getAgreementLotSuppliersResult = await agreementsServiceAPI.getAgreementLotSuppliers(agreementId, lotId) as FetchResultOK<LotSupplier[]>;

        expect(getAgreementLotSuppliersResult.status).to.eq(FetchResultStatus.OK);
        expect(getAgreementLotSuppliersResult.data).to.eql(getAgreementLotSuppliersData);

        assertRedisCallsWithCache(redisSpys, 'get_agreements_agreementId-1234_lots_lotId-1234_suppliers');
        assertPerformanceLoggerCalls(performanceLoggerSpys, {
          name: 'agreement service',
          message: `Feached agreement lot suppliers from the Agreement service API for agreement: ${agreementId}, lot: ${lotId}`
        });
      });
    });
  });

  describe('getAgreementLotEventTypes', () => {
    describe('when no data is cached', () => {
      it('calls the get agreement lot event types endpoint with the correct url and headers and logs the performance', async () => {
        const redisSpys = creatRedisMockSpys(vi);
        const performanceLoggerSpys = creatPerformanceLoggerMockSpys(vi);

        const getAgreementLotEventTypesResult = await agreementsServiceAPI.getAgreementLotEventTypes(agreementId, lotId) as FetchResultOK<AgreementLotEventType[]>;

        expect(getAgreementLotEventTypesResult.status).to.eq(FetchResultStatus.OK);
        expect(getAgreementLotEventTypesResult.data).to.eql(getAgreementLotEventTypesData);

        assertRedisCalls(redisSpys, 'get_agreements_agreementId-1234_lots_lotId-1234_event_types', getAgreementLotEventTypesData, 3600);
        assertPerformanceLoggerCalls(performanceLoggerSpys, {
          name: 'agreement service',
          message: `Feached agreement lot event types from the Agreement service API for agreement: ${agreementId}, lot: ${lotId}`
        });
      });
    });

    describe('when data is cached', () => {
      it('does not call the get agreement lot event types endpoint but still returns the data and logs the performance', async () => {
        const redisSpys = creatRedisMockSpys(vi, getAgreementLotEventTypesData);
        const performanceLoggerSpys = creatPerformanceLoggerMockSpys(vi);

        const getAgreementLotEventTypesResult = await agreementsServiceAPI.getAgreementLotEventTypes(agreementId, lotId) as FetchResultOK<AgreementLotEventType[]>;

        expect(getAgreementLotEventTypesResult.status).to.eq(FetchResultStatus.OK);
        expect(getAgreementLotEventTypesResult.data).to.eql(getAgreementLotEventTypesData);

        assertRedisCallsWithCache(redisSpys, 'get_agreements_agreementId-1234_lots_lotId-1234_event_types');
        assertPerformanceLoggerCalls(performanceLoggerSpys, {
          name: 'agreement service',
          message: `Feached agreement lot event types from the Agreement service API for agreement: ${agreementId}, lot: ${lotId}`
        });
      });
    });
  });
});
