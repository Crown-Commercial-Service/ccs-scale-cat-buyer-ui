import * as express from 'express'
//import { ParsedQs } from 'qs'
import { LoggTracer } from '@common/logtracer/tracer'
import { TokenDecoder } from '@common/tokendecoder/tokendecoder'
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance'
// import { Procurement } from '../../procurement/model/project';
// import { ReleatedContent } from '../../agreement/model/related-content'
import * as eventManagementData from '../../../resources/content/event-management/enterEvaluation.json'
import * as localData from '../../../resources/content/event-management/local-SOI.json' // replace this JSON with API endpoint
import { logConstant } from '../../../common/logtracer/logConstant';

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
    
    const supplierInterestURL = `tenders/projects/${projectId}/events/${eventId}/scores`;
    const supplierdata = await TenderApi.Instance(SESSION_ID).get(supplierInterestURL);
    //CAS-INFO-LOG 
    LoggTracer.infoLogger(supplierdata, logConstant.getSupplierScore, req);

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
    
    //CAS-INFO-LOG 
    LoggTracer.infoLogger(null, logConstant.evaluateFinalScorePageLogg, req);

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
              console.log('************* State 1');
              console.log(JSON.stringify(body))
              console.log(`tenders/projects/${projectId}/events/${eventId}/scores`);
              req.session.individualScore = body[0];
              console.log('************* State 1.1 session init');
              console.log(req.session.individualScore);
              //let responseScore = 
              TenderApi.Instance(SESSION_ID).put(`tenders/projects/${projectId}/events/${eventId}/scores`,
                body,
              );
              console.log('************* State 1.2 after put without await');
              //CAS-INFO-LOG 
              // LoggTracer.infoLogger(responseScore, logConstant.evaluateScoreUpdated, req);
              console.log('************* State 1.3 going to redirect at /score-individual');
              res.redirect('/score-individual'); 

            } else {
              req.session.isEmptyProjectError = true;
              res.redirect('/enter-evaluation?'+"supplierid="+supplierid+"&suppliername="+suppliername);
            }
   
}catch (error) {
  console.log('****************** error state 1');
  console.log(error);
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
      'Event Management - Evaluate post - APIs one error occured',
      true,
    );
  }
}

}

export const SCORE_INDIVIDUAL_GET = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId } = req.session;
  const { eventId } = req.session;
  try {
    console.log('************* State 2');
    if(req.session.individualScore !== undefined) {
      console.log('************* State 2.1 session condition true');
      async function scoreApis() {
        const scoreCompareUrl = `tenders/projects/${projectId}/events/${eventId}/scores`;
        const scoreCompare: any = await TenderApi.Instance(SESSION_ID).get(scoreCompareUrl).then(x => new Promise(resolve => setTimeout(() => resolve(x), 10000)))
        return scoreCompare.data;
      }
      
      var scoreIndividualGetState: boolean = true;
      do {
        let sessionScore = req.session.individualScore;
        let resScore: any = [];
        console.log('************* State 2.2 DO ******');
        resScore = await scoreApis();
        console.log(resScore);
        if(resScore.length > 0) {
          let scoreFliter = resScore.filter((el: any) => {
            return el.organisationId === sessionScore.organisationId && el.score == sessionScore.score;
          });
          if(scoreFliter.length > 0) {
            console.log('************* State 2.3 false init');
            scoreIndividualGetState = false;
          }
        }
      } while(scoreIndividualGetState);
      
      if(!scoreIndividualGetState) {
        console.log('************* State 2.4 success to last step');
        req.session.isEmptyProjectError = false;
        res.redirect('/evaluate-suppliers'); 
      }
      
    } else {
      console.log('************* State 2.1 session condition false');
      req.session.isEmptyProjectError = false;
      res.redirect('/evaluate-suppliers'); 
    }
  } catch (error) {
    console.log('****************** error state 2');
    console.log(error);
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Event Management - Score individual get - APIs two error occured',
      true,
    );
  }
}
//publisheddoc?download=1


  