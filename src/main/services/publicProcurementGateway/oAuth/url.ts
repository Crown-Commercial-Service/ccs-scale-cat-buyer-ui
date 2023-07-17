import { EndPoints, LogInParams } from '../../types/publicProcurementGateway/oAuth/url';
import { Request } from 'express';
import { formatURL } from 'main/services/helpers/url';

const baseURL = () => process.env.AUTH_SERVER_BASE_URL;
const casURL = () => process.env.CAT_URL;
const clientId = () => process.env.AUTH_SERVER_CLIENT_ID;

const loginURL = (req?: Request): string => {
  const logInParams: LogInParams = {
    response_type: 'code',
    scope: 'openid profile FirstName LastName  email  offline_access',
    client_id: clientId(),
    redirect_uri: casURL() + EndPoints.LOGIN_CALLBACK
  };

  if (req !== undefined && req.session !== undefined && req.session.supplier_qa_url) {
    logInParams.urlId = req.session.supplier_qa_url;
  }

  return formatURL(
    {
      baseURL: baseURL(),
      path: EndPoints.LOGIN,
      queryParams: logInParams
    }
  );
};

const logoutURL = (): string => {
  return formatURL(
    {
      baseURL: baseURL(),
      path: EndPoints.LOGOUT,
      queryParams: {
        'client-id': clientId(),
        'redirect-uri': `${casURL()}${EndPoints.LOGOUT_CALLBACK}`
      }
    }
  );
};

const oAuthURL = {
  login: loginURL,
  logout: logoutURL
};

export { oAuthURL };
