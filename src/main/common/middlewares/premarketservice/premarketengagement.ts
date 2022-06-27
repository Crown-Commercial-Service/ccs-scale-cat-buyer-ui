//@ts-nocheck
import { TokenDecoder } from './../../tokendecoder/tokendecoder';
import * as express from 'express';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { LoggTracer } from '../../logtracer/tracer';
const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('PreMarketEngagementMiddleware');

/**
 *
 * @Middleware
 * @param req
 * @param res
 * @param next
 */
export class PreMarketEngagementMiddleware {
  static PutPremarket = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { eventId, projectId, procurements } = req.session;
    const isAlreadyStarted = procurements.some(
      (proc: any) => proc.eventId === eventId && proc.procurementID === projectId && proc.started,
    );
    if (projectId && eventId && !isAlreadyStarted) {
      const { SESSION_ID, state } = req.cookies;
      const baseURL = `tenders/projects/${projectId}/events/${eventId}`;
      const eventTypeURL = `tenders/projects/${projectId}/events`;
      const eventTypesURL = `tenders/projects/${projectId}/event-types`;
      const eventType = req.session.selectedRoute;
      const _body = {
        eventType: eventType,
      };

      try {
        let getEventType = await TenderApi.Instance(SESSION_ID).get(eventTypeURL);
        const { data: eventTypes } = await TenderApi.Instance(SESSION_ID).get(eventTypesURL);
        req.session.haveFCA = eventTypes.some(event => event.type === 'FCA');
        getEventType = getEventType.data.filter(x => x.id ==eventId)[0]?.eventType
        if (getEventType === 'TBD') {
          const { data } = await TenderApi.Instance(SESSION_ID).put(baseURL, _body);
          req.session.currentEvent = data;
          const currentProcNum = procurements.findIndex(
            (proc: any) => proc.eventId === eventId && proc.procurementID === projectId,
          );
          req.session.procurements[currentProcNum].started = true;
          next();
        } else if (getEventType === 'FCA' || getEventType === 'DAA' || getEventType === 'FC') {
          const { data } = await TenderApi.Instance(SESSION_ID).post(eventTypeURL, _body);
          req.session.currentEvent = data;
          const currentProcNum = procurements.findIndex(
            (proc: any) => proc.eventId === eventId && proc.procurementID === projectId,
          );
          req.session.procurements[currentProcNum].started = true;
          next();
        }
      } catch (err) {
        LoggTracer.errorLogger(
          res,
          err,
          `${req.headers.host}${req.originalUrl}`,
          state,
          TokenDecoder.decoder(SESSION_ID),
          'Pre market engagement Service Api cannot be connected',
          true,
        );
      }
    } else {
      next();
    }
  };
}
