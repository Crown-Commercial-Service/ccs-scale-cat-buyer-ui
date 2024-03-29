//@ts-nocheck
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import * as express from 'express';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { logConstant } from '../../../common/logtracer/logConstant';
import { ppg } from 'main/services/publicProcurementGateway';

export const DA_GET_LEAD_PROCUREMENT = async (req: express.Request, res: express.Response) => {
  const organization_id = req.session.user.ciiOrgId;
  req.session['organizationId'] = organization_id;
  const { SESSION_ID } = req.cookies;
  const { projectId, isJaggaerError } = req.session;
  req.session['isJaggaerError'] = false;
  const { rfp_procurement_lead: userParam } = req.query;
  const releatedContent = req.session.releatedContent;

  const url = `/tenders/projects/${projectId}/users`;
  try {
    let usersTemp = await TenderApi.Instance(SESSION_ID).get(url);
    //CAS-INFO-LOG
    LoggTracer.infoLogger(usersTemp, logConstant.userDetailFetch, req);
    usersTemp = usersTemp.data;
    const organisation_user_data = (
      await ppg.api.organisation.getOrganisationUsers(req.session?.['organizationId'])
    ).unwrap();
    //CAS-INFO-LOG
    LoggTracer.infoLogger(organisation_user_data, logConstant.collaboratorDetailFetch, req);

    const { pageCount } = organisation_user_data;
    const usersRaw = [];
    for (let a = 1; a <= pageCount; a++) {
      const organisation_user_data_loop = (
        await ppg.api.organisation.getOrganisationUsers(req.session?.['organizationId'], a)
      ).unwrap();

      const { userList } = organisation_user_data_loop ?? {};
      usersRaw.push(...userList);
    }

    const leaderFound = usersTemp.find((user: any) => user.nonOCDS.projectOwner);
    let leader: any;
    let selectedUser: any;
    if (userParam) {
      leader = userParam;
      const { name, userName: email } = usersRaw.find((user: any) => user.userName === leader);
      selectedUser = { name, email, telephone: 1 };
    } else {
      if (leaderFound) {
        leader = leaderFound.OCDS.id;
      } else {
        const { sub: defaultLeader } = req.session.user;
        leader = defaultLeader;
      }
      const finalUsersTemp = usersTemp.map((user: any) => user.OCDS.contact);
      selectedUser = finalUsersTemp.find((user: any) => user.email === leader);
    }
    const lotId = req.session?.lotId;
    const agreementLotName = req.session.agreementLotName;
    const users = usersRaw.map((user: any) => {
      return { ...user, selected: leader === user.userName };
    });

    req.session['selectedUser'] = selectedUser;
    req.session['users'] = users;

    const agreementId_session = req.session.agreement_id;
    const windowAppendData = {
      userdata: users,
      selectedUser,
      lotId,
      agreementLotName,
      error: isJaggaerError,
      releatedContent,
      agreementId_session,
    };
    //CAS-INFO-LOG
    LoggTracer.infoLogger(null, logConstant.procurementPage, req);
    res.render('daw-procurementLead', windowAppendData);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'DA Lead Procurement - Tender Api - getting users from organization or from tenders failed',
      true
    );
  }
};

export const DA_PUT_LEAD_PROCUREMENT = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId, eventId } = req.session;
  const { rfp_procurement_lead_input: userMail } = req.body;
  const url = `/tenders/projects/${projectId}/users/${userMail}`;
  try {
    const _body = {
      userType: 'PROJECT_OWNER',
    };
    const response = await TenderApi.Instance(SESSION_ID).put(url, _body);
    //CAS-INFO-LOG
    LoggTracer.infoLogger(response, logConstant.saveLeadProcurement, req);

    await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/28`, 'Completed');

    res.redirect('/da/add-collaborators');
  } catch (error) {
    const isJaggaerError = error.response.data.errors.some(
      (error: any) => error.status.includes('500') && error.detail.includes('Jaggaer')
    );
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'DA Lead Procurement - Tender Api - getting users from organization or from tenders failed',
      !isJaggaerError
    );

    req.session['isJaggaerError'] = isJaggaerError;
    res.redirect('/daw/procurement-lead');
  }
};

export const DA_GET_USER_PROCUREMENT = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { id } = req.query;
  try {
    const { users } = req.session;
    users.forEach((user: any) => {
      user.selected = false;
    });
    const selectedUserNum = users.findIndex((user: any) => user.userName === id);

    const selectedUser = users[selectedUserNum];
    users[selectedUserNum].selected = false;
    req.session['users'] = users;
    res.json(selectedUser);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'DA Lead Procurement - Tender Api - getting users from organization or from tenders failed',
      true
    );
  }
};
