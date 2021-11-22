//@ts-nocheck
import { OrganizationInstance } from './../util/fetch/organizationuserInstance';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import * as express from 'express'
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';


export const GET_LEAD_PROCUREMENT = async (req: express.Request, res: express.Response) => {
   let organization_id = req.session.user.payload.ciiOrgId;
   req.session['organizationId'] = organization_id;
   let { SESSION_ID } = req.cookies;
   const { projectId, isJaggaerError } = req.session;
   req.session['isJaggaerError'] = false;
   const { rfi_procurement_lead: user } = req.query

   const url = `/tenders/projects/${projectId}/users`;
   try {
      const { data: usersTemp } = await TenderApi.Instance(SESSION_ID).get(url);
      let leaderFound = usersTemp.find((user: any) => user.nonOCDS.projectOwner);
      let leader: any;
      if (user) {
         leader = user;
      }
      else if (leaderFound) {
         leader = leaderFound.OCDS.id;
      } else {
         const { sub: defaultLeader } = req.session.user.payload;
         leader = defaultLeader;
      }

      const finalUsersTemp = usersTemp.map((user: any) => user.OCDS.contact);
      const selectedUser = finalUsersTemp.find((user: any) => user.email === leader);
      // const users = finalUsersTemp.map((user: any) => { return { ...user, selected: leader === user.name } });

      const organisation_user_endpoint = `organisation-profiles/${req.session?.['organizationId']}/users`
      const { data: dataRaw } = await OrganizationInstance.OrganizationUserInstance().get(organisation_user_endpoint);
      let { pageCount } = dataRaw;
      let usersRaw = [];
      for (var a = 1; a <= pageCount; a++) {
         let organisation_user_endpoint_loop = `organisation-profiles/${req.session?.['organizationId']}/users?currentPage=${a}`
         let organisation_user_data_loop: any = await OrganizationInstance.OrganizationUserInstance().get(organisation_user_endpoint_loop);
         let { userList } = organisation_user_data_loop?.data;
         usersRaw.push(...userList)
      }
      const lotId = req.session?.lotId;
      const agreementLotName = req.session.agreementLotName;
      const users = usersRaw.map((user: any) => { return { ...user, selected: leader === user.userName } });
      req.session['selectedUser'] = selectedUser;
      req.session['users'] = users;

      const windowAppendData = { userdata: users, selectedUser, lotId, agreementLotName, error: isJaggaerError }
      res.render('procurementLead', windowAppendData);
   } catch (error) {
      LoggTracer.errorLogger(res, error, `${req.headers.host}${req.originalUrl}`, null,
         TokenDecoder.decoder(SESSION_ID), "Tender Api - getting users from organization or from tenders failed", true)
   }
}

export const PUT_LEAD_PROCUREMENT = async (req: express.Request, res: express.Response) => {
   const { SESSION_ID } = req.cookies;
   const { projectId } = req.session;
   const { rfi_procurement_lead_input: userMail } = req.body;
   const url = `/tenders/projects/${projectId}/users/${userMail}`;
   try {
      const _body = {
         "userType": "PROJECT_OWNER"
      }
      await TenderApi.Instance(SESSION_ID).put(url, _body);
      res.redirect('/rfi/add-collaborators');
   }
   catch (error) {
      const isJaggaerError = error.response.data.errors.some((error: any) => error.status.includes('500') && error.detail.includes('Jaggaer'));
      LoggTracer.errorLogger(res, error, `${req.headers.host}${req.originalUrl}`, null,
         TokenDecoder.decoder(SESSION_ID), "Tender Api - getting users from organization or from tenders failed", !isJaggaerError);

      req.session['isJaggaerError'] = isJaggaerError;
      res.redirect('/rfi/procurement-lead');
   }

}

export const GET_USER_PROCUREMENT = async (req: express.Request, res: express.Response) => {
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
   }
   catch (error) {
      LoggTracer.errorLogger(res, error, `${req.headers.host}${req.originalUrl}`, null,
         TokenDecoder.decoder(SESSION_ID), "Tender Api - getting users from organization or from tenders failed", true)
   }
}
