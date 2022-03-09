import { TokenDecoder } from '../../tokendecoder/tokendecoder'
import * as express from 'express'
import { TenderApi } from '../../util/fetch/procurementService/TenderApiInstance'
import { LoggTracer } from '../../logtracer/tracer'
import { Message } from '../../../features/event-management/model/messages'

/**
 *
 * @Middleware
 * @param req
 * @param res
 * @param next
 */
export class MessageMiddleware {
  static GetEvents = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const access_token = req.session['access_token']
    const { state, SESSION_ID } = req.cookies;
    const { proc_id, event_id } = req.query;
    const baseMessageURL = `/tenders/projects/${proc_id}/events/${event_id}/messages`

    
    let draftMessage: Message = { }


    // Retrive Messages
    const retrieveMessagePromise = TenderApi.Instance(access_token).get(baseMessageURL)
    retrieveMessagePromise
      .then(data => {
        

        next();
      })
      .catch(err => {
        LoggTracer.errorLogger(
          res,
          err,
          `${req.headers.host}${req.originalUrl}`,
          state,
          TokenDecoder.decoder(SESSION_ID),
          'Tenders API for getting the list of Messages',
          false,
        );
        next();
      });
  };
}
