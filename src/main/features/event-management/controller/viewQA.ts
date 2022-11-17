import * as express from 'express'
import { TenderApi } from '../../../common/util/fetch/tenderService/tenderApiInstance'
import { LoggTracer } from '@common/logtracer/tracer'
import { TokenDecoder } from '@common/tokendecoder/tokendecoder'
import * as inboxData from '../../../resources/content/event-management/qa.json'
import * as dos6InboxData from '../../../resources/content/event-management/qa dos6.json'

/**
 * 
 * @Rediect 
 * @endpoint /message/sent
 * @param req 
 * @param res 
 */
export const EVENT_MANAGEMENT_QA =  async (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies
    const agreementId = req.session.agreement_id;
    let appendData: any;
    let eventIds:any;
    let projectIds:any;
   
   


    try {  
        

       // https://dev-ccs-scale-cat-service.london.cloudapps.digital/tenders/projects
        
            //    console.log("FETCHHEADER",fetchHeaderData[0]);
         
        //res.locals.agreement_header = headerbaseURL;
      //  res.locals.agreement_header = req.session.agreement_header
       // console.log("res.locals.agreement_header",res.locals.agreement_header)
      // res.locals.agreement_header = fetchHeaderData[0];
       
       // https://dev-ccs-scale-cat-service.london.cloudapps.digital/tenders/projects/15422/events
        //const baseURL = `/tenders/projects/${req.session.projectId}/events/${req.session.eventId}/q-and-a`;
         
        let isSupplierQA= false;
       
            
   if(req.query.id != undefined){
  
    eventIds=req.query.id;
     projectIds = req.query.prId;
     isSupplierQA = true;

     const headerbaseURL = `/tenders/projects`;  
         const fetchHeader:any = await TenderApi.Instance(SESSION_ID).get(headerbaseURL);
         let  fetchHeaderData:any = fetchHeader?.data;
          fetchHeaderData = fetchHeaderData?.filter(((AField: any) => AField?.activeEvent?.id === eventIds));
          
          res.locals.agreement_header = fetchHeaderData[0];

   }else{
    
    eventIds=req.session.eventId;
     projectIds = req.session.projectId;
     isSupplierQA= false;
     res.locals.agreement_header = req.session.agreement_header;
   }
    

        const baseURL = `/tenders/projects/${projectIds}/events/${eventIds}/q-and-a`;
        const fetchData = await TenderApi.Instance(SESSION_ID).get(baseURL);
        let data;
        if(agreementId == 'RM1043.8') { //DOS6
            data = dos6InboxData;
          } else { 
            data = inboxData;
          }
       
        appendData = { data, QAs: (fetchData.data.QandA.length > 0 ? fetchData.data.QandA : []), eventId: req.session['eventId'], eventType: req.session.eventManagement_eventType, eventName: req.session.project_name, isSupplierQA, agreementId}	
        res.render('viewQA', appendData)	
    } catch (err) {	
        LoggTracer.errorLogger(	
            res,	
            err,	
            `${req.headers.host}${req.originalUrl}`,	
            null,	
            TokenDecoder.decoder(SESSION_ID),	
            'Q&A page Tenders Service Api cannot be connected',	
            true,	
        );	
    }	
}



export const EVENT_MANAGEMENT_SUPPLIER_QA = async (req: express.Request, res: express.Response) => {
    const { supplier_qa_url } = req.session;
    const { SESSION_ID } = req.cookies;
    const agreementId = req.session.agreement_id;
    let eventId = supplier_qa_url != undefined ? atob(supplier_qa_url.split('Id=')[1]).split("_")[1] : undefined
    var projectId = supplier_qa_url != undefined ? atob(supplier_qa_url.split('Id=')[1]).split("_")[0] : undefined
    let appendData: any;
    try {
        if (eventId != undefined && projectId != undefined) {
            const baseURL = `/tenders/projects/${projectId}/events/${eventId}/q-and-a`;
            const fetchData = await TenderApi.Instance(SESSION_ID).get(baseURL);
            let data;
        if(agreementId == 'RM1043.8') { //DOS6
            data = dos6InboxData;
          } else { 
            data = inboxData;
          }

            if (fetchData != undefined && fetchData != null && fetchData.data.QandA?.length > 0) {
                res.locals.agreement_header = { projectId: projectId, eventId: eventId, project_name: fetchData.data.projectName, agreementName: fetchData.data.agreementName, agreementId_session: fetchData.data.agreementId, agreementLotName: fetchData.data.lotName, lotid: fetchData.data.lotId }
                req.session.agreement_header = res.locals.agreement_header
                appendData = { data, QAs: fetchData.data.QandA, eventId: eventId,eventName:req.session.eventManagement_eventType, eventType: req.session.eventManagement_eventType, isSupplierQA: true, agreementId}
            }
        }
        res.render('viewQA', appendData)
    } catch (err) {
        LoggTracer.errorLogger(
            res,
            err,
            `${req.headers.host}${req.originalUrl}`,
            null,
            TokenDecoder.decoder(SESSION_ID),
            'Q&A supplier page Tenders Service Api cannot be connected',
            true,
        );
    }

}
