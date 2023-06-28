import { Request, Response } from 'express';
import { ppg } from 'main/services/publicProcurementGateway';

/**
 *
 * @Rediect
 * @endpoint '/oauth/login
 * @param req
 * @param res
 */
export const OAUTH_LOGIN = (req: Request, res: Response) => {
  const redirectURL = ppg.url.oAuth.login(req);

  res.redirect(redirectURL);
};
