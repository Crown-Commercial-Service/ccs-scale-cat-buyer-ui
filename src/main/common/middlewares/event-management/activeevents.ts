import { TokenDecoder } from '../../tokendecoder/tokendecoder'
import * as express from 'express'
import { TenderApi } from '../../util/fetch/procurementService/TenderApiInstance'
import { LoggTracer } from '../../logtracer/tracer'
import { ActiveEvents } from '../models/active-events'
import { eventStatus } from '../../util/eventStatus';

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
    // let singleEvent: ActiveEvents = {
    //   projectId: 0,
    //   projectName: '',
    //   agreementId: '',
    //   agreementName: '',
    //   lotId: '',
    //   lotName: '',
    //   activeEvent: undefined
    // }

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
    req.session['isTcUploaded'] = false;
    req.session['isPricingUploaded'] = false;
    req.session['UIDate'] = null;
    // Retrive active events
    const retrieveProjetActiveEventsPromise = TenderApi.Instance(access_token).get(baseActiveEventsURL)
    retrieveProjetActiveEventsPromise
      .then(async (data) => {
        const events: ActiveEvents[] = data.data.sort((a: { projectId: number }, b: { projectId: number }) => (a.projectId < b.projectId) ? 1 : -1)
        for (let i = 0; i < events.length; i++) {
          // eventType = RFI & EOI (Active and historic events)
          const eventsURL = `tenders/projects/${events[i].projectId}/events`;
          let getEvents = await TenderApi.Instance(SESSION_ID).get(eventsURL);
          let getEventsData = getEvents.data;
          for (let j = 0; j < getEventsData.length; j++) {
            //let singleEvent=undefined;
            //*NOTE THIS CONDATION ADDED FOR G-CLOUD EVENT NOT TO DISPLAY
            if (events[i].agreementId !='RM1557.12') {
            
            let singleEvent: ActiveEvents = {
              projectId: events[i].projectId,
              projectName: events[i].projectName,
              agreementId: events[i].agreementId,
              agreementName: events[i].agreementName,
              lotId: events[i].lotId,
              lotName: events[i].lotName,
              activeEvent: getEventsData[j]
            }
            //singleEvent=events[i];
            //singleEvent.activeEvent=getEventsData[j];
            if (singleEvent.activeEvent != undefined && singleEvent.activeEvent?.status != undefined && (singleEvent.activeEvent.eventType == 'RFI' || singleEvent.activeEvent.eventType == 'EOI')) {
              if (singleEvent.activeEvent?.dashboardStatus == 'COMPLETE' || singleEvent.activeEvent?.dashboardStatus == 'CLOSED'
              || (singleEvent.activeEvent?.dashboardStatus=='UNKNOWN' && singleEvent.activeEvent?.status=='withdrawn')) {
                // Historical Events
                historicalEvents.push(singleEvent)
              } else if (singleEvent.activeEvent?.dashboardStatus == 'IN-PROGRESS') {
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = 'In-Progress'
                activeEvents.push(draftActiveEvent)
              } else if (singleEvent.activeEvent?.dashboardStatus == 'PUBLISHED') {
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = 'Published'
                activeEvents.push(draftActiveEvent)
              } else if (singleEvent.activeEvent?.dashboardStatus == 'TO-BE-EVALUATED') {
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = 'To Be Evaluated'
                activeEvents.push(draftActiveEvent)
              } else if (singleEvent.activeEvent?.dashboardStatus == 'EVALUATING') {
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = 'Evaluating'
                activeEvents.push(draftActiveEvent)
              } else if (singleEvent.activeEvent?.dashboardStatus == 'EVALUATED') {
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = 'Evaluated'
                activeEvents.push(draftActiveEvent)
              }
              else if (singleEvent.activeEvent?.dashboardStatus == 'PRE-AWARD') {
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = 'Pre-award'
                activeEvents.push(draftActiveEvent)
              }
              else if (singleEvent.activeEvent?.dashboardStatus == 'AWARDED') {
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = 'Awarded'
                activeEvents.push(draftActiveEvent)
              } else {
                activeEvents.push(singleEvent)
              }
            } else if (singleEvent.activeEvent?.eventType == 'TBD') {
              if (singleEvent.activeEvent?.dashboardStatus == 'COMPLETE' || singleEvent.activeEvent?.dashboardStatus == 'CLOSED')
              {
                historicalEvents.push(singleEvent)
              }
              else{
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = 'In-Progress'
                activeEvents.push(draftActiveEvent)
              }           
            }
            // eventType = FCA & DAA (Active and historic events)
            else if (singleEvent.activeEvent?.status != undefined && (singleEvent.activeEvent?.eventType == 'FCA' || singleEvent.activeEvent?.eventType == 'DAA')) {
              if (singleEvent.activeEvent?.dashboardStatus == 'COMPLETE' || singleEvent.activeEvent?.dashboardStatus == 'CLOSED') {
                // Historical Events
                historicalEvents.push(singleEvent)
              } else if (singleEvent.activeEvent?.dashboardStatus == 'ASSESSMENT') {
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = 'Assessment'
                activeEvents.push(draftActiveEvent)
              } else if (singleEvent.activeEvent?.dashboardStatus == 'EVALUATED') {
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = 'Evaluated'
                activeEvents.push(draftActiveEvent)
              }
              else if (singleEvent.activeEvent?.dashboardStatus == 'PRE-AWARD') {
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = 'Pre-award'
                activeEvents.push(draftActiveEvent)
              }
              else if (singleEvent.activeEvent?.dashboardStatus == 'AWARDED') {
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = 'Awarded'
                activeEvents.push(draftActiveEvent)
              } else {
                activeEvents.push(singleEvent)
              }
            }
            // eventType = FC & DA (Active and historic events)
            else if (singleEvent.activeEvent?.status != undefined && (singleEvent.activeEvent?.eventType == 'FC' || singleEvent.activeEvent?.eventType == 'DA')) {
              if (singleEvent.activeEvent?.dashboardStatus == 'COMPLETE' || singleEvent.activeEvent?.dashboardStatus == 'CLOSED' 
              || (singleEvent.activeEvent?.dashboardStatus=='UNKNOWN' && singleEvent.activeEvent?.status=='withdrawn')) {
                // Historical Events
                historicalEvents.push(singleEvent)
              } else if (singleEvent.activeEvent?.dashboardStatus == 'IN-PROGRESS') {
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = 'In-Progress'
                activeEvents.push(draftActiveEvent)
              } else if (singleEvent.activeEvent?.dashboardStatus == 'PUBLISHED') {
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = 'Published'
                activeEvents.push(draftActiveEvent)
              } else if (singleEvent.activeEvent?.dashboardStatus == 'TO-BE-EVALUATED') {
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = 'To Be Evaluated'
                activeEvents.push(draftActiveEvent)
              } else if (singleEvent.activeEvent?.dashboardStatus == 'EVALUATING') {
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = 'Evaluating'
                activeEvents.push(draftActiveEvent)
              } else if (singleEvent.activeEvent?.dashboardStatus == 'EVALUATED') {
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = 'Evaluated'
                activeEvents.push(draftActiveEvent)
              }
              else if (singleEvent.activeEvent?.dashboardStatus == 'AWARDED') {
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = 'Awarded'
                activeEvents.push(draftActiveEvent)
              }
              else if (singleEvent.activeEvent?.dashboardStatus == 'PRE-AWARD') {
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = 'Pre-award'
                activeEvents.push(draftActiveEvent)
              } else if (singleEvent.activeEvent?.dashboardStatus == eventStatus.Awarded) {
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = eventStatus.Awarded
                activeEvents.push(draftActiveEvent)
              } else {
                activeEvents.push(singleEvent)
              }
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
  static GetEventList =async (req: express.Request, res: express.Response) => {
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
    req.session['isTcUploaded'] = false;
    req.session['isPricingUploaded'] = false;
    req.session['UIDate'] = null;
    // Retrive active events
    const retrieveProjetActiveEventsPromise = TenderApi.Instance(access_token).get(baseActiveEventsURL)
    retrieveProjetActiveEventsPromise
      .then(async (data) => {
        const events: ActiveEvents[] = data.data.sort((a: { projectId: number }, b: { projectId: number }) => (a.projectId < b.projectId) ? 1 : -1)
        for (let i = 0; i < events.length; i++) {
          // eventType = RFI & EOI (Active and historic events)
          const eventsURL = `tenders/projects/${events[i].projectId}/events`;
          let getEvents = await TenderApi.Instance(SESSION_ID).get(eventsURL);
          let getEventsData = getEvents.data;
          for (let j = 0; j < getEventsData.length; j++) {
            //let singleEvent=undefined;
            //*NOTE THIS CONDATION ADDED FOR G-CLOUD EVENT NOT TO DISPLAY
            if (events[i].agreementId !='RM1557.12') {
            
            let singleEvent: ActiveEvents = {
              projectId: events[i].projectId,
              projectName: events[i].projectName,
              agreementId: events[i].agreementId,
              agreementName: events[i].agreementName,
              lotId: events[i].lotId,
              lotName: events[i].lotName,
              activeEvent: getEventsData[j]
            }
            //singleEvent=events[i];
            //singleEvent.activeEvent=getEventsData[j];
            if (singleEvent.activeEvent != undefined && singleEvent.activeEvent?.status != undefined && (singleEvent.activeEvent.eventType == 'RFI' || singleEvent.activeEvent.eventType == 'EOI')) {
              if (singleEvent.activeEvent?.dashboardStatus == 'COMPLETE' || singleEvent.activeEvent?.dashboardStatus == 'CLOSED'
              || (singleEvent.activeEvent?.dashboardStatus=='UNKNOWN' && singleEvent.activeEvent?.status=='withdrawn')) {
                // Historical Events
                historicalEvents.push(singleEvent)
              } else if (singleEvent.activeEvent?.dashboardStatus == 'IN-PROGRESS') {
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = 'In-Progress'
                activeEvents.push(draftActiveEvent)
              } else if (singleEvent.activeEvent?.dashboardStatus == 'PUBLISHED') {
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = 'Published'
                activeEvents.push(draftActiveEvent)
              } else if (singleEvent.activeEvent?.dashboardStatus == 'TO-BE-EVALUATED') {
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = 'To Be Evaluated'
                activeEvents.push(draftActiveEvent)
              } else if (singleEvent.activeEvent?.dashboardStatus == 'EVALUATING') {
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = 'Evaluating'
                activeEvents.push(draftActiveEvent)
              } else if (singleEvent.activeEvent?.dashboardStatus == 'EVALUATED') {
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = 'Evaluated'
                activeEvents.push(draftActiveEvent)
              }
              else if (singleEvent.activeEvent?.dashboardStatus == 'PRE-AWARD') {
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = 'Pre-award'
                activeEvents.push(draftActiveEvent)
              }
              else if (singleEvent.activeEvent?.dashboardStatus == 'AWARDED') {
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = 'Awarded'
                activeEvents.push(draftActiveEvent)
              } else {
                activeEvents.push(singleEvent)
              }
            } else if (singleEvent.activeEvent?.eventType == 'TBD') {
              if (singleEvent.activeEvent?.dashboardStatus == 'COMPLETE' || singleEvent.activeEvent?.dashboardStatus == 'CLOSED')
              {
                historicalEvents.push(singleEvent)
              }
              else{
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = 'In-Progress'
                activeEvents.push(draftActiveEvent)
              }           
            }
            // eventType = FCA & DAA (Active and historic events)
            else if (singleEvent.activeEvent?.status != undefined && (singleEvent.activeEvent?.eventType == 'FCA' || singleEvent.activeEvent?.eventType == 'DAA')) {
              if (singleEvent.activeEvent?.dashboardStatus == 'COMPLETE' || singleEvent.activeEvent?.dashboardStatus == 'CLOSED') {
                // Historical Events
                historicalEvents.push(singleEvent)
              } else if (singleEvent.activeEvent?.dashboardStatus == 'ASSESSMENT') {
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = 'Assessment'
                activeEvents.push(draftActiveEvent)
              } else if (singleEvent.activeEvent?.dashboardStatus == 'EVALUATED') {
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = 'Evaluated'
                activeEvents.push(draftActiveEvent)
              }
              else if (singleEvent.activeEvent?.dashboardStatus == 'PRE-AWARD') {
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = 'Pre-award'
                activeEvents.push(draftActiveEvent)
              }
              else if (singleEvent.activeEvent?.dashboardStatus == 'AWARDED') {
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = 'Awarded'
                activeEvents.push(draftActiveEvent)
              } else {
                activeEvents.push(singleEvent)
              }
            }
            // eventType = FC & DA (Active and historic events)
            else if (singleEvent.activeEvent?.status != undefined && (singleEvent.activeEvent?.eventType == 'FC' || singleEvent.activeEvent?.eventType == 'DA')) {
              if (singleEvent.activeEvent?.dashboardStatus == 'COMPLETE' || singleEvent.activeEvent?.dashboardStatus == 'CLOSED' 
              || (singleEvent.activeEvent?.dashboardStatus=='UNKNOWN' && singleEvent.activeEvent?.status=='withdrawn')) {
                // Historical Events
                historicalEvents.push(singleEvent)
              } else if (singleEvent.activeEvent?.dashboardStatus == 'IN-PROGRESS') {
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = 'In-Progress'
                activeEvents.push(draftActiveEvent)
              } else if (singleEvent.activeEvent?.dashboardStatus == 'PUBLISHED') {
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = 'Published'
                activeEvents.push(draftActiveEvent)
              } else if (singleEvent.activeEvent?.dashboardStatus == 'TO-BE-EVALUATED') {
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = 'To Be Evaluated'
                activeEvents.push(draftActiveEvent)
              } else if (singleEvent.activeEvent?.dashboardStatus == 'EVALUATING') {
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = 'Evaluating'
                activeEvents.push(draftActiveEvent)
              } else if (singleEvent.activeEvent?.dashboardStatus == 'EVALUATED') {
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = 'Evaluated'
                activeEvents.push(draftActiveEvent)
              }
              else if (singleEvent.activeEvent?.dashboardStatus == 'AWARDED') {
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = 'Awarded'
                activeEvents.push(draftActiveEvent)
              }
              else if (singleEvent.activeEvent?.dashboardStatus == 'PRE-AWARD') {
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = 'Pre-award'
                activeEvents.push(draftActiveEvent)
              } else if (singleEvent.activeEvent?.dashboardStatus == eventStatus.Awarded) {
                draftActiveEvent = singleEvent
                draftActiveEvent.activeEvent.status = eventStatus.Awarded
                activeEvents.push(draftActiveEvent)
              } else {
                activeEvents.push(singleEvent)
              }
            }
          }
          }
        }
        req.session.openProjectActiveEvents = activeEvents;
        req.session.historicalEvents = historicalEvents;
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
      });
  };
}
