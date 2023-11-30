import { expect } from 'chai';
import { oAuthAPI } from 'main/services/publicProcurementGateway/oAuth/api';
import { AuthCredentials, GrantType, RefreshData } from 'main/services/types/publicProcurementGateway/oAuth/api';
import { FetchResultOK, FetchResultStatus } from 'main/services/types/helpers/api';
import { setupServer } from 'msw/node';
import { http } from 'msw';
import { matchHeaders, matchQueryParams, mswEmptyResponseWithStatus, mswJSONResponse } from 'spec/support/mswHelpers';

describe('OAuth API helpers', () => {
  const baseURL = process.env.AUTH_SERVER_BASE_URL;
  const clientId = process.env.AUTH_SERVER_CLIENT_ID;
  const clientSecret = process.env.AUTH_SERVER_CLIENT_SECRET;
  const accessToken = 'myAccessToken';

  const postRefreshTokenAuthCredentials: AuthCredentials = {
    grant_type: GrantType.AUTHORIZATION_CODE,
    code: 'myCode',
    redirect_uri: 'myRedirectUri',
  };
  const postRefreshTokenAuthText = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    ...postRefreshTokenAuthCredentials
  }).toString();
  const postRefreshTokenAuthData = { access_token: 'myAccessToken', session_state: 'mySessionState', refresh_token: 'myRefreshToken', type: 'auth' };

  const postRefreshTokenRefreshCredentials: AuthCredentials = {
    grant_type: GrantType.REFRESH_TOKEN,
    refresh_token: 'myRefreshToken',
  };
  const postRefreshTokenRefreshText = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    ...postRefreshTokenRefreshCredentials
  }).toString();
  const postRefreshTokenRefreshData = { access_token: 'myAccessToken', session_state: 'mySessionState', refresh_token: 'myRefreshToken', type: 'refresh' };

  const restHandlers = [
    http.post(`${baseURL}/security/token`, async ({ request }) => {
      if (matchHeaders(request, { 'content-type': 'application/x-www-form-urlencoded' })) {
        const text = await request.text();

        if (text === postRefreshTokenAuthText) {
          return mswJSONResponse(postRefreshTokenAuthData);
        }

        if (text === postRefreshTokenRefreshText) {
          return mswJSONResponse(postRefreshTokenRefreshData);
        }
      }

      return mswEmptyResponseWithStatus(400);
    }),
    http.post(`${baseURL}/security/tokens/validation`, ({ request }) => {
      if (
        matchHeaders(request, { 'content-type': 'application/json', authorization: `Bearer ${accessToken}` }) &&
        matchQueryParams(request, `?client-id=${clientId}`)
      ) return mswJSONResponse(true);

      return mswEmptyResponseWithStatus(400);
    }),
  ];

  const server = setupServer(...restHandlers);

  before(() => server.listen({ onUnhandledRequest: 'error' }));

  after(() => server.close());

  afterEach(() => server.resetHandlers());

  describe('postRefreshToken', () => {
    it('calls the post refresh token endpoint with the correct url and headers when the request is for authorisation', async () => {
      const refreshTokenResult = await oAuthAPI.postRefreshToken(postRefreshTokenAuthCredentials) as FetchResultOK<RefreshData>;

      expect(refreshTokenResult.status).to.eq(FetchResultStatus.OK);
      expect(refreshTokenResult.data).to.eql(postRefreshTokenAuthData);
    });

    it('calls the post refresh token endpoint with the correct url and headers when the request is for a refresh', async () => {
      const refreshTokenResult = await oAuthAPI.postRefreshToken(postRefreshTokenRefreshCredentials) as FetchResultOK<RefreshData>;

      expect(refreshTokenResult.status).to.eq(FetchResultStatus.OK);
      expect(refreshTokenResult.data).to.eql(postRefreshTokenRefreshData);
    });
  });

  describe('postValidateToken', () => {
    it('calls the post refresh token endpoint with the correct url and headers', async () => {
      const validateTokenResult = await oAuthAPI.postValidateToken(accessToken) as FetchResultOK<boolean>;

      expect(validateTokenResult.status).to.eq(FetchResultStatus.OK);
      expect(validateTokenResult.data).to.eq(true);
    });
  });
});
