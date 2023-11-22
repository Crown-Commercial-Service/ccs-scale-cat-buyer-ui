import { expect } from 'chai';
import Sinon from 'sinon';
import { FetchResultOK, FetchResultStatus } from 'main/services/types/helpers/api';
import { projectsAPI } from 'main/services/tendersService/projects/api';
import { Project } from '@common/middlewares/models/tendersService/project';
import { setupServer } from 'msw/node';
import { http } from 'msw';
import { matchHeaders, matchQueryParams, mswEmptyResponseWithStatus, mswJSONResponse } from 'spec/support/mswHelpers';
import { assertPerformanceLoggerCalls, creatPerformanceLoggerMockSpy } from 'spec/support/mocks/performanceLogger';

describe('Tenders Service Projects API helpers', () => {
  const baseURL = process.env.TENDERS_SERVICE_API_URL;
  const accessToken = 'ACCESS_TOKEN';
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`
  };

  const getProjectsData = [
    {
      projectId: 'myProjectId',
      projectName: 'myProjectNameNoParams',
      agreementId: 'myAgreementId',
      agreementName: 'myAgreementName',
      lotId: 'myLotId',
      lotName: 'myLotName',
      activeEvent: {
        id: 'myId',
        title: 'myTitle',
        eventStage: 'myEventStage',
        status: 'myStatus',
        tenderPeriod: 'myTenderPeriod',
        eventSupportId: 'myEventSupport',
        eventType: 'myEventType',
        dashboardStatus: 'myDashboardStatus'
      }
    }
  ];
  const getProjectsWithParamsData = { ...getProjectsData, projectName: 'myProjectName' };

  const restHandlers = [
    http.get(`${baseURL}/tenders/projects`, ({ request }) => {
      if (matchHeaders(request, headers)) {
        if (matchQueryParams(request, '')) {
          return mswJSONResponse(getProjectsData);
        }
        if (matchQueryParams(request, '?my_param=myParam')) {
          return mswJSONResponse(getProjectsWithParamsData);
        }
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

  describe('getProjects', () => {
    it('calls the get projects endpoint with the correct url and headers and logs the performance', async () => {
      const performanceLoggerSpy = creatPerformanceLoggerMockSpy(mock, {
        name: 'tenders API',
        message: 'Feached projects from the Tenders API'
      });
      const getProjectsResult = await projectsAPI.getProjects(accessToken) as FetchResultOK<Project[]>;

      expect(getProjectsResult.status).to.eq(FetchResultStatus.OK);
      expect(getProjectsResult.data).to.eql(getProjectsData);

      assertPerformanceLoggerCalls(performanceLoggerSpy);
    });

    it('calls the get projects endpoint with the correct url, headers and query params', async () => {
      const performanceLoggerSpy = creatPerformanceLoggerMockSpy(mock, {
        name: 'tenders API',
        message: 'Feached projects from the Tenders API'
      });
      const getProjectsResult = await projectsAPI.getProjects(accessToken, { my_param: 'myParam' }) as FetchResultOK<Project[]>;

      expect(getProjectsResult.status).to.eq(FetchResultStatus.OK);
      expect(getProjectsResult.data).to.eql(getProjectsWithParamsData);

      assertPerformanceLoggerCalls(performanceLoggerSpy);
    });
  });
});
