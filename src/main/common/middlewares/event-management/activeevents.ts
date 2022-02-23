//@ts-nocheck
import { TokenDecoder } from '../../tokendecoder/tokendecoder';
import * as express from 'express';
import { TenderApi } from '../../util/fetch/procurementService/TenderApiInstance';
import { LoggTracer } from '../../logtracer/tracer';
import * as localActiveEventData from '../../../resources/content/event-management/local-active-events.json'
import * as localHistoricEventData from '../../../resources/content/event-management/local-hestoric-events.json'

/**
 *
 * @Middleware
 * @param req
 * @param res
 * @param next
 */
export class EventEngagementMiddleware {
  static GetEvents = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Assigning local JSON file as data for Active event. Once API endpoint is avalable, 
    // get the value from API and assign it to req.session.projectHistoricEvents. This will be accessed in dashboard controller.
    req.session.openProjectActiveEvents = localActiveEventData.default;
    next();

/*     const access_token = req.session['access_token'];
    const { state, SESSION_ID } = req.cookies;
    const baseActiveEventsURL = `/tenders/projects`;

    // Retrive active events
    const retrieveProjetActiveEventsPromise = TenderApi.Instance(access_token).get(baseActiveEventsURL);
    retrieveProjetActiveEventsPromise
      .then(data => {
        req.session.openProjectActiveEvents = data.data;
        next();
      })
      .catch(err => {
        // This if block can be removed once API endpoint is avalable for getting active project event details.
        if (err.response.status == 500 && (process.env.ROLLBAR_ENVIRONMENT !== 'production')) {
          req.session.openProjectActiveEvents = localActiveEventData.default;
          LoggTracer.errorLogger(
            res,
            err,
            `${req.headers.host}${req.originalUrl}`,
            state,
            TokenDecoder.decoder(SESSION_ID),
            'Event engagement Service Api cannot be connected - Tenders API for getting the list of Active Events',
            false,
          );
          next();
        } else {
          LoggTracer.errorLogger(
            res,
            err,
            `${req.headers.host}${req.originalUrl}`,
            state,
            TokenDecoder.decoder(SESSION_ID),
            'Event engagement Service Api cannot be connected - Tenders API for getting the list of Active Events',
            true,
          );
        }
      }); */
  };

  static GetHistoricEvents = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Assigning local JSON file as data for Historic event. Once API endpoint is avalable, 
    // get the value from API and assign it to req.session.projectHistoricEvents. This will be accessed in dashboard controller.
    req.session.projectHistoricEvents = localHistoricEventData.default;
    next();
    
    /* const access_token = req.session['access_token'];
    const baseHistoricEventsURL = `/tenders/projects`; // This endpoint has to be updated with correct endpoint to get the historic events
    const { state, SESSION_ID } = req.cookies; */

    // Retrive historic events fron API 
    /* const retrieveProjetEventsPromise = TenderApi.Instance(access_token).get(baseHistoricEventsURL);
    retrieveProjetEventsPromise
      .then(data => {
        req.session.projectHistoricEvents = data.data;
        next();
      })
      .catch(err => {
        if (err.response.status == 500 && (process.env.ROLLBAR_ENVIRONMENT !== 'production')) {
          req.session.projectHistoricEvents = localHistoricEventData.default;
          LoggTracer.errorLogger(
            res,
            err,
            `${req.headers.host}${req.originalUrl}`,
            state,
            TokenDecoder.decoder(SESSION_ID),
            'Event engagement Service Api cannot be connected - Tenders API for getting the list of Historic Events',
            false,
          );
          next();
        } else {
          LoggTracer.errorLogger(
            res,
            err,
            `${req.headers.host}${req.originalUrl}`,
            state,
            TokenDecoder.decoder(SESSION_ID),
            'Event engagement Service Api cannot be connected - Tenders API for getting the list of Historic Events',
            true,
          );
        }
      }); */
  };

}
