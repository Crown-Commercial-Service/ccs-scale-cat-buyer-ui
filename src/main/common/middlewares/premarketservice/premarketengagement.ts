//@ts-nocheck
import { TokenDecoder } from './../../tokendecoder/tokendecoder';
import * as express from 'express';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { LoggTracer } from '../../logtracer/tracer';
const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('PreMarketEngagementMiddleware');
import * as journyData from './../../../features/procurement/model/tasklist.json';
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

    if (req.session['isRFIComplete']) {
      const { SESSION_ID, state } = req.cookies;
      let BaseURL = `/tenders/projects/${req.session.projectId}/events`;
      let body_ = {
        "nonOCDS": {
          "eventType": req.session.selectedRoute
        }
      }
      try {
        const { data: newEventData } = await TenderApi.Instance(SESSION_ID).post(BaseURL, body_);
        if (newEventData != null && newEventData != undefined) {
          req.session['eventId'] = newEventData.id;
          req.session.procurements[0]['eventId'] = newEventData.id;
          req.session.procurements[0]['eventType'] = newEventData.eventType;
          req.session.procurements[0]['started'] = true;
          req.session.currentEvent = newEventData;

          const currentProcNum = procurements.findIndex(
            (proc: any) => proc.eventId === newEventData.id && proc.procurementID === projectId,
          );
          req.session.procurements[currentProcNum].started = true;
        }
      } catch (error) {
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

      try {
        const JourneyStatus = await TenderApi.Instance(SESSION_ID).get(`/journeys/${req.session.eventId}/steps`);
        req.session['journey_status'] = JourneyStatus?.data;
      } catch (journeyError) {
        const _body = {
          'journey-id': req.session.eventId,
          states: journyData.states,
        };
        if (journeyError.response.status == 404) {
          await TenderApi.Instance(SESSION_ID).post(`journeys`, _body);
          const JourneyStatus = await TenderApi.Instance(SESSION_ID).get(`journeys/${req.session.eventId}/steps`);
          req.session['journey_status'] = JourneyStatus?.data;
        }
      }
      req.session['isRFIComplete'] = false
      next();
    }
    else {
      const isAlreadyStarted = procurements.some(
        (proc: any) => proc.eventId === eventId && proc.procurementID === projectId && proc.started,
      );
      const currentEventForNextUse = req.session.selectedRoute === 'RFI' ? undefined : req.session.currentEventForNextUse
      if (projectId && eventId && !isAlreadyStarted && (currentEventForNextUse == undefined || currentEventForNextUse == null)) {
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
          getEventType = getEventType.data.filter(x => x.id == eventId)[0]?.eventType
          if (getEventType === 'TBD') {
            const { data } = await TenderApi.Instance(SESSION_ID).put(baseURL, _body);
            req.session.currentEvent = data;
            if (eventType === 'FC') {
              req.session.currentEventForNextUse = data;
            }
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
        if (currentEventForNextUse != undefined) {
          req.session.currentEvent = req.session.currentEventForNextUse;
        }
        next();
      }
    }

  };
}
