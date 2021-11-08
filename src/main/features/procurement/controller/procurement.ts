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
 * 
 * 
 */
export const PROCUREMENT = async (req : express.Request, res : express.Response)=> {
  const { lotId, agreementLotName } = req.query; 
  var {SESSION_ID} = req.cookies; 
  const agreementId_session = req.session.agreement_id;
  const lotsURL = `/tenders/projects/agreements`;
  const eventTypesURL = `agreements/${agreementId_session}/lots/${lotId}/event-types`;
  let appendData: any = { ...data, SESSION_ID, agreement_header: {number:agreementId_session} };
  try { 
    const {data: typesRaw} = await AgreementAPI.Instance.get(eventTypesURL);


    console.log({data})
    const types = typesRaw.map((typeRaw: any) => typeRaw.type); 
    appendData = {types, ...appendData };
    
    const elementCached = req.session.procurements.find((proc: any) => proc.defaultName.components.lotId === lotId);

    console.log({elementCached})
    let procurement;
    if (!elementCached) {
      const _body = {
        "agreementId": agreementId_session,
        "lotId": lotId
      }
      const {data: procurementRaw} = await TenderApi.Instance(SESSION_ID).post(lotsURL, _body);

      console.log({data})
      
      procurement = procurementRaw;
      req.session.procurements.push(procurement);
    }
    else {

      procurement = elementCached;

      console.log({msg: "triggered"})
    }
    req.session.lotId =  procurement['defaultName']['components']['lotId'];
    req.session.project_name = procurement['defaultName']['name'];
    req.session.agreementLotName = agreementLotName;
    const agreementName = req.session.agreementName; //udefined
    appendData = {...appendData, agreement_header: {name: agreementName, number: agreementId_session, lotId: lotId,  project_name: procurement['defaultName']['name'], agreementLotName: agreementLotName }};
    res.render('procurement', appendData);
  } catch(error) { 

    console.log({error})
            
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