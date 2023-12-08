import { expect } from 'chai';
import healthRoutes from 'main/routes/health';
import request from 'supertest';
import { initApp } from 'spec/support/app';
import { SetupServer, setupServer } from 'msw/node';
import { http, passthrough } from 'msw';
import config from 'config';
import { matchHeaders, mswEmptyResponseWithStatus, mswJSONResponse } from 'spec/support/mswHelpers';

describe('Health routes', () => {
  let agent: request.SuperAgentTest;
  let server: SetupServer;

  const agreementServiceHeaders = () => ({
    'Content-Type': 'application/json',
    'x-api-key': process.env.AGREEMENTS_SERVICE_AWS_API_KEY
  });

  describe('GET /health', () => {
    describe('when the endpoints are up', () => {
      const sharedRestHandlers = [
        http.get(`${config.get('bankholidayservice.BASEURL')}/bank-holidays.json`, () => {
          return mswJSONResponse({ status: 'ok' });
        }),
        http.get(`${config.get('contentService.BASEURL')}/wp-json/wp-api-menus/v2/menus`, () => {
          return mswJSONResponse({ status: 'ok' });
        }),
        http.get(`${process.env.GCLOUD_SEARCH_API_URL}/_status`, () => {
          return mswJSONResponse({ status: 'ok' });
        }),
        http.get(`${process.env.GCLOUD_SERVICES_API_URL}/_status`, () => {
          return mswJSONResponse({ status: 'ok' });
        }),
        http.get(`${process.env.GCLOUD_SUPPLIER_API_URL}/_status`, () => {
          return mswJSONResponse({ status: 'ok' });
        }),
        http.get(process.env.TENDERS_SERVICE_API_URL, () => {
          return mswJSONResponse({ status: 'ok' });
        }),
        http.get('*/health', () => {
          return passthrough();
        }),
      ];

      describe('when using v1 of the agreement service', () => {
        const restHandlers = [
          http.get(`${process.env.AGREEMENTS_SERVICE_API_URL}/agreements`, () => {
            return mswJSONResponse({ status: 'ok' });
          }),
          ...sharedRestHandlers
        ];

        before(() => {
          const app = initApp(healthRoutes);
          agent= request.agent(app);
          server = setupServer(...restHandlers);

          server.listen({ onUnhandledRequest: 'error' });
        });

        after(() => server.close());

        afterEach(() => server.resetHandlers());

        it('has the correct content in the body', async () => {
          const response = await agent.get('/health');

          expect(response.status).to.eq(200);
          expect(response.body).to.eql({
            'status': 'UP',
            'casBuyerUi': {
              'status': 'UP'
            },
            'agreementService': {
              'status': 'UP'
            },
            'bankHolidays': {
              'status': 'UP'
            },
            'contentService': {
              'status': 'UP'
            },
            'gCloudSearch': {
              'status': 'UP'
            },
            'gCloudService': {
              'status': 'UP'
            },
            'gCloudSupplier': {
              'status': 'UP'
            },
            'tendersApi': {
              'status': 'UP'
            },
            'buildInfo': {
              'environment': 'cas.com',
              'project': 'cas-buyer-frontend',
              'name': 'CCS Scale CAS Buyer UI',
              'version': 'unknown',
              'commit': 'unknown',
              'date': 'unknown'
            }
          });
        });
      });

      describe('when using v2 of the agreement service', () => {
        const restHandlers = [
          http.get(`${process.env.AGREEMENTS_SERVICE_AWS_API_URL}/agreements-service/health`, ({ request }) => {
            if (matchHeaders(request, agreementServiceHeaders())) {
              return mswJSONResponse({ status: 'ok' });
            }
  
            return mswEmptyResponseWithStatus(400);
          }),
          ...sharedRestHandlers
        ];

        before(() => {
          process.env.AGREEMENTS_SERVICE_VERSION = 'V2';
          const app = initApp(healthRoutes);
          agent= request.agent(app);
          server = setupServer(...restHandlers);

          server.listen({ onUnhandledRequest: 'error' });
        });

        after(() => {
          delete process.env.AGREEMENTS_SERVICE_VERSION;
          server.close();
        });

        afterEach(() => server.resetHandlers());

        it('has the correct content in the body', async () => {
          const response = await agent.get('/health');

          expect(response.status).to.eq(200);
          expect(response.body).to.eql({
            'status': 'UP',
            'casBuyerUi': {
              'status': 'UP'
            },
            'agreementService': {
              'status': 'UP'
            },
            'bankHolidays': {
              'status': 'UP'
            },
            'contentService': {
              'status': 'UP'
            },
            'gCloudSearch': {
              'status': 'UP'
            },
            'gCloudService': {
              'status': 'UP'
            },
            'gCloudSupplier': {
              'status': 'UP'
            },
            'tendersApi': {
              'status': 'UP'
            },
            'buildInfo': {
              'environment': 'cas.com',
              'project': 'cas-buyer-frontend',
              'name': 'CCS Scale CAS Buyer UI',
              'version': 'unknown',
              'commit': 'unknown',
              'date': 'unknown'
            }
          });
        });
      });
    });

    describe('when the endpoints are not up', () => {
      const sharedRestHandlers = [
        http.get(`${config.get('bankholidayservice.BASEURL')}/bank-holidays.json`, () => {
          return mswEmptyResponseWithStatus(503);
        }),
        http.get(`${config.get('contentService.BASEURL')}/wp-json/wp-api-menus/v2/menus`, () => {
          return mswEmptyResponseWithStatus(503);
        }),
        http.get(`${process.env.GCLOUD_SEARCH_API_URL}/_status`, () => {
          return mswEmptyResponseWithStatus(503);
        }),
        http.get(`${process.env.GCLOUD_SERVICES_API_URL}/_status`, () => {
          return mswEmptyResponseWithStatus(503);
        }),
        http.get(`${process.env.GCLOUD_SUPPLIER_API_URL}/_status`, () => {
          return mswEmptyResponseWithStatus(503);
        }),
        http.get(process.env.TENDERS_SERVICE_API_URL, () => {
          return mswEmptyResponseWithStatus(503);
        }),
        http.get('*/health', () => {
          return passthrough();
        }),
      ];

      describe('when using v1 of the agreement service', () => {
        const restHandlers = [
          http.get(`${process.env.AGREEMENTS_SERVICE_API_URL}/agreements`, () => {
            return mswEmptyResponseWithStatus(503);
          }),
          ...sharedRestHandlers
        ];

        before(() => {
          const app = initApp(healthRoutes);
          agent= request.agent(app);
          server = setupServer(...restHandlers);

          server.listen({ onUnhandledRequest: 'error' });
        });

        after(() => server.close());

        afterEach(() => server.resetHandlers());

        it('has the correct content in the body', async () => {
          const response = await agent.get('/health');

          expect(response.status).to.eq(503);
          expect(response.body).to.eql({
            'status': 'DOWN',
            'casBuyerUi': {
              'status': 'UP'
            },
            'agreementService': {
              'status': 'DOWN'
            },
            'bankHolidays': {
              'status': 'DOWN'
            },
            'contentService': {
              'status': 'DOWN'
            },
            'gCloudSearch': {
              'status': 'DOWN'
            },
            'gCloudService': {
              'status': 'DOWN'
            },
            'gCloudSupplier': {
              'status': 'DOWN'
            },
            'tendersApi': {
              'status': 'DOWN'
            },
            'buildInfo': {
              'environment': 'cas.com',
              'project': 'cas-buyer-frontend',
              'name': 'CCS Scale CAS Buyer UI',
              'version': 'unknown',
              'commit': 'unknown',
              'date': 'unknown'
            }
          });
        });
      });

      describe('when using v2 of the agreement service', () => {
        const restHandlers = [
          http.get(`${process.env.AGREEMENTS_SERVICE_AWS_API_URL}/agreements-service/health`, ({ request }) => {
            if (matchHeaders(request, agreementServiceHeaders())) {
              return mswEmptyResponseWithStatus(503);
            }
          }),
          ...sharedRestHandlers
        ];

        before(() => {
          process.env.AGREEMENTS_SERVICE_VERSION = 'V2';
          const app = initApp(healthRoutes);
          agent= request.agent(app);
          server = setupServer(...restHandlers);

          server.listen({ onUnhandledRequest: 'error' });
        });

        after(() => {
          delete process.env.AGREEMENTS_SERVICE_VERSION;
          server.close();
        });

        afterEach(() => server.resetHandlers());

        it('has the correct content in the body', async () => {
          const response = await agent.get('/health');

          expect(response.status).to.eq(503);
          expect(response.body).to.eql({
            'status': 'DOWN',
            'casBuyerUi': {
              'status': 'UP'
            },
            'agreementService': {
              'status': 'DOWN'
            },
            'bankHolidays': {
              'status': 'DOWN'
            },
            'contentService': {
              'status': 'DOWN'
            },
            'gCloudSearch': {
              'status': 'DOWN'
            },
            'gCloudService': {
              'status': 'DOWN'
            },
            'gCloudSupplier': {
              'status': 'DOWN'
            },
            'tendersApi': {
              'status': 'DOWN'
            },
            'buildInfo': {
              'environment': 'cas.com',
              'project': 'cas-buyer-frontend',
              'name': 'CCS Scale CAS Buyer UI',
              'version': 'unknown',
              'commit': 'unknown',
              'date': 'unknown'
            }
          });
        });
      });
    });
  });

  describe('GET /health/liveness', () => {
    before(() => {
      const app = initApp(healthRoutes);
      agent= request.agent(app);
    });

    it('returns an ok response', async () => {
      const response = await agent.get('/health/liveness');

      expect(response.status).to.eq(200);
      expect(response.body).to.eql({'status': 'UP'});
    });
  });

  describe('GET /health/readiness', () => {
    before(() => {
      const app = initApp(healthRoutes);
      agent= request.agent(app);
    });

    it('returns an ok response', async () => {
      const response = await agent.get('/health/liveness');

      expect(response.status).to.eq(200);
      expect(response.body).to.eql({'status': 'UP'});
    });
  });
});
