//@ts-nocheck
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import * as express from 'express';
import { OrganizationInstance } from '../util/fetch/organizationuserInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { RFP_PATHS } from '../model/requirementConstants';
import { RemoveDuplicatedList } from '../util/operations/arrayremoveobj';
import * as DaData from '../../../resources/content/da/da-add-collaborator.json';
import { logConstant } from '../../../common/logtracer/logConstant';

// RFI ADD_Collaborator
/**
 *
 * @param req
 * @param res
 */
export const DA_GET_ADD_COLLABORATOR = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const organization_id = req.session.user.payload.ciiOrgId;
  req.session['organizationId'] = organization_id;
  const { isJaggaerError } = req.session;
  req.session['isJaggaerError'] = false;
  try {
    const organisation_user_endpoint = `organisation-profiles/${req.session?.['organizationId']}/users`;
    let organisation_user_data: any = await OrganizationInstance.OrganizationUserInstance().get(
      organisation_user_endpoint,
    );
    //CAS-INFO-LOG
    LoggTracer.infoLogger(organisation_user_data, logConstant.collaboratorDetailFetch, req);

    organisation_user_data = organisation_user_data?.data;
    const { pageCount } = organisation_user_data;
    const allUserStorge = [];
    for (let a = 1; a <= pageCount; a++) {
      const organisation_user_endpoint_loop = `organisation-profiles/${req.session?.['organizationId']}/users?currentPage=${a}`;
      const organisation_user_data_loop: any = await OrganizationInstance.OrganizationUserInstance().get(
        organisation_user_endpoint_loop,
      );
      const { userList } = organisation_user_data_loop?.data;
      allUserStorge.push(...userList);
    }
    let collaborator;
    const { userName, firstName, lastName } = req.session['searched_user'];
    const fullName = firstName + ' ' + lastName;
    const procurementId = req.session.procurements?.[0].procurementID;
    const collaboratorsBaseUrl = `/tenders/projects/${procurementId}/users`;
    let collaboratorData = await DynamicFrameworkInstance.Instance(SESSION_ID).get(collaboratorsBaseUrl);
     //CAS-INFO-LOG
     LoggTracer.infoLogger(collaboratorData, logConstant.userDetailFetch, req);
     
    collaboratorData = collaboratorData.data;
    const userData: any = collaboratorData;
    const leadUser = userData?.filter((leaduser: any) => leaduser?.nonOCDS.projectOwner === true)[0];
    const userIsLead = leadUser?.OCDS.id === req.session.user.payload.sub;
    if (!Array.isArray(req.session['searched_user'])) {
      collaborator = { fullName: fullName, email: userName };
    } else {
      collaborator = { fullName: '', email: '' };
    }
    let filteredListofOrganisationUser = allUserStorge;
    const filteredUser = userData.map(user => {
      return { name: `${user.OCDS.contact.name}`, userName: user.OCDS.id };
    });

    filteredListofOrganisationUser = RemoveDuplicatedList(filteredListofOrganisationUser, filteredUser);

    const lotId = req.session?.lotId;
    const agreementLotName = req.session.agreementLotName;
    const releatedContent = req.session.releatedContent;
  
    const windowAppendData = {
      data: DaData,
      userdata: filteredListofOrganisationUser,
      collaborator: collaborator,
      collaborators: collaboratorData,
      lead: leadUser,
      lotId,
      userIsLead,
      lead_data: leadUser,
      agreementLotName,
      error: isJaggaerError,
      releatedContent: releatedContent,
    };

     //CAS-INFO-LOG
  LoggTracer.infoLogger(null, logConstant.addColleaguesPage, req);
    res.render('daw-add-collaborator', windowAppendData);
  } catch (error) {
    console.log(error);
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'DA Add Collaborator Page',
      true,
    );
  }
};

/**
 *
 * @param req
 * @param res
 */

export const DA_POST_ADD_COLLABORATOR_JSENABLED = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { rfi_collaborators } = req['body'];
  if (rfi_collaborators === '') {
    req.session['isJaggaerError'] = true;
    res.redirect('/da/add-collaborators');
  } else {
    try {
      const user_profile = rfi_collaborators;
      const userdata_endpoint = `user-profiles?user-Id=${user_profile}`;
      const organisation_user_data = await OrganizationInstance.OrganizationUserInstance().get(userdata_endpoint);
       //CAS-INFO-LOG
      LoggTracer.infoLogger(organisation_user_data, logConstant.collaboratorDetailFetch, req);
      
      const userData = organisation_user_data?.data;
      const { userName, firstName, lastName, telephone } = userData;
      let userdetailsData = { userName, firstName, lastName };

      if (telephone === undefined) userdetailsData = { ...userdetailsData, tel: 'N/A' };
      else userdetailsData = { ...userdetailsData, tel: telephone };

      res.status(200).json(userdetailsData);
    } catch (error) {
      LoggTracer.errorLogger(
        res,
        error,
        `${req.headers.host}${req.originalUrl}`,
        null,
        TokenDecoder.decoder(SESSION_ID),
        'DA Add Collaborator Page - Tender agreement failed to be added',
        true,
      );
    }
  }
};

export const DA_POST_ADD_COLLABORATOR = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { rfi_collaborators } = req['body'];
  if (rfi_collaborators === '') {
    req.session['isJaggaerError'] = true;
    res.redirect('/rfi/add-collaborators');
  } else {
    try {
      const user_profile = rfi_collaborators;
      const userdata_endpoint = `user-profiles?user-Id=${user_profile}`;
      const organisation_user_data = await OrganizationInstance.OrganizationUserInstance().get(userdata_endpoint);
       //CAS-INFO-LOG
       LoggTracer.infoLogger(organisation_user_data, logConstant.collaboratorDetailFetch, req);
      
       const userData = organisation_user_data?.data;
      req.session['searched_user'] = userData;
      res.redirect('/da/add-collaborators');
    } catch (error) {
      LoggTracer.errorLogger(
        res,
        error,
        `${req.headers.host}${req.originalUrl}`,
        null,
        TokenDecoder.decoder(SESSION_ID),
        'DA Add Collaborator Page - Tender agreement failed to be added',
        true,
      );
    }
  }
};

export const DA_POST_ADD_COLLABORATOR_TO_JAGGER = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { rfi_collaborator } = req['body'];
  
  if (rfi_collaborator == '') {
    req.session['isJaggaerError'] = true;
    res.redirect('/da/add-collaborators');
  }else{

  

  try {
    const baseURL = `/tenders/projects/${req.session.projectId}/users/${rfi_collaborator}`;
    const userType = {
      userType: 'TEAM_MEMBER',
    };
    const organisation_user_data = await DynamicFrameworkInstance.Instance(SESSION_ID).put(baseURL, userType);
    //CAS-INFO-LOG
    LoggTracer.infoLogger(organisation_user_data, logConstant.collaboratorSave, req);

    req.session['searched_user'] = [];
    res.redirect('/da/add-collaborators');
  } catch (err) {
    const isJaggaerError = err.response.data.errors.some(
      (error: any) => error.status.includes('500') && error.detail.includes('Jaggaer'),
    );
    LoggTracer.errorLogger(
      res,
      err,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'DA Add Collaborator Page - Tender agreement failed to be added',
      !isJaggaerError,
    );
    req.session['isJaggaerError'] = isJaggaerError;
    res.redirect('/da/add-collaborators');
  }
  
  }

};

export const DA_POST_DELETE_COLLABORATOR_TO_JAGGER = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const {id}=req.query;
  try {
    const baseURL = `/tenders/projects/${req.session.projectId}/users/${id}`;
    
    const organisation_user_data = await DynamicFrameworkInstance.Instance(SESSION_ID).delete(baseURL);
    //CAS-INFO-LOG
    LoggTracer.infoLogger(organisation_user_data, logConstant.collaboratorDelete, req);
    req.session['searched_user'] = [];
    res.redirect('/da/add-collaborators');
  } catch (err) {
    const isJaggaerError = err.response.data.errors.some(
      (error: any) => error.status.includes('500') && error.detail.includes('Jaggaer'),
    );
    LoggTracer.errorLogger(
      res,
      err,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'DA Add Collaborator Page - Tender agreement failed to be added',
      !isJaggaerError,
    );
    req.session['isJaggaerError'] = isJaggaerError;
    res.redirect('/da/add-collaborators');
  }
};

// /rfp/proceed-collaborators
export const DA_POST_PROCEED_COLLABORATORS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { eventId } = req.session;
  await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/29`, 'Completed');
  if(req.session.unpublishedeventmanagement=="true")
  {
    res.redirect('/da/rfp-unpublishedeventmanagement');
  }
  else{
  res.redirect('/da/task-list');
  
  }
};
