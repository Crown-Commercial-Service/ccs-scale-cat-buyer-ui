import { expect } from 'chai';
import { oAuthAPI } from 'main/services/publicProcurementGateway/oAuth/api';
import { Interceptable, MockAgent, setGlobalDispatcher } from 'undici';
import { AuthCredentials, RefreshData } from 'main/services/types/publicProcurementGateway/oAuth/api';
import { FetchResultOK, FetchResultStatus } from 'main/services/types/helpers/api';

describe('OAuth API helpers', () => {
  const baseURL = process.env.AUTH_SERVER_BASE_URL;
  const clientId = process.env.AUTH_SERVER_CLIENT_ID;
  const clientSecret = process.env.AUTH_SERVER_CLIENT_SECRET;
  let mockPool: Interceptable;

  beforeEach(() => {
    const mockAgent = new MockAgent();
    mockPool = mockAgent.get(baseURL);
    setGlobalDispatcher(mockAgent);
  });

  describe('postRefreshToken', () => {
    it('calls the post refresh token endpoint with the correct url and headers', async () => {
      const authCredentials: AuthCredentials = {
        refresh_token: 'myRefreshToken',
        code: 'myCode',
        redirect_uri: 'myRedirectUri',
        response_type: 'myResponseType'
      };
      mockPool.intercept({
        method: 'POST',
        path: '/security/token',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'refresh_token',
          ...authCredentials
        })
      }).reply(200, { access_token: 'myAccessToken', session_state: 'mySessionState', refresh_token: 'myRefreshToken' });

      const refreshTokenResult = await oAuthAPI.postRefreshToken(authCredentials) as FetchResultOK<RefreshData>;

      expect(refreshTokenResult.status).to.eq(FetchResultStatus.OK);
      expect(refreshTokenResult.data).to.eql({ access_token: 'myAccessToken', session_state: 'mySessionState', refresh_token: 'myRefreshToken' });
    });

    it('calls the post refresh token endpoint with the correct url and headers when there are less auth credentials', async () => {
      const authCredentials: AuthCredentials = {
        refresh_token: 'myRefreshToken',
      };
      mockPool.intercept({
        method: 'POST',
        path: '/security/token',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'refresh_token',
          ...authCredentials
        })
      }).reply(200, { access_token: 'myAccessToken', session_state: 'mySessionState', refresh_token: 'myRefreshToken' });

      const refreshTokenResult = await oAuthAPI.postRefreshToken(authCredentials) as FetchResultOK<RefreshData>;

      expect(refreshTokenResult.status).to.eq(FetchResultStatus.OK);
      expect(refreshTokenResult.data).to.eql({ access_token: 'myAccessToken', session_state: 'mySessionState', refresh_token: 'myRefreshToken' });
    });
  });

  describe('postValidateToken', () => {
    it('calls the post refresh token endpoint with the correct url and headers', async () => {
      const accessToken = 'myAccessToken';
      mockPool.intercept({
        method: 'POST',
        path: `/security/tokens/validation?client-id=${clientId}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
      }).reply(200, 'true');

      const validateTokenResult = await oAuthAPI.postValidateToken(accessToken) as FetchResultOK<boolean>;

      expect(validateTokenResult.status).to.eq(FetchResultStatus.OK);
      expect(validateTokenResult.data).to.eq(true);
    });
  });
});
