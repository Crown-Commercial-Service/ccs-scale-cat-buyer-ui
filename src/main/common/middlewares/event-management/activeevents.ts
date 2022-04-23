import { TokenDecoder } from '../../tokendecoder/tokendecoder'
import * as express from 'express'
import { TenderApi } from '../../util/fetch/procurementService/TenderApiInstance'
import { LoggTracer } from '../../logtracer/tracer'
import { ActiveEvents } from '../models/active-events'
import moment from 'moment';

/**
 *
 * @Middleware
 * @param req
 * @param res
 * @param next
 */
export class EventEngagementMiddleware {
  static GetEvents = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const access_token = req.session['access_token']
    const { state, SESSION_ID } = req.cookies;
    const baseActiveEventsURL = `/tenders/projects`

    const activeEvents: ActiveEvents[] = []
    const historicalEvents: ActiveEvents[] = []
    const today = moment(new Date(), 'DD/MM/YYYY');
    let draftActiveEvent: ActiveEvents = {
      projectId: 0,
      projectName: '',
      agreementId: '',
      agreementName: '',
      lotId: '',
      lotName: '',
      activeEvent: undefined
    }

    // Retrive active events
    const retrieveProjetActiveEventsPromise = TenderApi.Instance(access_token).get(baseActiveEventsURL)
    retrieveProjetActiveEventsPromise
      .then(data => {
        const events: ActiveEvents[] = data.data.sort((a: { projectId: number }, b: { projectId: number }) => (a.projectId < b.projectId) ? 1 : -1)
        for (let i = 0; i < events.length; i++) {
          // eventType = RFI & EOI (Active and historic events)
          if (events[i].activeEvent.status != undefined && (events[i].activeEvent.eventType == 'RFI' || events[i].activeEvent.eventType == 'EOI')) {
            if (events[i].activeEvent.status == 'withdrawn' || events[i].activeEvent.status == 'cancelled') {
              // Historical Events
              historicalEvents.push(events[i])
            } else if (events[i].activeEvent.status == 'planning') {
              // tenderPeriod": "endDate" - endDate is {blank} -- Unpublished
              if (events[i].activeEvent.tenderPeriod?.endDate == undefined) {
                draftActiveEvent = events[i]
                draftActiveEvent.activeEvent.status = 'Unpublished'
                activeEvents.push(draftActiveEvent)
              } else if (moment(events[i].activeEvent.tenderPeriod?.endDate).isAfter(today)) {
                // Today < "tenderPeriod": "endDate" -- Published
                draftActiveEvent = events[i]
                draftActiveEvent.activeEvent.status = 'Published'
                activeEvents.push(draftActiveEvent)
              } else if (moment(events[i].activeEvent.tenderPeriod?.endDate).isSameOrBefore(today)) {
                // Today >= "tenderPeriod": "endDate" -- Response period closed
                draftActiveEvent = events[i]
                draftActiveEvent.activeEvent.status = 'Response period closed'
                activeEvents.push(draftActiveEvent)
              } else {
                activeEvents.push(events[i])
              }
            }
          } else if (events[i].activeEvent.eventType == 'TBD' || events[i].activeEvent.eventType == 'FCA') {
            draftActiveEvent = events[i]
            draftActiveEvent.activeEvent.status = 'Unpublished'
            activeEvents.push(draftActiveEvent)
          }
          // eventType = FC & DA (Active and historic events)
          else if (events[i].activeEvent.status != undefined && (events[i].activeEvent.eventType == 'FC' || events[i].activeEvent.eventType == 'DA')) {
            if (events[i].activeEvent.status == 'withdrawn' || events[i].activeEvent.status == 'cancelled') {
              historicalEvents.push(events[i])
            } else if (events[i].activeEvent.status == 'planning' || events[i].activeEvent.status == 'complete' || events[i].activeEvent.status == 'active') {
              // tenderPeriod": "endDate" - endDate is {blank} -- Unpublished
              if (events[i].activeEvent.tenderPeriod?.endDate == undefined && events[i].activeEvent.eventType == 'planning') {
                draftActiveEvent = events[i]
                draftActiveEvent.activeEvent.status = 'Unpublished'
                activeEvents.push(draftActiveEvent)
              } else if (moment(events[i].activeEvent.tenderPeriod?.endDate).isAfter(today) && events[i].activeEvent.eventType == 'active') {
                // Today < "tenderPeriod": "endDate" -- Published
                draftActiveEvent = events[i]
                draftActiveEvent.activeEvent.status = 'Published'
                activeEvents.push(draftActiveEvent)
              } else if (moment(events[i].activeEvent.tenderPeriod?.endDate).isSameOrBefore(today) && events[i].activeEvent.eventType == 'active') {
                // Today >= "tenderPeriod": "endDate" -- Response period closed
                draftActiveEvent = events[i]
                draftActiveEvent.activeEvent.status = 'Response period closed'
                activeEvents.push(draftActiveEvent)
              } else if (events[i].activeEvent.eventType == 'complete') {
                // Event Status - Complete -- Final Evaluation
                draftActiveEvent = events[i]
                draftActiveEvent.activeEvent.status = 'Final Evaluation'
                activeEvents.push(draftActiveEvent)
              } else {
                activeEvents.push(events[i])
              }
            }
          } 
        }
        req.session.openProjectActiveEvents = activeEvents;
        req.session.historicalEvents = historicalEvents;

        next();
      })
      .catch(err => {
        LoggTracer.errorLogger(
          res,
          err,
          `${req.headers.host}${req.originalUrl}`,
          state,
          TokenDecoder.decoder(SESSION_ID),
          'Tenders API for getting the list of Active Events',
          false,
        );
        next();
      });
  };
}
