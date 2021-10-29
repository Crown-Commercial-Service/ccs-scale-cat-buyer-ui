
import * as express from 'express'
import * as data from '../../../resources/content/procurement/ccs-procurement.json'
import {TenderApiInstance} from '../util/fetch/tenderInstance'
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';


/**
 * 
 * @Rediect 
 * @endpoint
 * @param req 
 * @param res 
 */
export const PROCUREMENT = async (req : express.Request, res : express.Response)=> {
  var { agreement_id, lotId } = req.query;
  var {SESSION_ID} = req.cookies;

  const baseURL = `/tenders/ProcurementProject/agreements/${agreement_id}/lots/${lotId}`;
  try {
      let _body = {
        "agreementId": agreement_id,
        "lotId": lotId
    }
      const createdProcurement = await TenderApiInstance.Instance.post(baseURL, _body);

      console.log(createdProcurement?.data)

      const isCreatedProcurement = !!createdProcurement; 
      const appendData = { ...data, isCreatedProcurement };
      res.render('procurement', appendData);
  } catch(error) { 

    delete error?.config?.['headers'];
    let Logmessage = {
        "Person_email": TokenDecoder.decoder(SESSION_ID),
         "error_location": `${req.headers.host}${req.originalUrl}`,
         "sessionId": "null",
         "error_reason": "Tender agreement failed to be added",
         "exception": error
     }
     let Log = new LogMessageFormatter(
         Logmessage.Person_email, 
         Logmessage.error_location, 
         Logmessage.sessionId,
         Logmessage.error_reason, 
         Logmessage.exception
         )
     LoggTracer.errorTracer(Log, res);

  }   
     
}