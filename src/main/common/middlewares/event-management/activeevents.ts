import { TokenDecoder } from '../../tokendecoder/tokendecoder'
import * as express from 'express'
import { TenderApi } from '../../util/fetch/procurementService/TenderApiInstance'
import { LoggTracer } from '../../logtracer/tracer'
import { ActiveEvents } from '../models/active-events'

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
    let draftActiveEvent: ActiveEvents = {
      projectId: 0,
      projectName: '',
      agreementId: '',
      agreementName: '',
      lotId: '',
      lotName: '',
      activeEvent: undefined
    }


        req.session['agreement_id'] = '';
        req.session['agreementName'] = '';
        req.session['lotNum'] = '';
        req.session['releatedContent'] = '';
        req.session['journey_status'] = '';
        req.session['procurements'] = [];
        req.session['searched_user'] = [];
        req.session['agreementEndDate'] = '';
        req.session['agreementDescription'] = '';
        req.session['nonOCDSList'] = '';
        req.session['selectedRoute'] = '';
        req.session['caSelectedRoute'] = '';
        req.session['fcSelectedRoute'] = '';
        req.session['designations'] = [];
        req.session['designationsLevel2'] = [];
        req.session['tableItems'] = [];
        req.session['dimensions'] = [];
        req.session['weightingRange'] = {};
        req.session['errorTextSumary'] = [];
        req.session['CapAss'] = {};
        req.session['isTcUploaded'] = true;
        req.session['UIDate']=null;
    // Retrive active events
    const retrieveProjetActiveEventsPromise = TenderApi.Instance(access_token).get(baseActiveEventsURL)
    retrieveProjetActiveEventsPromise
      .then(data => {
        const events: ActiveEvents[] = data.data.sort((a: { projectId: number }, b: { projectId: number }) => (a.projectId < b.projectId) ? 1 : -1)
        for (let i = 0; i < events.length; i++) {
          // eventType = RFI & EOI (Active and historic events)
          if (events[i].activeEvent !=undefined && events[i].activeEvent?.status != undefined && (events[i].activeEvent.eventType == 'RFI' || events[i].activeEvent.eventType == 'EOI')) {
            if (events[i].activeEvent?.dashboardStatus == 'COMPLETE' || events[i].activeEvent?.dashboardStatus == 'CLOSED' ) {
              // Historical Events
              historicalEvents.push(events[i])
            } else if (events[i].activeEvent?.dashboardStatus == 'IN-PROGRESS') {          
                draftActiveEvent = events[i]
                draftActiveEvent.activeEvent.status = 'In-Progress'
                activeEvents.push(draftActiveEvent)
              } else if (events[i].activeEvent?.dashboardStatus == 'PUBLISHED') {
                draftActiveEvent = events[i]
                draftActiveEvent.activeEvent.status = 'Published'
                activeEvents.push(draftActiveEvent)
              } else if (events[i].activeEvent?.dashboardStatus == 'TO-BE-EVALUATED') {
                draftActiveEvent = events[i]
                draftActiveEvent.activeEvent.status = 'To Be Evaluated'
                activeEvents.push(draftActiveEvent)
              } else if (events[i].activeEvent?.dashboardStatus == 'EVALUATING') {
                draftActiveEvent = events[i]
                draftActiveEvent.activeEvent.status = 'Evaluating'
                activeEvents.push(draftActiveEvent)
               } else if (events[i].activeEvent?.dashboardStatus == 'EVALUATED') {
                draftActiveEvent = events[i]
                draftActiveEvent.activeEvent.status = 'Evaluated'
                activeEvents.push(draftActiveEvent)
               }  else {
                activeEvents.push(events[i])
              }           
          } else if (events[i].activeEvent?.eventType == 'TBD') {
            draftActiveEvent = events[i]
            draftActiveEvent.activeEvent.status = 'In Progress'
            activeEvents.push(draftActiveEvent)
          }
   // eventType = FCA & DAA (Active and historic events)
   else if (events[i].activeEvent?.status != undefined && (events[i].activeEvent?.eventType == 'FCA' || events[i].activeEvent?.eventType == 'DAA')) {
    if (events[i].activeEvent?.dashboardStatus == 'EVALUATED' || events[i].activeEvent?.dashboardStatus == 'CLOSED' ) {
      // Historical Events
      historicalEvents.push(events[i])
    } else if (events[i].activeEvent?.dashboardStatus == 'ASSESSMENT') {          
      draftActiveEvent = events[i]
      draftActiveEvent.activeEvent.status = 'Assessment'
      activeEvents.push(draftActiveEvent)
    }else {
      activeEvents.push(events[i])
                   }
    }
          // eventType = FC & DA (Active and historic events)
          else if (events[i].activeEvent?.status != undefined && (events[i].activeEvent?.eventType == 'FC' || events[i].activeEvent?.eventType == 'DA')) {
            if (events[i].activeEvent?.dashboardStatus == 'COMPLETE' || events[i].activeEvent?.dashboardStatus == 'CLOSED' ) {
              // Historical Events
              historicalEvents.push(events[i])
            } else if (events[i].activeEvent?.dashboardStatus == 'IN-PROGRESS') {          
              draftActiveEvent = events[i]
              draftActiveEvent.activeEvent.status = 'In-Progress'
              activeEvents.push(draftActiveEvent)
            } else if (events[i].activeEvent?.dashboardStatus == 'PUBLISHED') {
              draftActiveEvent = events[i]
              draftActiveEvent.activeEvent.status = 'Published'
              activeEvents.push(draftActiveEvent)
            } else if (events[i].activeEvent?.dashboardStatus == 'TO-BE-EVALUATED') {
              draftActiveEvent = events[i]
              draftActiveEvent.activeEvent.status = 'To Be Evaluated'
              activeEvents.push(draftActiveEvent)
            } else if (events[i].activeEvent?.dashboardStatus == 'EVALUATING') {
              draftActiveEvent = events[i]
              draftActiveEvent.activeEvent.status = 'Evaluating'
              activeEvents.push(draftActiveEvent)
             } else if (events[i].activeEvent?.dashboardStatus == 'EVALUATED') {
              draftActiveEvent = events[i]
              draftActiveEvent.activeEvent.status = 'Evaluated'
              activeEvents.push(draftActiveEvent)
             } else if (events[i].activeEvent?.dashboardStatus == 'AWARDED') {
              draftActiveEvent = events[i]
              draftActiveEvent.activeEvent.status = 'Awarded'
              activeEvents.push(draftActiveEvent)
             }else {
 activeEvents.push(events[i])
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
