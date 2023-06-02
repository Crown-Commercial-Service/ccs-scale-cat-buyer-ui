import config from 'config';
import { EndPoints, LogInParams } from '../../types/publicProcurementGateway/oAuth/url';
import { Request } from 'express';
import { formatURL } from 'main/services/helpers/url';

const baseURL: string = process.env.AUTH_SERVER_BASE_URL;
const casURL: string = process.env.CAT_URL;
const clientId: string = process.env.AUTH_SERVER_CLIENT_ID;

const endPoints: EndPoints = {
  login: '/security/authorize',
  callback: '/receiver',
  logout: config.get('authenticationService.logout'),
  logoutCallback: config.get('authenticationService.logout_callback')
};

const loginURL = (req?: Request): string => {
  const logInParams: LogInParams = {
    response_type: 'code',
    scope: 'openid profile FirstName LastName  email  offline_access',
    client_id: clientId,
    redirect_uri: casURL + endPoints.callback
  };

  if (req !== undefined && req.session.supplier_qa_url) {
    logInParams.urlId = req.session.supplier_qa_url;
  }

  return formatURL(
    baseURL,
    endPoints.login,
    [],
    logInParams
  );
};

const logoutURL = (): string => {
  return formatURL(
    baseURL,
    endPoints.logout,
    [],
    {
      'client-id': clientId,
      'redirect-uri': `${casURL}${endPoints.logoutCallback}`
    }
  );
};

const oAuthURL = {
  login: loginURL,
  logout: logoutURL
};

export { oAuthURL };
