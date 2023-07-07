import { describe, it, expect, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { FetchResultOK, FetchResultStatus } from 'main/services/types/helpers/api';
import { projectsAPI } from 'main/services/tendersService/projects/api';
import { Project } from '@common/middlewares/models/tendersService/project';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { matchHeaders, matchQueryParams } from 'specs/support/mswMatchers';
import { assertPerformanceLoggerCalls, creatPerformanceLoggerMockSpys } from 'specs/support/mocks/performanceLogger';

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
    rest.get(`${baseURL}/tenders/projects`, (req, res, ctx) => {
      if (matchHeaders(req, headers)) {
        if (matchQueryParams(req, '')) {
          return res(ctx.status(200), ctx.json(getProjectsData));
        }
        if (matchQueryParams(req, '?my_param=myParam')) {
          return res(ctx.status(200), ctx.json(getProjectsWithParamsData));
        }
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

  describe('getProjects', () => {
    it('calls the get projects endpoint with the correct url and headers and logs the performance', async () => {
      const spys = creatPerformanceLoggerMockSpys(vi);
      const getProjectsResult = await projectsAPI.getProjects(accessToken) as FetchResultOK<Project[]>;

      expect(getProjectsResult.status).to.eq(FetchResultStatus.OK);
      expect(getProjectsResult.data).to.eql(getProjectsData);

      assertPerformanceLoggerCalls(spys, {
        name: 'tenders API',
        message: 'Feached projects from the Tenders API'
      });
    });

    it('calls the get projects endpoint with the correct url, headers and query params', async () => {
      const spys = creatPerformanceLoggerMockSpys(vi);
      const getProjectsResult = await projectsAPI.getProjects(accessToken, { my_param: 'myParam' }) as FetchResultOK<Project[]>;

      expect(getProjectsResult.status).to.eq(FetchResultStatus.OK);
      expect(getProjectsResult.data).to.eql(getProjectsWithParamsData);

      assertPerformanceLoggerCalls(spys, {
        name: 'tenders API',
        message: 'Feached projects from the Tenders API'
      });
    });
  });
});
