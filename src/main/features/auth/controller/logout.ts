import { rollbarLogger } from '@common/logger/rollbarLogger';
import { Logger } from '@hmcts/nodejs-logging';
import { Request, Response } from 'express';
import { ppg } from 'main/services/publicProcurementGateway';
const logger = Logger.getLogger('logout');

/**
 *
 * @Rediect
 * @endpoint '/logout
 * @param req
 * @param res
 */
export const LOGOUT = (req: Request, res: Response) => {
  req.session.destroy((error) => {
    rollbarLogger(error, logger);
  });

  const redirectURL = ppg.url.oAuth.login(req);

  res.redirect(redirectURL);
};
