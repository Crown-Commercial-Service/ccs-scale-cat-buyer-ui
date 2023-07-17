import { expect } from 'chai';
import Sinon from 'sinon';
import { FetchResultOK, FetchResultStatus } from 'main/services/types/helpers/api';
import { eventsAPI } from 'main/services/tendersService/events/api';
import { Event } from '@common/middlewares/models/tendersService/event';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { matchHeaders } from 'spec/support/mswMatchers';
import { assertPerformanceLoggerCalls, creatPerformanceLoggerMockSpy } from 'spec/support/mocks/performanceLogger';

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
  const mock = Sinon.createSandbox();

  before(() => server.listen({ onUnhandledRequest: 'error' }));

  after(() => server.close());

  afterEach(() => {
    mock.restore();
    server.resetHandlers();
  });

  describe('getEvents', () => {
    it('calls the get events endpoint with the correct url and headers and logs the performance', async () => {
      const performanceLoggerSpy = creatPerformanceLoggerMockSpy(mock, {
        name: 'tenders API',
        message: `Feached project events from the Tenders API for project: ${projectId}`
      });
      const getEventsResult = await eventsAPI.getEvents(accessToken, projectId) as FetchResultOK<Event[]>;

      expect(getEventsResult.status).to.eq(FetchResultStatus.OK);
      expect(getEventsResult.data).to.eql(getEventsData);

      assertPerformanceLoggerCalls(performanceLoggerSpy);
    });
  });
});
