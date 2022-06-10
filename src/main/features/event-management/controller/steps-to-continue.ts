import * as express from 'express'
//import { ParsedQs } from 'qs'
import { LoggTracer } from '@common/logtracer/tracer'
import { TokenDecoder } from '@common/tokendecoder/tokendecoder'
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance'
//import { Procurement } from '../../procurement/model/project';
//import { ReleatedContent } from '../../agreement/model/related-content'
import * as data from '../../../resources/content/event-management/steps-to-continue.json'
//import { ObjectModifiers } from '../util/operations/objectremoveEmptyString';

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
  const { eventId, projectId } = req.session; 
  try {
   
    const  rfi_next_steps  =  req.body.rfi_next_steps_to_continue;
    const baseURL = `tenders/projects/${projectId}/events/${eventId}`;

    if (rfi_next_steps) {
      switch (rfi_next_steps) {
        case '[DA]':
          // const daResponse = updateEventType("DA",baseURL,SESSION_ID);

          // if (daResponse != null && daResponse != undefined)
          //   req.session.currentEvent = daResponse;

           res.redirect('/projects/create-or-choose');
          break;

        case '[Rfi]':
          //const rfiResponse = updateEventType("RFI",baseURL,SESSION_ID);
          const body = {
            eventType: "RFI",
          };
          const { data } = await TenderApi.Instance(SESSION_ID).put(baseURL, body);

          if (data != null && data != undefined)
            req.session.currentEvent = data;

          res.redirect('/projects/create-or-choose');
          break;
        case '[1-stage FC]':
            const fcResponse = updateEventType("FC",baseURL,SESSION_ID);

          if (fcResponse != null && fcResponse != undefined)
            req.session.currentEvent = fcResponse;

            res.redirect('/projects/create-or-choose');
            break;  
        case '[1-stage FC]':
              const fcResponse2 = updateEventType("FC",baseURL,SESSION_ID);

          if (fcResponse2 != null && fcResponse2 != undefined)
            req.session.currentEvent = fcResponse2;
            
              res.redirect('/projects/create-or-choose');
              break;
        default:
          res.redirect('/404');
      }
    } else {
      req.session['isJaggaerError'] = true;
     // await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/58`, 'Completed');
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
const updateEventType = async (eventType: any, baseURL: any, SESSION_ID: any) => {
  const body = {
    eventType: eventType,
  };
  const { data } = await TenderApi.Instance(SESSION_ID).put(baseURL, body);
  return data;
}