import { expect } from 'chai';
import { organisationAPI } from 'main/services/publicProcurementGateway/organisation/api';
import { FetchResultOK, FetchResultStatus } from 'main/services/types/helpers/api';
import { Organisation, OrganisationUsers, UserProfile } from 'main/services/types/publicProcurementGateway/organisation/api';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { matchHeaders, matchQueryParams } from 'spec/support/mswMatchers';

describe('Organisation API helpers', () => {
  const baseURL = process.env.CONCLAVE_WRAPPER_API_BASE_URL;
  const headers = {
    'content-type': 'application/json',
    'x-api-key': process.env.CONCLAVE_WRAPPER_API_KEY
  };
  const orgId = 'org-1234';
  const userId = 'user-1234';

  const restHandlers = [
    rest.get(`${baseURL}/organisation-profile/${orgId}`, (req, res, ctx) => {
      if (matchHeaders(req, headers)) {
        return res(ctx.status(200), ctx.json({ identifier: { legalName: 'myOrgNoParam' } }));
      }

      return res(ctx.status(400));
    }),
    rest.get(`${baseURL}/organisation-profile/${orgId}/users`, (req, res, ctx) => {
      if (matchHeaders(req, headers)) {
        if(matchQueryParams(req, '')) {
          return res(ctx.status(200), ctx.json({ pageCount: 1, userList: [{ userName: 'myUsernameNoParam', firstName: 'myFirstName', lastName: 'myLastName', telephone: 'myTelephone' }] }));
        }
        if (matchQueryParams(req, '?currentPage=12')) {
          return res(ctx.status(200), ctx.json({ pageCount: 1, userList: [{ userName: 'myUsername', firstName: 'myFirstName', lastName: 'myLastName', telephone: 'myTelephone' }] }));
        }
      }

      return res(ctx.status(400));
    }),
    rest.get(`${baseURL}/user-profile`, (req, res, ctx) => {
      if (matchHeaders(req, headers)) {
        return res(ctx.status(200), ctx.json({ userName: 'myUsernameNoParam', firstName: 'myFirstName', lastName: 'myLastName', telephone: 'myTelephone' }));
      }

      return res(ctx.status(400));
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
