import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { AgreementAPI } from './../../../common/util/fetch/agreementservice/agreementsApiInstance';

import * as express from 'express'
import * as data from '../../../resources/content/procurement/ccs-procurement.json'
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';

/**
 * 
 * @Rediect 
 * @endpoint '/oauth/login
 * @param req 
 * @param res 
 */
export const PROCUREMENT = async (req : express.Request, res : express.Response)=> {
  const { lotId, projName, aggName } = req.query; 
  var {agreement_id, SESSION_ID} = req.cookies; 

  const lotsURL = `/tenders/projects/agreements`;
  const eventTypesURL = `agreements/${agreement_id}/lots/${lotId}/event-types`;
  let appendData: any = { ...data, SESSION_ID, agreement_id, lotId, projName, aggName};
  try {
    const {data: types} = await AgreementAPI.Instance.get(eventTypesURL);
    appendData = {types, ...appendData};

    const _body = {
      "agreementId": agreement_id,
      "lotId": lotId
    }

    // check if project is already created
    const {data: procurement} = await TenderApi.Instance(SESSION_ID).post(lotsURL, _body);
    appendData = {...appendData, projName: procurement['defaultName']['name']};

    //const isCreatedProcurement = !!createdProcurement; 
    //const appendData = { ...data, isCreatedProcurement };
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
    res.render('procurement', appendData);
        
}