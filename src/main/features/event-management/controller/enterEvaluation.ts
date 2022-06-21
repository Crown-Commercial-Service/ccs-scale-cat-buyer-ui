import * as express from 'express'
//import { ParsedQs } from 'qs'
import { LoggTracer } from '@common/logtracer/tracer'
import { TokenDecoder } from '@common/tokendecoder/tokendecoder'
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance'
// import { Procurement } from '../../procurement/model/project';
// import { ReleatedContent } from '../../agreement/model/related-content'
import * as eventManagementData from '../../../resources/content/event-management/enterEvaluation.json'
import * as localData from '../../../resources/content/event-management/local-SOI.json' // replace this JSON with API endpoint
//import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
//simport { idText } from 'typescript'
/**
 * 
 * @Rediect 
 * @endpoint /event/management
 * @param req 
 * @param res 
 */


export const ENTER_EVALUATION = async (req: express.Request, res: express.Response) => {
    const { agreementLotName, agreementName, agreement_id, releatedContent, project_name } =
    req.session;
    const lotid = req.session?.lotId;
    const { SESSION_ID } = req.cookies
    const { eventId } = req.session;//projectId,
    const { supplierid , suppliername } = req.query;
    

    // Event header
    res.locals.agreement_header = { project_name: project_name, agreementName, agreement_id, agreementLotName, lotid }
   
  try{
    //Supplier of interest
    
    

    //if (status == "Published" || status == "Response period closed" || status == "Response period open" || status=="To be evaluated" ) {
          const appendData = { releatedContent,data: eventManagementData,  eventId, suppliername, supplierid, suppliers: localData , }

    res.render('enterEvaluation',appendData);     
    
  } catch (err) {
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

export const ENTER_EVALUATION_POST = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId } = req.session;
  const { eventId } = req.session;
  const { supplierid } = req.query;
  const {enter_evaluation_feedback,enter_evaluation_score} =req.body;
  //let id;

try{
    
    const body = [
                {
                  organisationId: supplierid ,
                  comment: enter_evaluation_feedback,
                  score: enter_evaluation_score,
                }
              ];
  
              await TenderApi.Instance(SESSION_ID).put(`tenders/projects/${projectId}/events/${eventId}/scores`,
                body,
              );
              
              //res.redirect('/evaluate-suppliers'); 
    
   
}catch (error) {
  LoggTracer.errorLogger(
    res,
    error,
    `${req.headers.host}${req.originalUrl}`,
    null,
    TokenDecoder.decoder(SESSION_ID),
    'Tenders Service Api cannot be connected',
    true,
  );
}

}
//publisheddoc?download=1


  