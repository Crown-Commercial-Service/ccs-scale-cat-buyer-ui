import * as express from 'express'
import { LoggTracer } from '@common/logtracer/tracer'
import { TokenDecoder } from '@common/tokendecoder/tokendecoder'
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance'
import * as selectedSuppliersData from '../../../resources/content/event-management/selectedSuppliers.json'
import * as localData from '../../../resources/content/event-management/local-SOI.json' // replace this JSON with API endpoint
import { logConstant } from '../../../common/logtracer/logConstant';

/**
 * 
 * @Rediect 
 * @endpoint /event/management
 * @param req 
 * @param res 
 */


export const INVITE_SELECTED_SUPPLIERS = async (req: express.Request, res: express.Response) => {
  console.log("SUPLIER 1212")
    const { agreementLotName, agreementName, agreement_id, releatedContent, project_name } =
    req.session;
    const agreementId_session = req.session.agreement_id
    const lotid = req.session?.lotId;
    const { SESSION_ID } = req.cookies
    const { projectId,eventId } = req.session;//projectId,
    const { supplierid , suppliername } = req.query;
    let { Evaluation } = req.query;
    const { isEmptyProjectError } = req.session;
    req.session.isEmptyProjectError = false;
    var feedBack='';
    var marks='';
    

    // Event header
    res.locals.agreement_header = { project_name: project_name,projectId,Evaluation, agreementName, agreement_id, agreementLotName, lotid }
   
  try{
    //Supplier of interest
    
    const supplierInterestURL = `tenders/projects/${projectId}/events/${eventId}/scores`
    const supplierdata = await TenderApi.Instance(SESSION_ID).get(supplierInterestURL);
     
    //CAS-INFO-LOG 
    LoggTracer.infoLogger(supplierdata, logConstant.getSupplierScore, req);

    for(var m=0;m<supplierdata.data.length;m++)
    {    if(supplierdata.data[m].organisationId == supplierid && supplierdata.data[m].comment != 'No comment found' && supplierdata.data[m].score != null )
    {
      feedBack= supplierdata.data[m].comment;
        marks = supplierdata.data[m].score;

    }
    }
    
    //if (status == "Published" || status == "Response period closed" || status == "Response period open" || status=="To be evaluated" ) {
          const appendData = { releatedContent,data: selectedSuppliersData,error: isEmptyProjectError, feedBack,marks,eventId, suppliername, supplierid, suppliers: localData , agreementId_session }
          res.locals.agreement_header = { agreementName, project_name, projectId, agreementId_session, agreementLotName, lotid };
    
    //CAS-INFO-LOG 
    LoggTracer.infoLogger(null, logConstant.inviteSelectedSuppliers, req);

    res.render('selectedSuppliers',appendData);     
    
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

export const INVITE_SELECTED_SUPPLIERS_POST = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId } = req.session;
  const { eventId } = req.session;
  const { supplierid , suppliername} = req.query;
  const {enter_evaluation_feedback,enter_evaluation_score} =req.body;
  

try{
  
  if (enter_evaluation_feedback && enter_evaluation_score ) {
    let evaluation_score=(enter_evaluation_score.includes('.'))?enter_evaluation_score:enter_evaluation_score+".00";
    const body = [
                {
                  organisationId: supplierid ,
                  comment: enter_evaluation_feedback,
                  score: evaluation_score,
                }
              ];
              
              
              await TenderApi.Instance(SESSION_ID).put(`tenders/projects/${projectId}/events/${eventId}/scores`,
                body,
              );
            
              req.session.isEmptyProjectError = false;
              res.redirect('/evaluate-suppliers'); 
            } else {
              req.session.isEmptyProjectError = true;
              res.redirect('/enter-evaluation?'+"supplierid="+supplierid+"&suppliername="+suppliername);
            }
   
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


  