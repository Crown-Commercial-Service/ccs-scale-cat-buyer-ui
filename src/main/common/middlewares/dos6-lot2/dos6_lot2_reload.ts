import * as express from 'express';
import { LoggTracer } from '../../logtracer/tracer';

/**
 *
 * @Middleware
 * @param req
 * @param res
 * @param next
 */

export class dos6LotReload {
  static checkReload: express.Handler = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const agreementID = req.query.agreementId;
      const lotID = req.query.lotId;
      if (agreementID === 'RM1043.8' && lotID === '2') {
        res.redirect(`/agreement/lot?agreement_id=${agreementID}&lotNum=${lotID}`);
      } else {
        next();
      }
    } catch (error) {
      LoggTracer.errorLogger(
        res,
        error,
        `${req.headers.host}${req.originalUrl}`,
        null,
        null,
        'Dos6 lot 2 - Reload',
        false
      );
    }
  };
}
