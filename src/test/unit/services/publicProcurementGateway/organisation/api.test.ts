import { expect } from 'chai';
import { Interceptable, MockAgent, setGlobalDispatcher } from 'undici';
import { organisationAPI } from 'main/services/publicProcurementGateway/organisation/api';
import { FetchResultOK, FetchResultStatus } from 'main/services/types/helpers/api';
import { Organisation, OrganisationUsers, UserProfile } from 'main/services/types/publicProcurementGateway/organisation/api';

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

  describe('getOrganisation', () => {
    const orgId = 'org-1234';
    const path = `/organisation-profiles/${orgId}`;

    it('calls the get organisation endpoint with the correct url and headers', async () => {
      mockPool.intercept({
        method: 'GET',
        path: path,
        headers: headers
      }).reply(200, { identifier: { legalName: 'myOrg' } });

      const findOrganisationResult = await organisationAPI.getOrganisation(orgId) as FetchResultOK<Organisation>;

      expect(findOrganisationResult.status).to.eq(FetchResultStatus.OK);
      expect(findOrganisationResult.data).to.eql({ identifier: { legalName: 'myOrg' } });
    });

    it('calls the get organisation endpoint with the correct url, headers and query params', async () => {
      mockPool.intercept({
        method: 'GET',
        path: `${path}?my_param=myParam`,
        headers: headers
      }).reply(200, { identifier: { legalName: 'myOrg' } });

      const findOrganisationResult = await organisationAPI.getOrganisation(orgId, { my_param: 'myParam' }) as FetchResultOK<Organisation>;

      expect(findOrganisationResult.status).to.eq(FetchResultStatus.OK);
      expect(findOrganisationResult.data).to.eql({ identifier: { legalName: 'myOrg' } });
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

      const getOrganisationUsersResult = await organisationAPI.getOrganisationUsers(orgId) as FetchResultOK<OrganisationUsers>;

      expect(getOrganisationUsersResult.status).to.eq(FetchResultStatus.OK);
      expect(getOrganisationUsersResult.data).to.eql({ pageCount: 1, userList: [{ userName: 'myUsername', firstName: 'myFirstName', lastName: 'myLastName', telephone: 'myTelephone' }] });
    });

    it('calls the get organisation users endpoint with the correct url, headers and query params', async () => {
      mockPool.intercept({
        method: 'GET',
        path: `${path}?my_param=myParam`,
        headers: headers
      }).reply(200, { pageCount: 1, userList: [{ userName: 'myUsername', firstName: 'myFirstName', lastName: 'myLastName', telephone: 'myTelephone' }] });

      const getOrganisationUsersResult = await organisationAPI.getOrganisationUsers(orgId, { my_param: 'myParam' }) as FetchResultOK<OrganisationUsers>;

      expect(getOrganisationUsersResult.status).to.eq(FetchResultStatus.OK);
      expect(getOrganisationUsersResult.data).to.eql({ pageCount: 1, userList: [{ userName: 'myUsername', firstName: 'myFirstName', lastName: 'myLastName', telephone: 'myTelephone' }] });
    });
  });

  describe('getUserProfiles', () => {
    const userId = 'user-1234';
    const path = `/user-profiles?user-Id=${userId}`;

    it('calls the get user profile endpoint with the correct url and headers', async () => {
      mockPool.intercept({
        method: 'GET',
        path: path,
        headers: headers
      }).reply(200, { userName: 'myUsername', firstName: 'myFirstName', lastName: 'myLastName', telephone: 'myTelephone' });

      const findUserProfileResult = await organisationAPI.getUserProfiles(userId) as FetchResultOK<UserProfile>;

      expect(findUserProfileResult.status).to.eq(FetchResultStatus.OK);
      expect(findUserProfileResult.data).to.eql({ userName: 'myUsername', firstName: 'myFirstName', lastName: 'myLastName', telephone: 'myTelephone' });
    });

    it('calls the get user profile endpoint with the correct url, headers and query params', async () => {
      mockPool.intercept({
        method: 'GET',
        path: `${path}&my_param=myParam`,
        headers: headers
      }).reply(200, { userName: 'myUsername', firstName: 'myFirstName', lastName: 'myLastName', telephone: 'myTelephone' });

      const findUserProfileResult = await organisationAPI.getUserProfiles(userId, { my_param: 'myParam' }) as FetchResultOK<UserProfile>;

      expect(findUserProfileResult.status).to.eq(FetchResultStatus.OK);
      expect(findUserProfileResult.data).to.eql({ userName: 'myUsername', firstName: 'myFirstName', lastName: 'myLastName', telephone: 'myTelephone' });
    });
  });
});
