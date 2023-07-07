import { describe, it, expect, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { FetchResultOK, FetchResultStatus } from 'main/services/types/helpers/api';
import { eventsAPI } from 'main/services/tendersService/events/api';
import { Event } from '@common/middlewares/models/tendersService/event';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { matchHeaders } from 'specs/support/mswMatchers';
import { assertPerformanceLoggerCalls, creatPerformanceLoggerMockSpys } from 'specs/support/mocks/performanceLogger';

describe('Tenders Service Events API helpers', () => {
  const baseURL = process.env.TENDERS_SERVICE_API_URL;
  const accessToken = 'ACCESS_TOKEN';
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`
  };
  const projectId = 'projectId-1234';

  const getEventsData = [
    {
      id: 'myId',
      title: 'myTitle',
      eventStage: 'myEventStage',
      status: 'myStatus',
      tenderPeriod: 'myTenderPeriod',
      eventSupportId: 'myEventSupport',
      eventType: 'myEventType',
      dashboardStatus: 'myDashboardStatus'
    }
  ];

  const restHandlers = [
    rest.get(`${baseURL}/tenders/projects/${projectId}/events`, (req, res, ctx) => {
      if (matchHeaders(req, headers)) {
        return res(ctx.status(200), ctx.json(getEventsData));
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

  describe('getEvents', () => {
    it('calls the get events endpoint with the correct url and headers and logs the performance', async () => {
      const spys = creatPerformanceLoggerMockSpys(vi);
      const getEventsResult = await eventsAPI.getEvents(accessToken, projectId) as FetchResultOK<Event[]>;

      expect(getEventsResult.status).to.eq(FetchResultStatus.OK);
      expect(getEventsResult.data).to.eql(getEventsData);

      assertPerformanceLoggerCalls(spys, {
        name: 'tenders API',
        message: `Feached project events from the Tenders API for project: ${projectId}`
      });
    });
  });
});
