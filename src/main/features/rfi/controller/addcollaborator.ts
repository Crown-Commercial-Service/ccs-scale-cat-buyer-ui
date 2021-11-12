import * as express from 'express'
import * as cmsData from '../../../resources/content/RFI/rfiTaskList.json'
import {OrganizationInstance} from '../util/fetch/organizationuserInstance'
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import {DynamicFrameworkInstance} from '../util/fetch/dyanmicframeworkInstance'



// RFI ADD_Collaborator
/**
 * 
 * @param req 
 * @param res 
 */
export const GET_ADD_COLLABORATOR = async (req : express.Request, res : express.Response)=> {
   let {SESSION_ID} = req.cookies;
   let organization_id = req.session.user.payload.ciiOrgId;
   req.session['organizationId'] = organization_id;
   try {
      let organisation_user_endpoint = `organisation-profiles/${req.session?.['organizationId']}/users`
      let organisation_user_data  = await OrganizationInstance.OrganizationUserInstance().get(organisation_user_endpoint);
      organisation_user_data = organisation_user_data?.data;
      let collaborator ;
      let {userName, firstName, lastName} = req.session['searched_user'];
      let fullName = firstName + " " + lastName;
      let procurementId = req.session.procurements?.[0].pocurementID;
      let collaboratorsBaseUrl = `/tenders/projects/${procurementId}/users`
      let collaboratorData = await DynamicFrameworkInstance.Instance(SESSION_ID).get(collaboratorsBaseUrl);
      collaboratorData = collaboratorData.data;

      if(!Array.isArray(req.session['searched_user'])){
         collaborator = {"fullName": fullName, "email": userName};
      }else{
         collaborator = {"fullName": "", "email": ""};
      }
      const windowAppendData = {
         data : cmsData, 
         userdata: organisation_user_data, 
         collaborator: collaborator,
         collaborators : collaboratorData
      }
      res.render('add-collaborator', windowAppendData); 
   } catch (error) {
      console.log(error)
      delete error?.config?.['headers'];
      let Logmessage = {
         "Person_id": TokenDecoder.decoder(SESSION_ID),
         "error_location": `${req.headers.host}${req.originalUrl}`,
         "sessionId": "null",
         "error_reason": "Tender agreement failed to be added",
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





/**
 * 
 * @param req 
 * @param res 
 */
export const POST_ADD_COLLABORATOR = async (req : express.Request, res : express.Response)=> {
   var {SESSION_ID} = req.cookies
   var {rfi_collaborators} = req['body'];
   try {
      let user_profile = rfi_collaborators;
      let userdata_endpoint = `user-profiles?user-Id=${user_profile}`
      let organisation_user_data  = await OrganizationInstance.OrganizationUserInstance().get(userdata_endpoint);
      let userData = organisation_user_data?.data;
      req.session['searched_user'] = userData;
      res.redirect('/rfi/add-collaborators')
   } catch (error) {
      delete error?.config?.['headers'];
      let Logmessage = {
         "Person_id": TokenDecoder.decoder(SESSION_ID),
         "error_location": `${req.headers.host}${req.originalUrl}`,
         "sessionId": "null",
         "error_reason": "Tender agreement failed to be added",
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