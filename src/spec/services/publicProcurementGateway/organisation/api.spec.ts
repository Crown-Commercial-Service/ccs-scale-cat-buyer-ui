import { expect } from 'chai';
import { organisationAPI } from 'main/services/publicProcurementGateway/organisation/api';
import { FetchResultOK, FetchResultStatus } from 'main/services/helpers/api.types';
import { Organisation, OrganisationUsers, UserProfile } from 'main/services/publicProcurementGateway/organisation/api.types';
import { setupServer } from 'msw/node';
import { http } from 'msw';
import { matchHeaders, matchQueryParams, mswEmptyResponseWithStatus, mswJSONResponse } from 'spec/support/mswHelpers';

describe('Organisation API helpers', () => {
  const baseURL = process.env.CONCLAVE_WRAPPER_API_BASE_URL;
  const headers = {
    'content-type': 'application/json',
    'x-api-key': process.env.CONCLAVE_WRAPPER_API_KEY
  };
  const orgId = 'org-1234';
  const userId = 'user-1234';

  const restHandlers = [
    http.get(`${baseURL}/organisation-profile/${orgId}`, ({ request }) => {
      if (matchHeaders(request, headers)) {
        return mswJSONResponse({ identifier: { legalName: 'myOrgNoParam' } });
      }

      return mswEmptyResponseWithStatus(400);
    }),
    http.get(`${baseURL}/organisation-profile/${orgId}/users`, ({ request }) => {
      if (matchHeaders(request, headers)) {
        if(matchQueryParams(request, '')) {
          return mswJSONResponse({ pageCount: 1, userList: [{ userName: 'myUsernameNoParam', firstName: 'myFirstName', lastName: 'myLastName', telephone: 'myTelephone' }] });
        }
        if (matchQueryParams(request, '?currentPage=12')) {
          return mswJSONResponse({ pageCount: 1, userList: [{ userName: 'myUsername', firstName: 'myFirstName', lastName: 'myLastName', telephone: 'myTelephone' }] });
        }
      }

      return mswEmptyResponseWithStatus(400);
    }),
    http.get(`${baseURL}/user-profile`, ({ request }) => {
      if (matchHeaders(request, headers)) {
        return mswJSONResponse({ userName: 'myUsernameNoParam', firstName: 'myFirstName', lastName: 'myLastName', telephone: 'myTelephone' });
      }

      return mswEmptyResponseWithStatus(400);
    }),
  ];

  const server = setupServer(...restHandlers);

  before(() => server.listen({ onUnhandledRequest: 'error' }));

  after(() => server.close());

  afterEach(() => server.resetHandlers());

  describe('getOrganisation', () => {
    it('calls the get organisation endpoint with the correct url and headers', async () => {
      const findOrganisationResult = await organisationAPI.getOrganisation(orgId) as FetchResultOK<Organisation>;

      expect(findOrganisationResult.status).to.eq(FetchResultStatus.OK);
      expect(findOrganisationResult.data).to.eql({ identifier: { legalName: 'myOrgNoParam' } });
    });
  });

  describe('getOrganisationUsers', () => {
    it('calls the get organisation users endpoint with the correct url and headers', async () => {
      const getOrganisationUsersResult = await organisationAPI.getOrganisationUsers(orgId) as FetchResultOK<OrganisationUsers>;

      expect(getOrganisationUsersResult.status).to.eq(FetchResultStatus.OK);
      expect(getOrganisationUsersResult.data).to.eql({ pageCount: 1, userList: [{ userName: 'myUsernameNoParam', firstName: 'myFirstName', lastName: 'myLastName', telephone: 'myTelephone' }] });
    });

    it('calls the get organisation users endpoint with the correct url, headers and query params', async () => {
      const getOrganisationUsersResult = await organisationAPI.getOrganisationUsers(orgId, 12) as FetchResultOK<OrganisationUsers>;

      expect(getOrganisationUsersResult.status).to.eq(FetchResultStatus.OK);
      expect(getOrganisationUsersResult.data).to.eql({ pageCount: 1, userList: [{ userName: 'myUsername', firstName: 'myFirstName', lastName: 'myLastName', telephone: 'myTelephone' }] });
    });
  });

  describe('getUserProfiles', () => {
    it('calls the get user profile endpoint with the correct url and headers', async () => {
      const findUserProfileResult = await organisationAPI.getUserProfiles(userId) as FetchResultOK<UserProfile>;

      expect(findUserProfileResult.status).to.eq(FetchResultStatus.OK);
      expect(findUserProfileResult.data).to.eql({ userName: 'myUsernameNoParam', firstName: 'myFirstName', lastName: 'myLastName', telephone: 'myTelephone' });
    });
  });
});
