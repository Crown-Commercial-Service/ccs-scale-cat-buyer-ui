import * as express from 'express';
import * as cmsData from '../../../resources/content/RFI/nextsteps.json';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { ObjectModifiers } from '../util/operations/objectremoveEmptyString';

//@GET /rfi/event-sent
export const RFI_GET_NEXT_STEPS  = async (req: express.Request, res: express.Response) => {

    //cmsData.breadCrumbs[1].href=cmsData.breadCrumbs[1].href+req.session.eventId;
    const { agreementLotName, agreementName, agreement_id, releatedContent, project_name } =
    req.session;
    const lotid = req.session?.lotId;
    const agreementId_session = agreement_id;
    const { isJaggaerError } = req.session;
    req.session['isJaggaerError'] = false;
    const appendData = {
          data: cmsData,
          projPersistID: req.session['project_name'],
          eventId : req.session.eventId,
          releatedContent,
          error: isJaggaerError,
    }
    const { SESSION_ID } = req.cookies; //jwt

    res.locals.agreement_header = {
        agreementName,
        project_name,
        agreementId_session,
        agreementLotName,
        lotid,
        error: isJaggaerError,
      };

try {
    res.render('nextsteps.njk', appendData)
  }catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - update the status failed - RFI Publish Page',
      true,
    );
  }

}


export const RFI_POST_NEXT_STEPS = async (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies;  
    try {
      const filtered_body_content_removed_fc_key = ObjectModifiers._deleteKeyofEntryinObject(
        req.body,
        'choose_fc_rfi_next_steps',
      );
      const { rfi_next_steps } = filtered_body_content_removed_fc_key;
      //await TenderApi.Instance(SESSION_ID).put(`journeys/${eventIId}/55`, 'Not started');
      if (rfi_next_steps) {
        switch (rfi_next_steps) {
          case 'Close this event and start a new event':

           //await TenderApi.Instance(SESSION_ID).put(`journeys/${eventIId}/steps/54`, 'Completed');
            res.redirect('/steps-to-continue');//scat-5012
            break;
  
          case 'Close this event and the whole project':
            //await TenderApi.Instance(SESSION_ID).put(`journeys/${eventIId}/steps/54`, 'Not started');
            
            break;
  
          default:
            res.redirect('/404');
        }
      } else {
        req.session['isJaggaerError'] = true;
       // await TenderApi.Instance(SESSION_ID).put(`journeys/${eventIId}/steps/58`, 'Completed');
        res.redirect('/rfi/nextsteps');
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
  };
  





