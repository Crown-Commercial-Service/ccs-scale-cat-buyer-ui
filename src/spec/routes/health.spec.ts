import { expect } from 'chai';
import healthRoutes from 'main/routes/health';
import request from 'supertest';
import { initApp } from 'spec/support/app';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import config from 'config';

describe('Health routes', () => {
  const app = initApp(healthRoutes);
  const agent = request.agent(app);

  describe('GET /health', () => {
    describe('when the endpoints are up', () => {
      const restHandlers = [
        rest.get(`${process.env.AGREEMENTS_SERVICE_API_URL}/agreements`, (_req, res, ctx) => {
          return res(ctx.status(200), ctx.json({ status: 'ok' }));
        }),
        rest.get(`${config.get('bankholidayservice.BASEURL')}/bank-holidays.json`, (_req, res, ctx) => {
          return res(ctx.status(200), ctx.json({ status: 'ok' }));
        }),
        rest.get(`${config.get('contentService.BASEURL')}/wp-json/wp-api-menus/v2/menus`, (_req, res, ctx) => {
          return res(ctx.status(200), ctx.json({ status: 'ok' }));
        }),
        rest.get(`${process.env.GCLOUD_SEARCH_API_URL}/_status`, (_req, res, ctx) => {
          return res(ctx.status(200), ctx.json({ status: 'ok' }));
        }),
        rest.get(`${process.env.GCLOUD_SERVICES_API_URL}/_status`, (_req, res, ctx) => {
          return res(ctx.status(200), ctx.json({ status: 'ok' }));
        }),
        rest.get(`${process.env.GCLOUD_SUPPLIER_API_URL}/_status`, (_req, res, ctx) => {
          return res(ctx.status(200), ctx.json({ status: 'ok' }));
        }),
        rest.get(process.env.TENDERS_SERVICE_API_URL, (_req, res, ctx) => {
          return res(ctx.status(200), ctx.json({ serverError: false }));
        }),
        rest.get('*/health', (req, _res, _ctx) => {
          return req.passthrough();
        }),
      ];

      const server = setupServer(...restHandlers);

      before(() => server.listen({ onUnhandledRequest: 'error' }));

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

    describe('when the endpoints are not up', () => {
      const restHandlers = [
        rest.get(`${process.env.AGREEMENTS_SERVICE_API_URL}/agreements`, (_req, res, ctx) => {
          return res(ctx.status(503));
        }),
        rest.get(`${config.get('bankholidayservice.BASEURL')}/bank-holidays.json`, (_req, res, ctx) => {
          return res(ctx.status(503));
        }),
        rest.get(`${config.get('contentService.BASEURL')}/wp-json/wp-api-menus/v2/menus`, (_req, res, ctx) => {
          return res(ctx.status(503));
        }),
        rest.get(`${process.env.GCLOUD_SEARCH_API_URL}/_status`, (_req, res, ctx) => {
          return res(ctx.status(503));
        }),
        rest.get(`${process.env.GCLOUD_SERVICES_API_URL}/_status`, (_req, res, ctx) => {
          return res(ctx.status(503));
        }),
        rest.get(`${process.env.GCLOUD_SUPPLIER_API_URL}/_status`, (_req, res, ctx) => {
          return res(ctx.status(503));
        }),
        rest.get(process.env.TENDERS_SERVICE_API_URL, (_req, res, ctx) => {
          return res(ctx.status(503));
        }),
        rest.get('*/health', (req, _res, _ctx) => {
          return req.passthrough();
        }),
      ];

      const server = setupServer(...restHandlers);

      before(() => server.listen({ onUnhandledRequest: 'error' }));

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
  });

  describe('GET /health/liveness', () => {
    it('returns an ok response', async () => {
      const response = await agent.get('/health/liveness');

      expect(response.status).to.eq(200);
      expect(response.body).to.eql({'status': 'UP'});
    });
  });

  describe('GET /health/readiness', () => {
    it('returns an ok response', async () => {
      const response = await agent.get('/health/liveness');

      expect(response.status).to.eq(200);
      expect(response.body).to.eql({'status': 'UP'});
    });
  });
});
