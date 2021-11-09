import * as express from 'express'



export const GET_LEAD_PROCUREMENT = async (req : express.Request, res : express.Response)=> { 

    res.render('leadexample')

}


/**
 * 
 * 
 * 
 * 
 * 
 * import {OrganizationInstance} from '../util/fetch/organizationuserInstance'
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
 * 
 * 
 * 
 *     let organization_id = req.session.user.payload.ciiOrgId;
   req.session['organizationId'] = organization_id;
   let {SESSION_ID} = req.cookies;
   try {


    let organisation_user_endpoint = `organisation-profiles/${req.session?.['organizationId']}/users`
    let organisation_user_data  = await OrganizationInstance.OrganizationUserInstance().get(organisation_user_endpoint);
    organisation_user_data = organisation_user_data?.data
    const windowAppendData = { userdata: organisation_user_data}
     res.render('procurementlead', windowAppendData);



   } catch (error) {
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

   



 * 
 */