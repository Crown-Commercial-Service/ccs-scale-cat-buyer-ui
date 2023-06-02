import config from 'config';
import { AuthCredentials, EndPoints, RefreshData } from '../../types/publicProcurementGateway/oAuth/api';
import { genericFecthPost } from 'main/services/helpers/api';
import { FetchResult } from 'main/services/types/helpers/api';

const baseURL: string = process.env.AUTH_SERVER_BASE_URL;
const clientId: string = process.env.AUTH_SERVER_CLIENT_ID;
const clientSecret: string = process.env.AUTH_SERVER_CLIENT_SECRET;

const endPoints: EndPoints = {
  token: config.get('authenticationService.token-endpoint'),
  validateToken: config.get('authenticationService.token_validation_endpoint'),
};

const postRefreshToken = async (authCredentials: AuthCredentials): Promise<FetchResult<RefreshData>> => {
  return genericFecthPost<RefreshData>(
    baseURL,
    endPoints.token,
    {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: config.get('authenticationService.refresh_token'),
      ...authCredentials
    }
  );
};

const postValidateToken = async (accessToken: string): Promise<FetchResult<boolean>> => {
  return genericFecthPost<boolean>(
    baseURL,
    endPoints.validateToken,
    {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    undefined,
    [],
    {
      'client-id': clientId
    },
  );
};

const oAuthAPI = {
  refreshToken: postRefreshToken,
  validateToken: postValidateToken
};

export { oAuthAPI };
