import * as express from 'express'
import * as cmsData from '../../../resources/content/RFI/nameYourProject.json';
import procurementDetail from '../model/procurementDetail'
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance'
// import {RFI_PATHS} from '../model/rficonstant'
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import { HttpStatusCode } from '../../../errors/httpStatusCodes';




export const GET_NAME_PROJECT = async (req : express.Request, res : express.Response)=> {    
    const procurements = req.session.procurements;
    var lotId = req.session.lotId;
    let procurement:procurementDetail = procurements.find((proc: any) => proc.defaultName.components.lotId === lotId);
    const project_name = req.session.project_name;
    let viewData :any = {   data :cmsData,                 
                            procId: procurement.pocurementID,
                            projectLongName:project_name,
                        };

    res.render('nameAProject', viewData); 
}

export const POST_NAME_PROJECT = async (req : express.Request, res : express.Response)=> {
    var {SESSION_ID} = req.cookies; //jwt
    var {procid} = req.query;
    var name = req.body['rfi_projLongName'];
    const nameUpdateUrl = `tenders/projects/${procid}/name`;
    try { 
        const _body = {
            "name": name,
          }
        var response = await TenderApi.Instance(SESSION_ID).put(nameUpdateUrl,_body);
        if(response.status == HttpStatusCode.OK)
        req.session.project_name = name;
        res.redirect('/rfi/procurement-lead');
    }
    catch(error) { 
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
   
}