import { AuthCredentials, EndPoints, RefreshData } from '../../types/publicProcurementGateway/oAuth/api';
import { genericFecthPost } from 'main/services/helpers/api';
import { FetchResult } from 'main/services/types/helpers/api';

const baseURL = () => process.env.AUTH_SERVER_BASE_URL;
const clientId = () => process.env.AUTH_SERVER_CLIENT_ID;

const postRefreshToken = async (authCredentials: AuthCredentials): Promise<FetchResult<RefreshData>> => {
  return genericFecthPost<RefreshData>(
    {
      baseURL: baseURL(),
      path: EndPoints.TOKEN
    },
    {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    new URLSearchParams({
      client_id: clientId(),
      client_secret: process.env.AUTH_SERVER_CLIENT_SECRET,
      ...authCredentials
    }).toString()
  );
};

const postValidateToken = async (accessToken: string): Promise<FetchResult<boolean>> => {
  return genericFecthPost<boolean>(
    {
      baseURL: baseURL(),
      path: EndPoints.VALIDATE_TOKEN,
      queryParams: {
        'client-id': clientId()
      }
    },
    {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  );
};

const oAuthAPI = {
  postRefreshToken,
  postValidateToken
};

export { oAuthAPI };
