import { expect } from 'chai';
import { FetchResultOK, FetchResultStatus } from 'main/services/types/helpers/api';
import { Interceptable, MockAgent, setGlobalDispatcher } from 'undici';
import { eventsAPI } from 'main/services/tendersService/events/api';
import { Event } from '@common/middlewares/models/tendersService/event';
import { assertPerformanceLoggerCalls, creatPerformanceLoggerMockSpy } from 'test/utils/mocks/performanceLogger';
import Sinon from 'sinon';

describe('Tenders Service Events API helpers', () => {
  const mock = Sinon.createSandbox();
  const baseURL = process.env.TENDERS_SERVICE_API_URL;
  const accessToken = 'ACCESS_TOKEN';
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`
  };
  const projectId = 'projectId-1234';
  let mockPool: Interceptable;

  beforeEach(() => {
    const mockAgent = new MockAgent();
    mockPool = mockAgent.get(baseURL);
    setGlobalDispatcher(mockAgent);
  });

  afterEach(() => {
    mock.restore();
  });

  describe('getEvents', () => {
    it('calls the get events endpoint with the correct url and headers and logs the performance', async () => {
      const mockedPerformanceLoggerSpy = creatPerformanceLoggerMockSpy(mock, {
        name: 'tenders API',
        message: `Feached project events from the Tenders API for project: ${projectId}`
      });

      mockPool.intercept({
        method: 'GET',
        path: `/tenders/projects/${projectId}/events`,
        headers: headers
      }).reply(200, [
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
      ]);

      const getEventsResult = await eventsAPI.getEvents(accessToken, projectId) as FetchResultOK<Event[]>;

      expect(getEventsResult.status).to.eq(FetchResultStatus.OK);
      expect(getEventsResult.data).to.eql([
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
      ]);

      assertPerformanceLoggerCalls(mockedPerformanceLoggerSpy);
    });
  });
});
