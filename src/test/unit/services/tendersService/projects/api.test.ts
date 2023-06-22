import { expect } from 'chai';
import { FetchResultOK, FetchResultStatus } from 'main/services/types/helpers/api';
import { Interceptable, MockAgent, setGlobalDispatcher } from 'undici';
import { projectsAPI } from 'main/services/tendersService/projects/api';
import { Project } from '@common/middlewares/models/tendersService/project';

describe('Tenders Service Projects API helpers', () => {
  const baseURL = process.env.TENDERS_SERVICE_API_URL;
  const accessToken = 'ACCESS_TOKEN';
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`
  };
  let mockPool: Interceptable;

  beforeEach(() => {
    const mockAgent = new MockAgent();
    mockPool = mockAgent.get(baseURL);
    setGlobalDispatcher(mockAgent);
  });

  describe('getProjects', () => {
    const path = '/tenders/projects';

    it('calls the get projects endpoint with the correct url and headers', async () => {
      mockPool.intercept({
        method: 'GET',
        path: path,
        headers: headers
      }).reply(200, [
        {
          projectId: 'myProjectId',
          projectName: 'myProjectName',
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
      ]);

      const getProjectsResult = await projectsAPI.getProjects(accessToken) as FetchResultOK<Project[]>;

      expect(getProjectsResult.status).to.eq(FetchResultStatus.OK);
      expect(getProjectsResult.data).to.eql([
        {
          projectId: 'myProjectId',
          projectName: 'myProjectName',
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
      ]);
    });

    it('calls the get projects endpoint with the correct url, headers and query params', async () => {
      mockPool.intercept({
        method: 'GET',
        path: `${path}?my_param=myParam`,
        headers: headers
      }).reply(200, [
        {
          projectId: 'myProjectId',
          projectName: 'myProjectName',
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
      ]);

      const getProjectsResult = await projectsAPI.getProjects(accessToken, { my_param: 'myParam' }) as FetchResultOK<Project[]>;

      expect(getProjectsResult.status).to.eq(FetchResultStatus.OK);
      expect(getProjectsResult.data).to.eql([
        {
          projectId: 'myProjectId',
          projectName: 'myProjectName',
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
      ]);
    });
  });
});
