//@ts-nocheck
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import * as express from 'express';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { RFI_PATHS } from '../model/rficonstant';
import { RemoveDuplicatedList } from '../util/operations/arrayremoveobj';
import * as cmsData from '../../../resources/content/RFI/addcollaborator.json';
import * as MCF3cmsData from '../../../resources/content/MCF3/RFI/addcollaborator.json';
import { logConstant } from '../../../common/logtracer/logConstant';
import validation from '@nubz/gds-validation';
import { genarateFormValidation } from '../../../errors/controller/formValidation';
import { ppg } from 'main/services/publicProcurementGateway';
// RFI ADD_Collaborator
/**
 *
 * @param req
 * @param res
 */
export const GET_ADD_COLLABORATOR = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const organization_id = req.session.user.ciiOrgId;
  req.session['organizationId'] = organization_id;
  const { isJaggaerError } = req.session;
  req.session['isJaggaerError'] = false;
  const { rfi_collaborators: userParam } = req.query;
  try {
    const organisation_user_data = (
      await ppg.api.organisation.getOrganisationUsers(req.session?.['organizationId'])
    ).unwrap();

    //CAS-INFO-LOG
    LoggTracer.infoLogger(organisation_user_data, logConstant.rfigetUserDetails, req);

    const { pageCount } = organisation_user_data;
    const allUserStorge = [];
    for (let a = 1; a <= pageCount; a++) {
      const organisation_user_data_loop = (
        await ppg.api.organisation.getOrganisationUsers(req.session?.['organizationId'], a)
      ).unwrap();

      const { userList } = organisation_user_data_loop ?? {};
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
    const userIsLead = leadUser?.OCDS.id === req.session.user.sub;
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
    const releatedContent = req.session.releatedContent;
    const agreementId_session = req.session.agreement_id;

    let forceChangeDataJson;
    if (agreementId_session == 'RM6187') {
      //MCF3
      forceChangeDataJson = MCF3cmsData;
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
      releatedContent: releatedContent,
      agreementId_session: req.session.agreement_id,
    };

    //CAS-INFO-LOG
    LoggTracer.infoLogger(null, logConstant.rfiaddColleaguesPageLog, req);

    res.render('add-collaborator-rfi', windowAppendData);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'RFI Add collaborator - Tender agreement failed to be added',
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
  const { rfi_collaborators } = req['body'];
  try {
    const userdetailsData = await getUserData(rfi_collaborators);
    res.status(200).json(userdetailsData);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'RFI Add collaborator - Tender agreement failed to be added',
      true
    );
  }
};

const getUserData = async (user_profile: string) => {
  const userData = (await ppg.api.organisation.getUserProfiles(user_profile)).unwrap();

  const { userName, firstName, lastName, telephone } = userData;
  let userdetailsData = { userName, firstName, lastName };

  if (telephone === undefined) userdetailsData = { ...userdetailsData, tel: 'N/A' };
  else userdetailsData = { ...userdetailsData, tel: telephone };
  return userdetailsData;
};

export const POST_ADD_COLLABORATOR = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { rfi_collaborators } = req['body'];
  if (rfi_collaborators === '') {
    req.session['isJaggaerError'] = true;
    res.redirect('/rfi/add-collaborators');
  } else {
    try {
      const baseURL = `/tenders/projects/${req.session.projectId}/users/${rfi_collaborators}`;
      const userType = {
        userType: 'TEAM_MEMBER',
      };

      try {
        await DynamicFrameworkInstance.Instance(SESSION_ID).put(baseURL, userType);

        //CAS-INFO-LOG
        LoggTracer.infoLogger(null, logConstant.rfiaddColleaguesUpdated, req);

        req.session['searched_user'] = [];
        res.redirect(RFI_PATHS.GET_ADD_COLLABORATOR);
      } catch (err) {
        req.session['isJaggaerError'] = true;
        res.redirect(RFI_PATHS.GET_ADD_COLLABORATOR);
      }
    } catch (error) {
      LoggTracer.errorLogger(
        res,
        error,
        `${req.headers.host}${req.originalUrl}`,
        null,
        TokenDecoder.decoder(SESSION_ID),
        'RFI Add collaborator - Tender agreement failed to be added',
        true
      );
    }
  }
};

export const POST_DELETE_COLLABORATOR_TO_JAGGER = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { id } = req.query;
  try {
    const baseURL = `/tenders/projects/${req.session.projectId}/users/${id}`;

    await DynamicFrameworkInstance.Instance(SESSION_ID).delete(baseURL);

    //CAS-INFO-LOG
    LoggTracer.infoLogger(null, logConstant.addColleaguesDeleted, req);

    req.session['searched_user'] = [];
    res.redirect(RFI_PATHS.GET_ADD_COLLABORATOR);
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
      'RFI Add collaborator - Tender agreement failed to be added',
      !isJaggaerError
    );
    req.session['isJaggaerError'] = isJaggaerError;
    res.redirect('/rfi/add-collaborators');
  }
};

export const POST_ADD_COLLABORATOR_TO_JAGGER = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { rfi_collaborators } = req['body'];
  const fieldValidate = {
    fields: {
      rfi_collaborators: {
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
    res.redirect('/rfi/add-collaborators');
  } else {
    try {
      const baseURL = `/tenders/projects/${req.session.projectId}/users/${rfi_collaborators}`;
      const userType = {
        userType: 'TEAM_MEMBER',
      };

      try {
        await DynamicFrameworkInstance.Instance(SESSION_ID).put(baseURL, userType);
        //CAS-INFO-LOG
        LoggTracer.infoLogger(null, logConstant.rfiaddColleaguesUpdated, req);

        req.session['searched_user'] = [];
        res.redirect(RFI_PATHS.GET_ADD_COLLABORATOR);
      } catch (err) {
        const errorMessage = `You cannot add this user { ${rfi_collaborators} }. Please try with another user`;
        const errors = genarateFormValidation('rfi_collaborators', errorMessage);
        req.session['isJaggaerError'] = errors;
        res.redirect('/rfi/add-collaborators');
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
        'RFI Add collaborator - Tender agreement failed to be added',
        !isJaggaerError
      );
      req.session['isJaggaerError'] = isJaggaerError;
      res.redirect('/rfi/add-collaborators');
    }
  }
};

// /rfi/proceed-collaborators
export const POST_PROCEED_COLLABORATORS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { eventId } = req.session;
  await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/9`, 'Completed');
  res.redirect('/rfi/rfi-tasklist');
};
