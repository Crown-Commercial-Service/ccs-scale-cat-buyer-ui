//@ts-nocheck
import * as express from 'express'
import * as cmsData from '../../../resources/content/RFI/rfiTaskList.json'
import { OrganizationInstance } from '../util/fetch/organizationuserInstance'
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance'
import { RFI_PATHS } from "../model/rficonstant"
import {RemoveDuplicatedList} from '../util/operations/arrayremoveobj'


// RFI ADD_Collaborator
/**
 * 
 * @param req 
 * @param res 
 */
export const GET_ADD_COLLABORATOR = async (req: express.Request, res: express.Response) => {
   let { SESSION_ID } = req.cookies;
   let organization_id = req.session.user.payload.ciiOrgId;
   req.session['organizationId'] = organization_id;
   const { isJaggaerError } = req.session;
   req.session['isJaggaerError'] = false;
   try {
      let organisation_user_endpoint = `organisation-profiles/${req.session?.['organizationId']}/users`
      let organisation_user_data: any = await OrganizationInstance.OrganizationUserInstance().get(organisation_user_endpoint);
      organisation_user_data = organisation_user_data?.data;
      let { pageCount } = organisation_user_data;
      let allUserStorge = [];
      for (var a = 1; a <= pageCount; a++) {
         let organisation_user_endpoint_loop = `organisation-profiles/${req.session?.['organizationId']}/users?currentPage=${a}`
         let organisation_user_data_loop: any = await OrganizationInstance.OrganizationUserInstance().get(organisation_user_endpoint_loop);
         let { userList } = organisation_user_data_loop?.data;
         allUserStorge.push(...userList)
      }
      let collaborator;
      let { userName, firstName, lastName } = req.session['searched_user'];
      let fullName = firstName + " " + lastName;
      let procurementId = req.session.procurements?.[0].procurementID;
      let collaboratorsBaseUrl = `/tenders/projects/${procurementId}/users`
      let collaboratorData = await DynamicFrameworkInstance.Instance(SESSION_ID).get(collaboratorsBaseUrl);
      collaboratorData = collaboratorData.data;
      let userData: any = collaboratorData;
      let leadUser = userData?.filter((leaduser: any) => leaduser?.nonOCDS.projectOwner === true)[0];
      let userIsLead = leadUser?.OCDS.id === req.session.user.payload.sub;
      if (!Array.isArray(req.session['searched_user'])) {
         collaborator = { "fullName": fullName, "email": userName };
      } else {
         collaborator = { "fullName": "", "email": "" };
      }
      let filteredListofOrganisationUser = allUserStorge;
      let filteredUser = userData.map((user)=> {
         return {name: `${user.OCDS.contact.name}`, userName: user.OCDS.id}
      })

      filteredListofOrganisationUser = RemoveDuplicatedList(filteredListofOrganisationUser, filteredUser);
   
      const lotId = req.session?.lotId;
      const agreementLotName = req.session.agreementLotName;
      const windowAppendData = {
         data: cmsData,
         userdata: filteredListofOrganisationUser,
         collaborator: collaborator,
         collaborators: collaboratorData,
         lead: leadUser,
         lotId,
         userIsLead,
         lead_data: leadUser,
         agreementLotName,
         error: isJaggaerError
      }
      res.render('add-collaborator', windowAppendData);
   } catch (error) {
      LoggTracer.errorLogger(res, error, `${req.headers.host}${req.originalUrl}`, null,
         TokenDecoder.decoder(SESSION_ID), "Tender agreement failed to be added", true)
   }
}

/**
 * 
 * @param req 
 * @param res 
 */

 export const POST_ADD_COLLABORATOR_JSENABLED = async (req: express.Request, res: express.Response) => {
   var { SESSION_ID } = req.cookies
   var { rfi_collaborators } = req['body'];
   try {
      let user_profile = rfi_collaborators;
      let userdata_endpoint = `user-profiles?user-Id=${user_profile}`
      let organisation_user_data = await OrganizationInstance.OrganizationUserInstance().get(userdata_endpoint);
      let userData = organisation_user_data?.data;
      let {userName,firstName, lastName, telephone } = userData;
      let userdetailsData = {userName, firstName, lastName}

      if(telephone === undefined) userdetailsData = {...userdetailsData, tel: "N/A"}
      else  userdetailsData = {...userdetailsData, tel: telephone}
      
      res.status(200).json(userdetailsData);
   } catch (error) {
      LoggTracer.errorLogger(res, error, `${req.headers.host}${req.originalUrl}`, null,
         TokenDecoder.decoder(SESSION_ID), "Tender agreement failed to be added", true)
   }
}




export const POST_ADD_COLLABORATOR = async (req: express.Request, res: express.Response) => {
   var { SESSION_ID } = req.cookies
   var { rfi_collaborators } = req['body'];
   try {
      let user_profile = rfi_collaborators;
      let userdata_endpoint = `user-profiles?user-Id=${user_profile}`
      let organisation_user_data = await OrganizationInstance.OrganizationUserInstance().get(userdata_endpoint);
      let userData = organisation_user_data?.data;
      req.session['searched_user'] = userData;
      res.redirect(RFI_PATHS.GET_ADD_COLLABORATOR);
   } catch (error) {
      LoggTracer.errorLogger(res, error, `${req.headers.host}${req.originalUrl}`, null,
         TokenDecoder.decoder(SESSION_ID), "Tender agreement failed to be added", true)
   }
}

export const POST_ADD_COLLABORATOR_TO_JAGGER = async (req: express.Request, res: express.Response) => {
   var { SESSION_ID } = req.cookies
   var { rfi_collaborator } = req['body'];
   try {
      let baseURL = `/tenders/projects/${req.session.projectId}/users/${rfi_collaborator}`
      let userType = {
         "userType": "TEAM_MEMBER"
      }
      await DynamicFrameworkInstance.Instance(SESSION_ID).put(baseURL, userType);
      res.redirect(RFI_PATHS.GET_ADD_COLLABORATOR)
   } catch (err) {
      const isJaggaerError = err.response.data.errors.some((error: any) => error.status.includes('500') && error.detail.includes('Jaggaer'));
      LoggTracer.errorLogger(res, err, `${req.headers.host}${req.originalUrl}`, null,
         TokenDecoder.decoder(SESSION_ID), "Tender agreement failed to be added", !isJaggaerError)
      req.session['isJaggaerError'] = isJaggaerError;
      res.redirect('/rfi/add-collaborators');
   }
}

// /rfi/proceed-collaborators
export const POST_PROCEED_COLLABORATORS = async (req: express.Request, res: express.Response) => {
   res.redirect('/rfi/rfi-tasklist')
}
