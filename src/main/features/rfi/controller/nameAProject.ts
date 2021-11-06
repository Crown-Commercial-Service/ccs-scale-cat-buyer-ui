import * as express from 'express'
import * as cmsData from '../../../resources/content/RFI/nameYourProject.json';
import procurementDetail from '../model/procurementDetail'
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance'
// import {RFI_PATHS} from '../model/rficonstant'
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';




export const GET_NAME_PROJECT = async (req : express.Request, res : express.Response)=> {    
    const procurements:procurementDetail[] = req.session.procurements;
    const {aggNameText,aggNameValue,lotId,projName} = req.session.header;
    var {agreement_id} = req.cookies;
    let procurement:procurementDetail = procurements.find((proc: any) => proc.defaultName.components.lotId === lotId);
    console.log(procurement);
    
    let viewData :any = {   data :cmsData, 
                            agreement_id,
                            lotId:lotId,
                            aggNameText:aggNameText,
                            aggNameValue:aggNameValue,
                            procId: procurement.pocurementID,
                            projectLongName:procurement.defaultName.name,
                            projName
                        };

    res.render('nameAProject', viewData); 
}

export const POST_NAME_PROJECT = async (req : express.Request, res : express.Response)=> {
    var {SESSION_ID} = req.cookies;
    var {procid} = req.query;
    console.log(req.body)
    const nameUpdateUrl = `tenders/projects/${procid}/name`;
    try { 
        const _body = {
            "name": 'test',
          }
        const {data:response} = await TenderApi.Instance(SESSION_ID).put(nameUpdateUrl,_body);
        console.log(response)
    }
    catch(error) { 
        console.log(error);
        
        delete error?.config?.['headers'];
        let Logmessage = {
          "Person_email": TokenDecoder.decoder(SESSION_ID),
           "error_location": `${req.headers.host}${req.originalUrl}`,
           "sessionId": "null",
           "error_reason": "Tender Api - project Name update failed",
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
    res.render('/rfi/rfi-tasklist',{});
}