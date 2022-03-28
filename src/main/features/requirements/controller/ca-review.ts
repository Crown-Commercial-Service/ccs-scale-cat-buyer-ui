// @ts-nocheck
import * as express from 'express';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import * as CMSData from '../../../resources/content/requirements/ca-review.json';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { REQUIREMENT_PATHS } from '../model/requirementConstants';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { OrganizationInstance } from '../util/fetch/organizationuserInstance';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { RFP_PATHS } from '../model/requirementConstants';
import { RemoveDuplicatedList } from '../util/operations/arrayremoveobj';

/**
 *
 * @param req
 * @param res
 * @GETController
 */
export const CA_GET_review = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const {
    lotId,
    agreementLotName,
    agreementName,
    projectId,
    agreement_id,
    releatedContent,
    isError,
    errorText,
    currentEvent,
    designations,
    tableItems,
    dimensions,
  } = req.session;

  const organization_id = req.session.user.payload.ciiOrgId;
  req.session['organizationId'] = organization_id;

  /**
   * @Project_Name
   */

  const project_name = req.session['project_name'];

  /**
   * @project_team
   *
   */

  try {
    const organisation_user_endpoint = `organisation-profiles/${req.session?.['organizationId']}/users`;
    let organisation_user_data: any = await OrganizationInstance.OrganizationUserInstance().get(
      organisation_user_endpoint,
    );
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
    collaboratorData = collaboratorData.data;
    const userData: any = collaboratorData;
    const projectTeam = userData;
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

    const projectLead = [leadUser];
    const windowAppendData = {
      releatedContent,
      data: CMSData,
      project_name,
      projectTeam,
      projectLead,
    };
    res.render('ca-review.njk', windowAppendData);
  } catch (error) {
    console.log(error);
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Tender agreement failed to be added',
      true,
    );
  }
};

/**
 *
 * @param req
 * @param res
 * @POSTController
 */
export const CA_POST_review = async (req: express.Request, res: express.Response) => {};
