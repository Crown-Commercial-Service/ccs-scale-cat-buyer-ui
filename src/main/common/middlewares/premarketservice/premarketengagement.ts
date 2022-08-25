//@ts-nocheck
import { TokenDecoder } from './../../tokendecoder/tokendecoder';
import * as express from 'express';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { LoggTracer } from '../../logtracer/tracer';
const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('PreMarketEngagementMiddleware');
import * as journyData from '../../../features/procurement/model/tasklist.json';

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
    const { SESSION_ID } = req.cookies;
    
    if(req.session.fromStepsToContinue!=null){
      if(req.session.eventManagement_eventType=='FC' || req.session.eventManagement_eventType=='DA')
    { 
      const eventTypeURL = `tenders/projects/${projectId}/events`;
      let getEventType = await TenderApi.Instance(SESSION_ID).get(eventTypeURL);
      let FCAEvents, DAAEvents;
      if(req.session.eventManagement_eventType == 'FC'){
        FCAEvents = getEventType.data.filter(x => x.eventType == 'FCA')
        if(FCAEvents.length > 0)
        { 
        for(let i=0;i<FCAEvents.length;i++){
         try {
          const baseURL = `tenders/projects/${projectId}/events/${FCAEvents[i].id}/termination`;
          const body = {
                  "terminationType": "cancelled"       
            };
            const response = await TenderApi.Instance(SESSION_ID).put(baseURL, body);
         } catch (error) {
          LoggTracer.errorLogger(
            res,
            error,
            `${req.headers.host}${req.originalUrl}`,
            null,
            TokenDecoder.decoder(SESSION_ID),
            'FCA event failed to closed',
            true,
          );
         } 
        }
      }
    }
      else{
        DAAEvents=getEventType.data.filter(x => x.eventType =='DAA')
        if(DAAEvents.length>0)
        for(let i=0;i<DAAEvents.length;i++){
          try {
          const baseURL = `tenders/projects/${projectId}/events/${DAAEvents[i].id}/termination`;
          const body = {
                  "terminationType": "cancelled"       
            };
            const response = await TenderApi.Instance(SESSION_ID).put(baseURL, body);
         } catch (error) {
          LoggTracer.errorLogger(
            res,
            error,
            `${req.headers.host}${req.originalUrl}`,
            null,
            TokenDecoder.decoder(SESSION_ID),
            'DAA event failed to close',
            true,
          );
         } 
        }
      }
    }
      
      const termbaseURL = `tenders/projects/${projectId}/events/${eventId}/termination`;
            const _termbody = {
                    "terminationType": "cancelled"       
              };
              const termresponse = await TenderApi.Instance(req.cookies.SESSION_ID).put(termbaseURL, _termbody);
                 
      let newEventbaseUrl = `/tenders/projects/${projectId}/events`;
    let newEventBody = {
      "nonOCDS": {
        "eventType": req.session.selectedRoute
      }  
    } 
    
    const  newEventSavedata = await TenderApi.Instance(req.cookies.SESSION_ID).post(newEventbaseUrl, newEventBody);
    
    if(newEventSavedata != null && newEventSavedata !=undefined)
    {
      req.session['eventId'] = newEventSavedata.data.id;
      req.session.procurements[0]['eventId'] = newEventSavedata.data.id;
      req.session.procurements[0]['eventType'] = newEventSavedata.data.eventType;
      req.session.procurements[0]['started'] = true;
      req.session.currentEvent = newEventSavedata;
      
    const currentProcNumber = procurements.findIndex(
      (proc: any) => proc.eventId === newEventSavedata.data.id && proc.procurementID === projectId,
    );
    const proc: Procurement = {
      procurementID: projectId,
      eventId: newEventSavedata.data.id,
      defaultName: {
        name: procurements[currentProcNumber].defaultName.name,
        components: {
          agreementId: procurements[currentProcNumber].defaultName.components.agreementId,
          lotId: procurements[currentProcNumber].defaultName.components.lotId,
          org: "COGNIZANT BUSINESS SERVICES UK LIMITED",
        }
      },
      started: true
    }
    procurements.push(proc)
    req.session.procurements=procurements
    // req.session.procurements[currentProcNum].started = true;

    try {
      const JourneyStatus = await TenderApi.Instance(SESSION_ID).get(`/journeys/${req.session.eventId}/steps`);
      req.session['journey_status'] = JourneyStatus?.data;
    } catch (journeyError) {
      const _journeybody = {
        'journey-id': req.session.eventId,
        states: journyData.states,
      };
      if (journeyError.response.status == 404) {
        await TenderApi.Instance(SESSION_ID).post(`journeys`, _journeybody);
        const JourneyStatus = await TenderApi.Instance(SESSION_ID).get(`journeys/${req.session.eventId}/steps`);
        req.session['journey_status'] = JourneyStatus?.data;
      }
    }
    }
    
    // const neweventTypeURL = `tenders/projects/${projectId}/events`;
    // req.session.currentEvent = data;
    // const { newdata } = await TenderApi.Instance(req.cookies.SESSION_ID).post(neweventTypeURL, _body);
    req.session.fromStepsToContinue=null
    next();
  
    
    }
    else{
    const isAlreadyStarted = procurements.some(
      (proc: any) => proc.eventId === eventId && proc.procurementID === projectId && proc.started,
    );
    if (projectId && eventId && !isAlreadyStarted) {
      const { state } = req.cookies;
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
  }
  };
}
