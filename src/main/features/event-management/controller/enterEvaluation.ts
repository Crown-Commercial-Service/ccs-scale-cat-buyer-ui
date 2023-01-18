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
// import { logConstant } from '../../../common/logtracer/logConstant';
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
    const agreementId_session=agreement_id;
    const { SESSION_ID } = req.cookies
    const { projectId,eventId } = req.session;//projectId,
    const { supplierid , suppliername } = req.query;
    let { Evaluation } = req.query;
    const { isEmptyProjectError } = req.session;
    req.session.isEmptyProjectError = false;
    var feedBack='';
    var marks='';
    

    // Event header
    res.locals.agreement_header = { project_name: project_name, projectId,Evaluation, agreementName, agreementId_session, agreementLotName, lotid }
   
  try{
    //Supplier of interest

    const stage2BaseUrl = `/tenders/projects/${projectId}/events`;
    const stage2_dynamic_api = await TenderApi.Instance(SESSION_ID).get(stage2BaseUrl);
    const stage2_dynamic_api_data = stage2_dynamic_api.data;
    const stage2_data = stage2_dynamic_api_data?.filter((anItem: any) => anItem.id == eventId && (anItem.templateGroupId == '13' || anItem.templateGroupId == '14'));
    
    let stage2_value = 'Stage 1';
    if(stage2_data.length > 0){
      stage2_value = 'Stage 2';
    }
    
    const supplierInterestURL = `tenders/projects/${projectId}/events/${eventId}/scores`
    const supplierdata = await TenderApi.Instance(SESSION_ID).get(supplierInterestURL);
    for(var m=0;m<supplierdata.data.length;m++)
    {
      // if(supplierdata.data[m].organisationId == supplierid && supplierdata.data[m].comment != 'No comment found' && supplierdata.data[m].score != null )
      // { Old Logic
      if(supplierdata.data[m].organisationId == supplierid && supplierdata.data[m].score != null )
      {
        feedBack= ''; //supplierdata.data[m].comment Old Logic
        marks = supplierdata.data[m].score;
      }
    }
    
    //if (status == "Published" || status == "Response period closed" || status == "Response period open" || status=="To be evaluated" ) {
          const appendData = {stage2_value,releatedContent,data: eventManagementData,error: isEmptyProjectError, feedBack,marks,eventId, suppliername, supplierid, suppliers: localData ,agreementId_session }
    
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
  const { supplierid , suppliername} = req.query;
  // const {enter_evaluation_feedback,enter_evaluation_score} =req.body;  Old Logics
  const {enter_evaluation_score} =req.body;  

try{
  // if (enter_evaluation_feedback && enter_evaluation_score ) {  Old Logics
  if (enter_evaluation_score) {
    let evaluation_score=(enter_evaluation_score.includes('.'))?enter_evaluation_score:enter_evaluation_score+".00";
    //comment: enter_evaluation_feedback,
    const body = [
                {
                  organisationId: supplierid,
                  score: evaluation_score,
                }
              ];
              console.log('*************** START **************');
              console.log(`URL: https://dev-ccs-scale-cat-service.london.cloudapps.digital/tenders/projects/${projectId}/events/${eventId}/scores`)
              console.log(`METHOD: put`);
              console.log(`BODY PARSE: ${JSON.stringify(body)}`);
              // const rawData: any = await TenderApi.InstanceKeepAlive(SESSION_ID).put(`tenders/projects/${projectId}/events/${eventId}/scores`,
              //   body,
              // );
              const rawData: any = await fetch(`tenders/projects/${projectId}/events/${eventId}/scores`, {
                method: "PUT",
                keepalive: true,
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${SESSION_ID}`
                },
                body: JSON.stringify(body),
              }).catch((error) => {
                console.log('Fetch Error catch *****')
                console.log(error)
                  //CAS-INFO-LOG
                  LoggTracer.errorLogger(
                    res,
                    error,
                    `${req.headers.host}${req.originalUrl}`,
                    null,
                    TokenDecoder.decoder(SESSION_ID),
                    'PRE09121211',
                    true,
                  );
              })
              //CAS-INFO-LOG
              LoggTracer.infoLogger(rawData, 'PRE09121210', req);
              console.log(rawData.config.metadata.startTime);
              console.log(rawData.config.metadata.endTime);
              console.log(rawData.duration);
              console.log('*****************************');
              console.log(SESSION_ID);
              console.log(JSON.stringify(rawData.config.metadata));
              // console.log(JSON.stringify(rawData));
              console.log('*************** END **************');
              
              req.session.isEmptyProjectError = false;
              res.redirect('/evaluate-suppliers'); 
            } else {
              req.session.isEmptyProjectError = true;
              res.redirect('/enter-evaluation?'+"supplierid="+supplierid+"&suppliername="+suppliername);
            }
   
}catch (error) {

  if(error.response.status !== undefined) {
    console.log("*********** error.response.status - ",error.response.status);
  }
  console.log(error.config.metadata.startTime);
  console.log(error.config.metadata.endTime);
  console.log(error.duration);

  if(error.response.status === 504){
    req.session.isEmptyProjectError = false;
    res.redirect('/evaluate-suppliers');
  }else{
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Event Management - Tenders Service Api cannot be connected',
      true,
    );
  }
}

}
//publisheddoc?download=1


  