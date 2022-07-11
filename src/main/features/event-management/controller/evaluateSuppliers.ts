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
    const lotid = req.session?.lotId;
    const { SESSION_ID } = req.cookies 
    const { projectId,eventId } = req.session;
    const { download } = req.query;
    //const supplierScores = await TenderApi.Instance(SESSION_ID).get(`tenders/projects/${projectId}/events/${eventId}/scores`) 
    //const supplierScoresandFeedback = supplierScores.data;

    // Event header
    res.locals.agreement_header = { project_name: project_name, agreementName, agreement_id, agreementLotName, lotid }
    // req.session.agreement_header = res.locals.agreement_header
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
    for (let i = 0; i < ScoresAndFeedbackURLdata.data.length; i++) {
    if(ScoresAndFeedbackURLdata.data[i].comment == 'No comment found')
    {
      var completion = "No"
    }
    else
     {
      var completion = "Yes"
     }
    }
    //Supplier of interest
    const supplierInterestURL = `tenders/projects/${projectId}/events/${eventId}/responses`
    const supplierdata = await TenderApi.Instance(SESSION_ID).get(supplierInterestURL) 
    
    let supplierName = [];

    let showallDownload = false;
    for (let i = 0; i < supplierdata.data.responders.length; i++) {
      //checking for supplier ID
    //   for (let j = 0; j < ScoresAndFeedbackURLdata.data.length; j++) {
    //  if( supplierdata.data.responders[i].supplier.id == ScoresAndFeedbackURLdata.data[j].organisationId)
    //  {
    //    var completion = "Yes"
    //  }
    //  else
    //  {
    //   var completion = "No"
    //  }

    //  }
       let dataPrepared = {

        "id": supplierdata.data.responders[i].supplier.id,

        "name": supplierdata.data.responders[i].supplier.name,

        "responseState": supplierdata.data.responders[i].responseState,
        "responseDate": supplierdata.data.responders[i].responseDate,
         "completionStatus":completion,
      }

     if (supplierdata.data.responders[i].responseState == 'Submitted') {
        showallDownload = true;
      }
      supplierName.push(dataPrepared)
    }
    const supplierSummary = supplierdata.data;
    var count =0;
    let ConfirmFlag = false;
    //count of completionstatus="yes" == count of responders
    for (let k = 0; k < supplierName.length; k++) {
       if(supplierName[k].completionStatus == "Yes")
       {
         count++;
       }
     }
     if(count == supplierName.length)
     {
      ConfirmFlag = true;
     }
    //if (status == "Published" || status == "Response period closed" || status == "Response period open" || status=="To be evaluated" ) {
          const appendData = { releatedContent,ConfirmFlag,ScoresAndFeedbackURLdata,data: eventManagementData,eventId, supplierName, supplierSummary, showallDownload, suppliers: localData , }

    res.render('evaluateSuppliers',appendData);     
    
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
    'Tenders Service Api cannot be connected',
    true,
  );
}

}
//publisheddoc?download=1

  