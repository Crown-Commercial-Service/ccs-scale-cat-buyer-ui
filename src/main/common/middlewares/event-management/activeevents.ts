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
    const { state, SESSION_ID } = req.cookies;
    const baseActiveEventsURL = `/tenders/projects`;

    // Retrive active events
    const retrieveProjetActiveEventsPromise = TenderApi.Instance(access_token).get(baseActiveEventsURL);
    retrieveProjetActiveEventsPromise
      .then(data => {
        req.session.openProjectActiveEvents = data.data.sort((a, b) => (a.projectId < b.projectId) ? 1 : -1);
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
