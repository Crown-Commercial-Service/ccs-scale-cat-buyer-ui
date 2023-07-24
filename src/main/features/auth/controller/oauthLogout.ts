import { Handler, Request, Response } from 'express';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { logConstant } from '../../../common/logtracer/logConstant';
import { ppg } from 'main/services/publicProcurementGateway';

/**
 *
 * @Rediect
 * @endpoint '/oauth/logout
 * @param req
 * @param res
 */
export const OAUTH_LOGOUT: Handler = async (req: Request, res: Response) => {
  res.clearCookie('state');
  res.clearCookie('SESSION_ID');
  req.session['supplier_qa_url'] = undefined;

  const logoutURL = ppg.url.oAuth.logout();
  LoggTracer.infoLogger(null, logConstant.logoutSuccess, req);

  res.redirect(logoutURL);
};
