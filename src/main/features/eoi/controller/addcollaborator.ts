//@ts-nocheck
import * as express from 'express';
import { OrganizationInstance } from '../util/fetch/organizationuserInstance';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { EOI_PATHS } from '../model/eoiconstant';
import { RemoveDuplicatedList } from '../util/operations/arrayremoveobj';
import * as cmsData from '../../../resources/content/eoi/addcollaborator.json';
import * as Mcf3cmsData from '../../../resources/content/MCF3/eoi/addcollaborator.json';
import { logConstant } from '../../../common/logtracer/logConstant';
import validation from '@nubz/gds-validation';
import { genarateFormValidation } from '../../../errors/controller/formValidation';

// EOI ADD_Collaborator
/**
 *
 * @param req
 * @param res
 */
export const GET_ADD_COLLABORATOR = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const organization_id = req.session.user.payload.ciiOrgId;
  req.session['organizationId'] = organization_id;
  const { isJaggaerError } = req.session;
  req.session['isJaggaerError'] = false;
  const { eoi_collaborators: userParam } = req.query;
  try {
    const organisation_user_endpoint = `organisation-profiles/${req.session?.['organizationId']}/users`;
    let organisation_user_data: any = await OrganizationInstance.OrganizationUserInstance().get(
      organisation_user_endpoint
    );

    //CAS-INFO-LOG
    LoggTracer.infoLogger(organisation_user_data, logConstant.getUserDetails, req);

    organisation_user_data = organisation_user_data?.data;
    const { pageCount } = organisation_user_data;
    const allUserStorge = [];
    for (let a = 1; a <= pageCount; a++) {
      const organisation_user_endpoint_loop = `organisation-profiles/${req.session?.['organizationId']}/users?currentPage=${a}`;
      const organisation_user_data_loop: any = await OrganizationInstance.OrganizationUserInstance().get(
        organisation_user_endpoint_loop
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
    const filteredUser = userData.map((user) => {
      return { name: `${user.OCDS.contact.name}`, userName: user.OCDS.id };
    });

    filteredListofOrganisationUser = RemoveDuplicatedList(filteredListofOrganisationUser, filteredUser);

    const lotId = req.session?.lotId;
    const agreementLotName = req.session.agreementLotName;

    const agreementId_session = req.session.agreement_id;
    let forceChangeDataJson;
    if (agreementId_session == 'RM6187') {
      //MCF3
      forceChangeDataJson = Mcf3cmsData;
    } else {
      forceChangeDataJson = cmsData;
    }

    if (userParam) {
      const { userName, firstName, lastName, tel } = await getUserData(userParam);
      collaborator = { email: userName, fullName: `${firstName} ${lastName}`, tel };
    }

    const windowAppendData = {
      data: forceChangeDataJson,
      userdata: filteredListofOrganisationUser,
      collaborator: collaborator,
      collaborators: collaboratorData,
      lead: leadUser,
      lotId,
      userIsLead,
      lead_data: leadUser,
      agreementLotName,
      error: isJaggaerError,
      releatedContent: req.session.releatedContent,
      agreementId_session: req.session.agreement_id,
    };

    //CAS-INFO-LOG
    LoggTracer.infoLogger(null, logConstant.addColleaguesPage, req);

    res.render('add-collaborator-eoi', windowAppendData);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'EOI Add Collaborator - Tender agreement failed to be added',
      true
    );
  }
};

/**
 *
 * @param req
 * @param res
 */

export const POST_ADD_COLLABORATOR_JSENABLED = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { eoi_collaborators } = req['body'];
  try {
    const userdetailsData = await getUserData(eoi_collaborators);
    res.status(200).json(userdetailsData);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'EOI Add Collaborator - Tender agreement failed to be added',
      true
    );
  }
};

const getUserData = async (user_profile: string) => {
  const userdata_endpoint = `user-profiles?user-Id=${user_profile}`;
  const organisation_user_data = await OrganizationInstance.OrganizationUserInstance().get(userdata_endpoint);
  const userData = organisation_user_data?.data;

  const { userName, firstName, lastName, telephone } = userData;
  let userdetailsData = { userName, firstName, lastName };

  if (telephone === undefined) userdetailsData = { ...userdetailsData, tel: 'N/A' };
  else userdetailsData = { ...userdetailsData, tel: telephone };
  return userdetailsData;
};

export const POST_ADD_COLLABORATOR = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { eoi_collaborators } = req['body'];

  if (eoi_collaborators === '') {
    req.session['isJaggaerError'] = true;
    res.redirect('/eoi/add-collaborators');
  } else {
    try {
      const user_profile = eoi_collaborators;
      //const userdata_endpoint = `user-profiles?user-Id=${user_profile}`;
      // const organisation_user_data = await OrganizationInstance.OrganizationUserInstance().get(userdata_endpoint);
      // const userData = organisation_user_data?.data;
      const baseURL = `/tenders/projects/${req.session.projectId}/users/${eoi_collaborators}`;
      const userType = {
        userType: 'TEAM_MEMBER',
      };
      try {
        await DynamicFrameworkInstance.Instance(SESSION_ID).put(baseURL, userType);

        //CAS-INFO-LOG
        LoggTracer.infoLogger(null, logConstant.addColleaguesUpdated, req);

        req.session['searched_user'] = [];
        res.redirect(EOI_PATHS.GET_ADD_COLLABORATOR);
      } catch (err) {
        req.session['isJaggaerError'] = true;
        res.redirect('/eoi/add-collaborators');
      }
    } catch (error) {
      LoggTracer.errorLogger(
        res,
        error,
        `${req.headers.host}${req.originalUrl}`,
        null,
        TokenDecoder.decoder(SESSION_ID),
        'EOI Add Collaborator - Tender agreement failed to be added',
        true
      );
    }
  }
};

export const POST_ADD_COLLABORATOR_TO_JAGGER = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { eoi_collaborators } = req['body'];
  const fieldValidate = {
    fields: {
      eoi_collaborators: {
        type: 'nonEmptyString',
        name: 'Add colleagues',
        errors: {
          required: 'Colleagues must be selected from the list',
        },
      },
    },
  };
  const errors = validation.getPageErrors(req.body, fieldValidate);
  if (errors.hasErrors) {
    req.session['isJaggaerError'] = errors;
    res.redirect('/eoi/add-collaborators');
  } else {
    try {
      const baseURL = `/tenders/projects/${req.session.projectId}/users/${eoi_collaborators}`;
      const userType = {
        userType: 'TEAM_MEMBER',
      };

      try {
        await DynamicFrameworkInstance.Instance(SESSION_ID).put(baseURL, userType);
        LoggTracer.infoLogger(null, logConstant.addColleaguesUpdated, req);
        req.session['searched_user'] = [];
        res.redirect(EOI_PATHS.GET_ADD_COLLABORATOR);
      } catch (err) {
        const errorMessage = `You cannot add this user{ ${eoi_collaborators} }. Please try with another user`;
        const errors = genarateFormValidation('eoi_collaborators', errorMessage);
        req.session['isJaggaerError'] = errors;
        res.redirect('/eoi/add-collaborators');
      }
    } catch (err) {
      const isJaggaerError = err.response.data.errors.some(
        (error: any) => error.status.includes('500') && error.detail.includes('Jaggaer')
      );
      LoggTracer.errorLogger(
        res,
        err,
        `${req.headers.host}${req.originalUrl}`,
        null,
        TokenDecoder.decoder(SESSION_ID),
        'EOI Add Collaborator - Tender agreement failed to be added',
        !isJaggaerError
      );
      req.session['isJaggaerError'] = isJaggaerError;
      res.redirect('/eoi/add-collaborators');
    }
  }
};

export const GET_DELETE_COLLABORATOR_TO_JAGGER = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { userid } = req.query;

  try {
    const baseURL = `/tenders/projects/${req.session.projectId}/users/${userid}`;

    await DynamicFrameworkInstance.Instance(SESSION_ID).delete(baseURL);

    //CAS-INFO-LOG
    LoggTracer.infoLogger(null, logConstant.addColleaguesDeleted, req);

    req.session['searched_user'] = [];
    res.redirect(EOI_PATHS.GET_ADD_COLLABORATOR);
  } catch (err) {
    const isJaggaerError = err.response.data.errors.some(
      (error: any) => error.status.includes('500') && error.detail.includes('Jaggaer')
    );
    LoggTracer.errorLogger(
      res,
      err,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'EOI Add Collaborator - Tender agreement failed to be added',
      !isJaggaerError
    );
    req.session['isJaggaerError'] = isJaggaerError;
    res.redirect('/eoi/add-collaborators');
  }
};

// /eoi/proceed-collaborators
export const POST_PROCEED_COLLABORATORS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { eventId } = req.session;
  await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/18`, 'Completed');
  res.redirect('/eoi/eoi-tasklist');
};
