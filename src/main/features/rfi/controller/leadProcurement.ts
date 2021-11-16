import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import * as express from 'express'
import {OrganizationInstance} from '../util/fetch/organizationuserInstance'
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';


export const GET_LEAD_PROCUREMENT = async (req : express.Request, res : express.Response)=> { 
   let organization_id = req.session.user.payload.ciiOrgId;
   req.session['organizationId'] = organization_id;
   let {SESSION_ID} = req.cookies;
   const {projectId} = req.session;
   const { sub:defaultLeader } = req.session.user.payload;
   const url = `/tenders/projects/${projectId}/users`;

   try {
    let organisation_user_endpoint = `organisation-profiles/${req.session?.['organizationId']}/users`
    const {data: dataRaw}  = await OrganizationInstance.OrganizationUserInstance().get(organisation_user_endpoint);
    const {userList:userRaw} = dataRaw;
    const users = userRaw.map((user: any) => { return {...user, selected: defaultLeader === user.userName}});
    const finalData = {...dataRaw, userList: users};

    const {data: usersTemp } = await TenderApi.Instance(SESSION_ID).get(url);
    const finalUsersTemp = usersTemp.map((user:any) => user.OCDS.contact);
    const selectedUser = finalUsersTemp.find((user:any) => user.email === defaultLeader);
    
    const windowAppendData = { userdata: finalData, selectedUser}
    res.render('procurementlead', windowAppendData);

   } catch (error) {
    delete error?.config?.['headers'];
    let Logmessage = {
       "Person_id": TokenDecoder.decoder(SESSION_ID),
       "error_location": `${req.headers.host}${req.originalUrl}`,
       "sessionId": "null",
       "error_reason": "Tender Api - getting users from organization or from tenders failed",
       "exception": error
    }
    let Log = new LogMessageFormatter(
       Logmessage.Person_id,
       Logmessage.error_location,
       Logmessage.sessionId,
       Logmessage.error_reason,
       Logmessage.exception
    )
    LoggTracer.errorTracer(Log, res);
       
   }


}

export const POST_LEAD_PROCUREMENT = async (req : express.Request, res : express.Response)=> {
   const {SESSION_ID} = req.cookies; 
   const {projectId} = req.session;
   const {rfi_procurement_lead: userMail} = req.body;
   
   const url = `/tenders/projects/${projectId}/users/${userMail}`;
   try { 
       const _body = {
            "userType": "PROJECT_OWNER"
         }
       await TenderApi.Instance(SESSION_ID).put(url,_body);
       res.redirect('/rfi/rfi-tasklist');
   }
   catch(error) { 
       delete error?.config?.['headers'];
       let Logmessage = {
         "Person_id": TokenDecoder.decoder(SESSION_ID),
          "error_location": `${req.headers.host}${req.originalUrl}`,
          "sessionId": "null",
          "error_reason": "Tender Api - update procurement leader failed",
          "exception": error
         }
      let Log = new LogMessageFormatter(
          Logmessage.Person_id, 
          Logmessage.error_location, 
          Logmessage.sessionId,
          Logmessage.error_reason, 
          Logmessage.exception
          )
          LoggTracer.errorTracer(Log, res);
   }
  
}

export const GET_USER_PROCUREMENT = async (req : express.Request, res : express.Response)=> { 
   const {SESSION_ID} = req.cookies; 
   const {id} = req.query;
   const {projectId} = req.session;
   const url = `/tenders/projects/${projectId}/users`;
   try {
      const {data: users } = await TenderApi.Instance(SESSION_ID).get(url);
      const finalUsers = users.map((user:any) => user.OCDS.contact);
      const selectedUser = finalUsers.find((user:any) => user.email === id);
      res.json(selectedUser);
   }
   catch(error) { 
      delete error?.config?.['headers'];
      let Logmessage = {
        "Person_id": TokenDecoder.decoder(SESSION_ID),
         "error_location": `${req.headers.host}${req.originalUrl}`,
         "sessionId": "null",
         "error_reason": "Tender Api - getting project users failed",
         "exception": error
        }
     let Log = new LogMessageFormatter(
         Logmessage.Person_id, 
         Logmessage.error_location, 
         Logmessage.sessionId,
         Logmessage.error_reason, 
         Logmessage.exception
         )
         LoggTracer.errorTracer(Log, res);
  }
}

