//@ts-nocheck
import { TokenDecoder } from '../../tokendecoder/tokendecoder';
import * as express from 'express';
import { TenderApi } from '../../util/fetch/procurementService/TenderApiInstance';
import { LoggTracer } from '../../logtracer/tracer';


/**
 *
 * @Middleware
 * @param req
 * @param res
 * @param next
 */
export class EventEngagementMiddleware {
  static GetEvents = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const access_token = req.session['access_token'];
      const baseURL = `/tenders/projects`;

      const retrieveProjetEventsPromise = TenderApi.Instance(access_token).get(baseURL);
      retrieveProjetEventsPromise
        .then(data => {
          req.session.openProjectActiveEvents = data.data;
          next();
        })
        .catch(err => {
          LoggTracer.errorLogger(
            res,
            err,
            `${req.headers.host}${req.originalUrl}`,
            state,
            TokenDecoder.decoder(SESSION_ID),
            'Event engagement Service Api cannot be connected - Tenders API for getting the list of Active Events',
            true,
          );
        });
  };
}
