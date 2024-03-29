//@ts-nocheck
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import * as express from 'express';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { RFP_PATHS } from '../model/requirementConstants';
import { RemoveDuplicatedList } from '../util/operations/arrayremoveobj';
import * as cmsData from '../../../resources/content/requirements/addcollaborator.json';
import * as Mcf3cmsData from '../../../resources/content/MCF3/requirements/da-add-collaborator.json';
import { ppg } from 'main/services/publicProcurementGateway';

// RFI ADD_Collaborator
/**
 *
 * @param req
 * @param res
 */
export const DA_GET_ADD_COLLABORATOR = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const organization_id = req.session.user.ciiOrgId;
  req.session['organizationId'] = organization_id;
  const { isJaggaerError, choosenViewPath } = req.session;
  req.session['isJaggaerError'] = false;
  try {
    const organisation_user_data = (
      await ppg.api.organisation.getOrganisationUsers(req.session?.['organizationId'])
    ).unwrap();

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
      forceChangeDataJson = Mcf3cmsData;
    } else {
      forceChangeDataJson = cmsData;
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
      choosenViewPath: choosenViewPath,
    };
    res.render('da-add-collaborator', windowAppendData);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Tender agreement failed to be added',
      true
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
  try {
    const user_profile = rfi_collaborators;
    const userData = (await ppg.api.organisation.getUserProfiles(user_profile)).unwrap();
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
      'Tender agreement failed to be added',
      true
    );
  }
};

export const DA_POST_ADD_COLLABORATOR = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { rfi_collaborators } = req['body'];

  if (rfi_collaborators == '') {
    req.session['isJaggaerError'] = true;
    res.redirect('da/add-collaborators');
  } else {
    try {
      const user_profile = rfi_collaborators;
      const userData = (await ppg.api.organisation.getUserProfiles(user_profile)).unwrap();
      req.session['searched_user'] = userData;
      res.redirect('/da/add-collaborators');
    } catch (error) {
      LoggTracer.errorLogger(
        res,
        error,
        `${req.headers.host}${req.originalUrl}`,
        null,
        TokenDecoder.decoder(SESSION_ID),
        'Tender agreement failed to be added',
        true
      );
    }
  }
};

export const DA_POST_ADD_COLLABORATOR_TO_JAGGER = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { rfi_collaborator } = req['body'];
  try {
    const baseURL = `/tenders/projects/${req.session.projectId}/users/${rfi_collaborator}`;
    const userType = {
      userType: 'TEAM_MEMBER',
    };
    await DynamicFrameworkInstance.Instance(SESSION_ID).put(baseURL, userType);
    req.session['searched_user'] = [];
    res.redirect('/da/add-collaborators');
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
      'Tender agreement failed to be added',
      !isJaggaerError
    );
    req.session['isJaggaerError'] = isJaggaerError;
    res.redirect('/da/add-collaborators');
  }
};

export const DA_POST_DELETE_COLLABORATOR_TO_JAGGER = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { id } = req.query;
  try {
    const baseURL = `/tenders/projects/${req.session.projectId}/users/${id}`;

    await DynamicFrameworkInstance.Instance(SESSION_ID).delete(baseURL);
    req.session['searched_user'] = [];
    res.redirect('/da/add-collaborators');
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
      'Tender agreement failed to be added',
      !isJaggaerError
    );
    req.session['isJaggaerError'] = isJaggaerError;
    res.redirect('/da/add-collaborators');
  }
};

// /rfp/proceed-collaborators
export const DA_POST_PROCEED_COLLABORATORS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  try {
    const { projectId, eventId } = req.session;
    await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/62`, 'Completed');
    res.redirect(`/da/task-list?path=${req.session['choosenViewPath']}`);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Tender agreement failed to be added',
      true
    );
  }
};
