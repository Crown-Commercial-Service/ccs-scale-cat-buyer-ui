import * as express from 'express'
//import { ParsedQs } from 'qs'
import { LoggTracer } from '@common/logtracer/tracer'
import { TokenDecoder } from '@common/tokendecoder/tokendecoder'
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance'
// import { Procurement } from '../../procurement/model/project';
// import { ReleatedContent } from '../../agreement/model/related-content'
import * as eventManagementData from '../../../resources/content/event-management/evaluateSuppliers.json'
import * as localData from '../../../resources/content/event-management/local-SOI.json' // replace this JSON with API endpoint
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import * as stage1ShortListEvaluationData from '../../../resources/content/event-management/stage1ShortListEvaluationData.json'
import * as stage2ShortListEvaluationData from '../../../resources/content/event-management/stage2ShortListEvaluationData.json'
import moment from 'moment-business-days';



//import { idText } from 'typescript'
/**
 * 
 * @Rediect 
 * @endpoint /event/management
 * @param req 
 * @param res 
 */

export const EVALUATE_SUPPLIERS = async (req: express.Request, res: express.Response) => {
    const { agreementLotName, agreementName, agreement_id, releatedContent, project_name } =
    req.session;
    let { agreement_header } = req.session;
    const lotid = req.session?.lotId;
    const { SESSION_ID } = req.cookies 
    const { projectId,eventId } = req.session;
    const { download} = req.query;
    const agreementId_session = req.session.agreement_id;
    //const supplierScores = await TenderApi.Instance(SESSION_ID).get(`tenders/projects/${projectId}/events/${eventId}/scores`) 
    //const supplierScoresandFeedback = supplierScores.data;

   

    // Event header
    res.locals.agreement_header = { project_name: project_name, projectId, agreementName, agreement_id, agreementLotName, lotid }
    req.session.agreement_header = res.locals.agreement_header
    if (download == '1') {
   
        const TemplateIDURL = `/tenders/projects/${projectId}/events/${eventId}/scores/templates`;
        const TemplateIDdata = await TenderApi.Instance(SESSION_ID).get(TemplateIDURL) 
        const TemplateID = TemplateIDdata.data[0].id;
        const TemplateURL = `/tenders/projects/${projectId}/events/${eventId}/scores/templates/${TemplateID}`;
        //const Templatedata = await TenderApi.Instance(SESSION_ID).get(TemplateURL) 
      
      const FetchDocuments = await DynamicFrameworkInstance.file_dowload_Instance(SESSION_ID).get(TemplateURL, {
        responseType: 'arraybuffer',
      });
      const file = FetchDocuments;
      const fileName = file.headers['content-disposition'].split('filename=')[1].split('"').join('');
      const fileData = file.data;
      const type = file.headers['content-type'];
      const ContentLength = file.headers['content-length'];
      res.status(200);
      res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': type,
        'Content-Length': ContentLength,
        'Content-Disposition': 'attachment; filename=' + fileName,
      });
      res.send(fileData);
       
    }

    if(download == '2')
    {
      
    const FileDownloadURL = `/tenders/projects/${projectId}/events/${eventId}/responses/export`;
    const FetchDocuments = await DynamicFrameworkInstance.file_dowload_Instance(SESSION_ID).get(FileDownloadURL, {
      responseType: 'arraybuffer',
    });
    const file = FetchDocuments;
    const fileName = file.headers['content-disposition'].split('filename=')[1].split('"').join('');
    const fileData = file.data;
    const type = file.headers['content-type'];
    const ContentLength = file.headers['content-length'];
    res.status(200);
    res.set({
      'Cache-Control': 'no-cache',
      'Content-Type': type,
      'Content-Length': ContentLength,
      'Content-Disposition': 'attachment; filename=' + fileName,
    });
    res.send(fileData);
    }

      else {
  try{
    //Cpmpletion Status
    const ScoresAndFeedbackURL =`tenders/projects/${projectId}/events/${eventId}/scores`
    const ScoresAndFeedbackURLdata = await TenderApi.Instance(SESSION_ID).get(ScoresAndFeedbackURL) 
    const supplierInterestURL = `tenders/projects/${projectId}/events/${eventId}/responses`
    const supplierdata= await TenderApi.Instance(SESSION_ID).get(supplierInterestURL)
    var submittedCount = 0
     for (let i = 0; i < supplierdata.data.responders.length; i++) {
       if(supplierdata.data.responders[i].responseState == 'Submitted')
       {
        submittedCount++
      }
     }
    let supData = [];
    let supplierName = [];

    let showallDownload = false;
    for (let i = 0; i < ScoresAndFeedbackURLdata.data.length; i++) {
      for(let j=0;j<supplierdata.data.responders.length;j++)
      {
        if(supplierdata.data.responders[j].supplier.id==ScoresAndFeedbackURLdata.data[i].organisationId )
        {
          supData[i]=supplierdata.data.responders[j];
          break;
      }
      }
      //supplierdata.data.responders.filter((a:any)=>{a.supplier.id==ScoresAndFeedbackURLdata.data[i].organisationId});
      //let commentData=supplierdata.data.responders[i].supplier.filter((a:any)=>{a.organisationId==supplierdata.data.responders[i].supplier.id});
      if(supData!=undefined) {
        var completion = "No"
        if(ScoresAndFeedbackURLdata.data[i].score === undefined) {
          completion = "No"
        } else if(ScoresAndFeedbackURLdata.data[i].score > 0) {
          completion = "Yes"
        } else {
          completion = "No"
        }
          
       let dataPrepared = {
        "id": supData[i].supplier.id,
        "name": supData[i].supplier.name,
        "responseState": supData[i].responseState,
        "responseDate": (moment(supData[i].responseDate)).format('DD/MM/YYYY HH:mm'),
         "completionStatus":completion,
      }
    
     if (supplierdata.data.responders[i].responseState == 'Submitted') {
        showallDownload = true;
      }
      supplierName.push(dataPrepared)
    }
    
  }

    const supplierSummary = supplierdata.data;
    var count =0;
    let ConfirmFlag = false;
    //count of completionstatus="yes" == count of responders
    for (let k = 0; k < supplierName.length; k++) {
       if(supplierName[k].completionStatus == "Yes" && supplierName[k].responseState == "Submitted" )
       {
         count++;
       }
     }
     if(count == submittedCount)
     {
      ConfirmFlag = true;
     }
    const stage2BaseUrl = `/tenders/projects/${projectId}/events`;
    const stage2_dynamic_api = await TenderApi.Instance(SESSION_ID).get(stage2BaseUrl);
    const stage2_dynamic_api_data = stage2_dynamic_api.data;
    const stage2_data = stage2_dynamic_api_data?.filter((anItem: any) => anItem.id == eventId && (anItem.templateGroupId == '13' || anItem.templateGroupId == '14'));
    
    let stage2_value = 'Stage 1';
    if(stage2_data.length > 0){
      stage2_value = 'Stage 2';
    }
    //if (status == "Published" || status == "Response period closed" || status == "Response period open" || status=="To be evaluated" ) {
          const appendData = { releatedContent,agreement_header,agreementId_session,ConfirmFlag,ScoresAndFeedbackURLdata,data: eventManagementData,eventId, supplierName, supplierSummary, showallDownload, suppliers: localData ,stage2_value }

    res.render('evaluateSuppliers',appendData);     
    
  } catch (err) {
    LoggTracer.errorLogger(
      res,
      err,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Event management - Evaluate Supplier page',
      true,
    );
  }
}
}
export const EVALUATE_SUPPLIERS_DOWNLOAD = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId } = req.session;
  const { eventId } = req.session;
  const { supplierid } = req.query;
  //let id;

try{
    
  if (supplierid != undefined) {
    
    const FileDownloadURL = `/tenders/projects/${projectId}/events/${eventId}/responses/${supplierid}/export`;
    const FetchDocuments = await DynamicFrameworkInstance.file_dowload_Instance(SESSION_ID).get(FileDownloadURL, {
      responseType: 'arraybuffer',
    });
    const file = FetchDocuments;
    const fileName = file.headers['content-disposition'].split('filename=')[1].split('"').join('');
    const fileData = file.data;
    const type = file.headers['content-type'];
    const ContentLength = file.headers['content-length'];
    res.status(200);
    res.set({
      'Cache-Control': 'no-cache',
      'Content-Type': type,
      'Content-Length': ContentLength,
      'Content-Disposition': 'attachment; filename=' + fileName,
    });
    res.send(fileData);
  }

 // res.redirect('/evaluate-suppliers');   
    
   
}catch (error) {
  LoggTracer.errorLogger(
    res,
    error,
    `${req.headers.host}${req.originalUrl}`,
    null,
    TokenDecoder.decoder(SESSION_ID),
    'Event management - Evaluate Supplier Tenders Service Api cannot be connected',
    true,
  );
}

}

export const EVALUATE_SUPPLIERS_POPUP = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId } = req.session;
  const { eventId } = req.session;
  const { agreement_id } = req.session;
  var ScoresAndFeedbackURLdata_: any[] = []

  try{

 
    
    const ScoresAndFeedbackURL =`tenders/projects/${projectId}/events/${eventId}/scores`
    const ScoresAndFeedbackURLdata : any = await TenderApi.Instance(SESSION_ID).get(ScoresAndFeedbackURL)
   

    for(var i=0;i<ScoresAndFeedbackURLdata.data.length;i++)
    {
      if(ScoresAndFeedbackURLdata.data[i].score !== undefined)
      {
        ScoresAndFeedbackURLdata_.push(ScoresAndFeedbackURLdata.data[i])
        //ScoresAndFeedbackURLdata_=ScoresAndFeedbackURLdata.data[i]
      }
    }
    let body=ScoresAndFeedbackURLdata_
  
    
     TenderApi.Instance(SESSION_ID).put(`/tenders/projects/${projectId}/events/${eventId}/scores?scoring-complete=true`,body);

     res.redirect('/confirm-score');

    // if(agreement_id != 'RM1043.8'){
    //   res.redirect('/dashboard');
    // }else{
    //   res.redirect('/shortlist_evaluation');
    // }
    
//publisheddoc?download=1
}catch (error) {
 
  if(error.response.status === 504){
    if(agreement_id != 'RM1043.8'){
      res.redirect('/dashboard');
    }else{
      res.redirect('/shortlist_evaluation');
    }
  }else{
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Event management - Evaluate Supplier Tenders Service Api cannot be connected',
      true,
    );
  }
}

}

export const CONFIRM_SCORE_GET = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId } = req.session;
  const { eventId } = req.session;
  const { agreement_id } = req.session;

    async function statusApis() {
      const baseurl = `/tenders/projects/${projectId}/events`
     const apidata: any = await TenderApi.Instance(SESSION_ID).get(baseurl).then(x => new   Promise(resolve => setTimeout(() => resolve(x), 6000)))
      return apidata.data;
    }
    
    var evaluateStatus: boolean = true;
    do {
      let statusResponse: any = [];
      statusResponse = await statusApis();
      var status = statusResponse.filter((d: any) => d.id == eventId)[0].dashboardStatus;
        if(status.toLowerCase() == "evaluated") {
          evaluateStatus = false;
        }
        
      
    } while(evaluateStatus);
    
    if(!evaluateStatus) {
      if(agreement_id != 'RM1043.8'){
      res.redirect('/event/management?id='+eventId);
      // res.redirect('/dashboard');
      }else{
        res.redirect('/shortlist_evaluation');
      }
    }
    
  
}

export const SHORTLIST_EVALUATION = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId } = req.session;
  const { eventId } = req.session;
  const { agreement_id } = req.session;
  const project_name = req.session.project_name;
  const agreementName = req.session?.agreementName;
  const agreementId_session = req.session.agreement_id;
  const agreementLotName = req.session.agreementLotName;
  const lotid = req.session?.lotId;
  try{
    
    const stage2BaseUrl = `/tenders/projects/${projectId}/events`
  const stage2_dynamic_api = await TenderApi.Instance(SESSION_ID).get(stage2BaseUrl);
  const stage2_dynamic_api_data = stage2_dynamic_api.data;
  const stage2_data = stage2_dynamic_api_data?.filter((anItem: any) => anItem.id == eventId && (anItem.templateGroupId == '13' || anItem.templateGroupId == '14'));
    res.locals.agreement_header = { project_name: project_name, projectId, agreementName, agreementId_session, agreementLotName, lotid }
    let cmsData;
    if(stage2_data.length > 0){
       cmsData=stage2ShortListEvaluationData;
    }else{
       cmsData=stage1ShortListEvaluationData;
    }
      
    const appendData = { data: cmsData,projectId,eventId,agreement_id}
    
    res.render('shorlistEvaluation',appendData);  
    
    
//publisheddoc?download=1
}catch (error) {
  LoggTracer.errorLogger(
    res,
    error,
    `${req.headers.host}${req.originalUrl}`,
    null,
    TokenDecoder.decoder(SESSION_ID),
    'Event management - Evaluate Supplier Tenders Service Api cannot be connected',
    true,
  );
}

}

  