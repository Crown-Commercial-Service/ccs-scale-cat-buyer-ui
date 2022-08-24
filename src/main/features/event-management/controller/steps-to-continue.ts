//@ts-nocheck
import * as express from 'express'
import { LoggTracer } from '@common/logtracer/tracer'
import { TokenDecoder } from '@common/tokendecoder/tokendecoder'
import * as data from '../../../resources/content/event-management/steps-to-continue.json'
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';

/**
 * 
 * @Rediect 
 * @param req 
 * @param res 
 */
 export const GET_STEPS_TO_CONTINUE = async (req: express.Request, res: express.Response) => {
  const { agreementLotName, agreementName, agreement_id, releatedContent, project_name } =
    req.session;
    const lotid = req.session?.lotId;
    const agreementId_session = agreement_id;
    const { isJaggaerError } = req.session;
    req.session['isJaggaerError'] = false;  
    req.session.stepsError=false;
    const { SESSION_ID } = req.cookies
    const appendData = {
      data ,
      projPersistID: req.session['project_name'],
      eventId : req.session.eventId,
      releatedContent,
      error: isJaggaerError,
      }
      res.locals.agreement_header = {
        agreementName,
        project_name,
        agreementId_session,
        agreementLotName,
        lotid,
        error: isJaggaerError,
      };
    try {
    //const appendData={data}
    res.render('steps-to-continue', appendData)
    }
    catch (err) {
        LoggTracer.errorLogger(
          res,
          err,
          `${req.headers.host}${req.originalUrl}`,
          null,
          TokenDecoder.decoder(SESSION_ID),
          'Event management page',
          true,
        );
      }

}

export const POST_STEPS_TO_CONTINUE = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; 
  const projectID=req.session.projectId;
  try {
   
    const  rfi_next_steps  =  req.body.rfi_next_steps_to_continue;
    //IF 2FC OR 2DA IS CLOSED THEN ITS PRECEEDING FCA OR DAA MUST BE CLOSED FROM COMPLETE STATE
    //if(req.session.eventManagement_eventType=='FC' || req.session.eventManagement_eventType=='DA')
    // { 
    //   const eventTypeURL = `tenders/projects/${projectID}/events`;
    //   let getEventType = await TenderApi.Instance(SESSION_ID).get(eventTypeURL);
    //   let FCAEvents, DAAEvents;
    //   if(req.session.eventManagement_eventType == 'FC'){
    //     FCAEvents = getEventType.data.filter(x => x.eventType == 'FCA')
    //     if(FCAEvents.length > 0)
    //     { 
    //     for(let i=0;i<FCAEvents.length;i++){
    //      try {
    //       const baseURL = `tenders/projects/${projectID}/events/${FCAEvents[i].id}/termination`;
    //       const body = {
    //               "terminationType": "cancelled"       
    //         };
    //         const response = await TenderApi.Instance(SESSION_ID).put(baseURL, body);
    //      } catch (error) {
    //       LoggTracer.errorLogger(
    //         res,
    //         error,
    //         `${req.headers.host}${req.originalUrl}`,
    //         null,
    //         TokenDecoder.decoder(SESSION_ID),
    //         'FCA event failed to closed',
    //         true,
    //       );
    //      } 
    //     }
    //   }
    // }
    //   else{
    //     DAAEvents=getEventType.data.filter(x => x.eventType =='DAA')
    //     if(DAAEvents.length>0)
    //     for(let i=0;i<DAAEvents.length;i++){
    //       try {
    //       const baseURL = `tenders/projects/${projectID}/events/${DAAEvents[i].id}/termination`;
    //       const body = {
    //               "terminationType": "cancelled"       
    //         };
    //         const response = await TenderApi.Instance(SESSION_ID).put(baseURL, body);
    //      } catch (error) {
    //       LoggTracer.errorLogger(
    //         res,
    //         error,
    //         `${req.headers.host}${req.originalUrl}`,
    //         null,
    //         TokenDecoder.decoder(SESSION_ID),
    //         'DAA event failed to close',
    //         true,
    //       );
    //      } 
    //     }
    //   }
    // }
    //CLOSING THE EXISITING EVENT AND CREATING A NEW EVENT IN THE SAME PROJECT
    // let baseUrl = `/tenders/projects/${projectID}/events`;
    // let body = {
    //   "name": "Further Competition Event",
    //   "eventType": "FCA"
    // }
    // const { data } = await TenderApi.Instance(SESSION_ID).post(baseUrl, body);
    // if(data != null && data !=undefined)
    // {
    //   req.session['eventId'] = data.id;
    //   req.session.procurements[0]['eventId'] = data.id;
    //   req.session.procurements[0]['eventType'] = data.eventType;
    //   req.session.procurements[0]['started'] = false;
    // }
    req.session.fromStepsToContinue=true

    if (rfi_next_steps) {
      switch (rfi_next_steps) {
        case '[DA]':
          res.redirect('/projects/create-or-choose');
          break;

        case '[Rfi]':
         res.redirect('/projects/create-or-choose');
          break;
        case '[1-stage FC]':      
            res.redirect('/projects/create-or-choose');
            break;  
        case '[2-stage FC]':          
              res.redirect('/projects/create-or-choose');
              break;
        default:
          res.redirect('/404');
      }
    } else {
      req.session['isJaggaerError'] = true;
      res.redirect('/steps-to-continue');
    }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - Post failed - CA next steps page',
      true,
    );
  }

}
