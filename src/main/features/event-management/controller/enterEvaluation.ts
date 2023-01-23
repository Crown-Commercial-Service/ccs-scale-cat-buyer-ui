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
              console.log(`tenders/projects/${projectId}/events/${eventId}/scores`);
              console.log(body);
              req.session.individualScore = body[0];
              //let responseScore = 
              TenderApi.Instance(SESSION_ID).put(`tenders/projects/${projectId}/events/${eventId}/scores`,
                body,
              );
              console.log('Action made! ****************')
              //CAS-INFO-LOG 
              // LoggTracer.infoLogger(responseScore, logConstant.evaluateScoreUpdated, req);

              res.redirect('/score-individual'); 

            } else {
              req.session.isEmptyProjectError = true;
              res.redirect('/enter-evaluation?'+"supplierid="+supplierid+"&suppliername="+suppliername);
            }
   
}catch (error) {
  console.log('Fetch Catch Error *******************');
  console.log(error);
  LoggTracer.errorLogger(
    res,
    error,
    `${req.headers.host}${req.originalUrl}`,
    null,
    TokenDecoder.decoder(SESSION_ID),
    'PRE09121211',
    true,
  );
  // if(error.response.status !== undefined) {
  //   console.log("*********** error.response.status - ",error.response.status);
  // }
  // console.log(error.config.metadata.startTime);
  // console.log(error.config.metadata.endTime);
  // console.log(error.duration);

  // if(error.response.status === 504){
  //   req.session.isEmptyProjectError = false;
  //   res.redirect('/evaluate-suppliers');
  // }else{
    
  // }
}

}

export const SCORE_INDIVIDUAL_GET = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId } = req.session;
  const { eventId } = req.session;
  console.log('Temp ***************');
  if(req.session.individualScore !== undefined) {

    async function scoreApis() {
      const scoreCompareUrl = `tenders/projects/${projectId}/events/${eventId}/scores`;
      const scoreCompare: any = await TenderApi.Instance(SESSION_ID).get(scoreCompareUrl).then(x => new Promise(resolve => setTimeout(() => resolve(x), 5000)))
      return scoreCompare.data;
    }
    
    var scoreIndividualGetState: boolean = true;
    do {
      let sessionScore = req.session.individualScore;
      let resScore: any = [];
      resScore = await scoreApis();
      console.log(resScore);
      if(resScore.length > 0) {
        let scoreFliter = resScore.filter((el: any) => {
          return el.organisationId === sessionScore.organisationId && el.score == sessionScore.score;
        });
        if(scoreFliter.length > 0) {
          scoreIndividualGetState = false;
        }
        console.log(scoreIndividualGetState);
      }
    } while(scoreIndividualGetState);
    
    if(!scoreIndividualGetState) {
      req.session.isEmptyProjectError = false;
      res.redirect('/evaluate-suppliers'); 
    }
    
  } else {
    req.session.isEmptyProjectError = false;
    res.redirect('/evaluate-suppliers'); 
  }
}
//publisheddoc?download=1


  
