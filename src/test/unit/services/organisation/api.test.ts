import { expect } from 'chai';
import { Interceptable, MockAgent, setGlobalDispatcher } from 'undici';
import { organisationAPI } from 'main/services/publicProcurementGateway/organisation/api';
import { FetchResultStatus } from 'main/services/types/helpers/api';

describe('Organisation API helpers', () => {
  const baseURL = process.env.CONCLAVE_WRAPPER_API_BASE_URL;
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': process.env.CONCLAVE_WRAPPER_API_KEY
  };
  let mockPool: Interceptable;

  beforeEach(() => {
    const mockAgent = new MockAgent();
    mockPool = mockAgent.get(baseURL);
    setGlobalDispatcher(mockAgent);
  });

  describe('findOrganisation', () => {
    const orgId = 'org-1234';
    const path = `/organisation-profiles/${orgId}`;

    it('calls the get organisation endpoint with the correct url and headers', async () => {
      mockPool.intercept({
        method: 'GET',
        path: path,
        headers: headers
      }).reply(200, { identifier: { legalName: 'myOrg' } });

      const findOrganisationResult = await organisationAPI.findOrganisation(orgId);

      expect(findOrganisationResult).to.eql({
        status: FetchResultStatus.OK,
        data: { identifier: { legalName: 'myOrg' } }
      });
    });

    it('calls the get organisation endpoint with the correct url, headers and query params', async () => {
      mockPool.intercept({
        method: 'GET',
        path: `${path}?my_param=myParam`,
        headers: headers
      }).reply(200, { identifier: { legalName: 'myOrg' } });

      const findOrganisationResult = await organisationAPI.findOrganisation(orgId, { my_param: 'myParam' });

      expect(findOrganisationResult).to.eql({
        status: FetchResultStatus.OK,
        data: { identifier: { legalName: 'myOrg' } }
      });
    });
  });

  describe('getOrganisationUsers', () => {
    const orgId = 'org-1234';
    const path = `/organisation-profiles/${orgId}/users`;

    it('calls the get organisation users endpoint with the correct url and headers', async () => {
      mockPool.intercept({
        method: 'GET',
        path: path,
        headers: headers
      }).reply(200, { pageCount: 1, userList: [{ userName: 'myUsername', firstName: 'myFirstName', lastName: 'myLastName', telephone: 'myTelephone' }] });

      const getOrganisationUsersResult = await organisationAPI.getOrganisationUsers(orgId);

      expect(getOrganisationUsersResult).to.eql({
        status: FetchResultStatus.OK,
        data: { pageCount: 1, userList: [{ userName: 'myUsername', firstName: 'myFirstName', lastName: 'myLastName', telephone: 'myTelephone' }] }
      });
    });

    it('calls the get organisation users endpoint with the correct url, headers and query params', async () => {
      mockPool.intercept({
        method: 'GET',
        path: `${path}?my_param=myParam`,
        headers: headers
      }).reply(200, { pageCount: 1, userList: [{ userName: 'myUsername', firstName: 'myFirstName', lastName: 'myLastName', telephone: 'myTelephone' }] });

      const getOrganisationUsersResult = await organisationAPI.getOrganisationUsers(orgId, { my_param: 'myParam' });

      expect(getOrganisationUsersResult).to.eql({
        status: FetchResultStatus.OK,
        data: { pageCount: 1, userList: [{ userName: 'myUsername', firstName: 'myFirstName', lastName: 'myLastName', telephone: 'myTelephone' }] }
      });
    });
  });

  describe('findUserProfile', () => {
    const userId = 'user-1234';
    const path = `/user-profiles?user-Id=${userId}`;

    it('calls the get user profile endpoint with the correct url and headers', async () => {
      mockPool.intercept({
        method: 'GET',
        path: path,
        headers: headers
      }).reply(200, { userName: 'myUsername', firstName: 'myFirstName', lastName: 'myLastName', telephone: 'myTelephone' });

      const findUserProfileResult = await organisationAPI.findUserProfile(userId);

      expect(findUserProfileResult).to.eql({
        status: FetchResultStatus.OK,
        data: { userName: 'myUsername', firstName: 'myFirstName', lastName: 'myLastName', telephone: 'myTelephone' }
      });
    });

    it('calls the get user profile endpoint with the correct url, headers and query params', async () => {
      mockPool.intercept({
        method: 'GET',
        path: `${path}&my_param=myParam`,
        headers: headers
      }).reply(200, { userName: 'myUsername', firstName: 'myFirstName', lastName: 'myLastName', telephone: 'myTelephone' });

      const findUserProfileResult = await organisationAPI.findUserProfile(userId, { my_param: 'myParam' });

      expect(findUserProfileResult).to.eql({
        status: FetchResultStatus.OK,
        data: { userName: 'myUsername', firstName: 'myFirstName', lastName: 'myLastName', telephone: 'myTelephone' }
      });
    });
  });
});
