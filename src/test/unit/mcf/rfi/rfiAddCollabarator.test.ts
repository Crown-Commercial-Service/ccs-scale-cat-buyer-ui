//@ts-nocheck

import { expect } from 'chai';
let chais = require("chai");
let chaiHttp = require("chai-http");
import request from 'supertest';
import { app } from '../../../main/app';
import nock from 'nock';
import express from 'express';
import { createDummyJwt } from 'test/utils/auth';
const environentVar = require('dotenv').config();
const { parsed: envs } = environentVar;
import { JSDOM } from 'jsdom';
import { getToken } from 'test/utils/getToken';
chais.should();
chais.use(chaiHttp);

describe('DOS6 : Add collaborator',function() {
    //this.timeout(50000);
    let parentApp;
    let OauthToken;
    const eventId = 12;
    const procurementId = 23;
    const projectId = 987;
    const organizationId = 234;

  beforeEach(async function () {
    OauthToken = await getToken();
    parentApp = express();
    parentApp.use(function (req, res, next) {
      // lets stub session middleware
      const procurementDummy = { procurementID: procurementId, defaultName: { components: { lotId: 1 } } };
      req.session = {
        lotId: 1,
        eventId,
        agreement_id: 'RM1043.8',
        agreementLotName: 'test',
        access_token: OauthToken,
        cookie: {},
        procurements: [procurementDummy],
        user: { payload: { ciiOrgId: organizationId } },
        projectId,
        searched_user: { userName: 'dummyName', firstName: 'dummyFirst', lastName: 'dummyLast' },
      };
      next();
    });
    parentApp.use(app);
});

  it('should be able to get addCollaborator page', async () => {
    const dummyUsers = [
      {
        OCDS: { id: 'dummy1', contact: { email: 'dummyEmail1@dummyServer.com' } },
        nonOCDS: { teamMember: true, emailRecipient: false, projectOwner: false },
      },
      {
        OCDS: { id: 'dummy2', contact: { email: 'dummyEmail2@dummyServer.com' } },
        nonOCDS: { teamMember: true, emailRecipient: true, projectOwner: true },
      },
    ];
    // nock(process.env['CONCLAVE_WRAPPER_API_BASE_URL']).defaultReplyHeaders({
    //         'Content-Type': 'application/json',
    //         'x-api-key': `${process.env['CONCLAVE_WRAPPER_API_KEY']}`
    // }).get(`/organisation-profiles/${organizationId}/users`).reply(200, true);
    nock(envs.TENDERS_SERVICE_API_URL).get(`/tenders/projects/${procurementId}/users`).reply(200, dummyUsers);
    await request(parentApp)
      .get('/rfp/add-collaborators')
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(200);
        const dom = new JSDOM(res.text);
        const { textContent } = dom.window.document.querySelector('title');
        expect(textContent).contains('Add colleagues');
      });
  });

//   it('should be able to do post with js enabled and phone in service', async () => {
//     const collaboratorDummy = 'dummy1';
//     const dummyUser = {
//       userName: 'a',
//       firstName: 'b',
//       lastName: 'c',
//       telephone: 'd',
//     };
//     // nock('https://tst.api.crowncommercial.gov.uk')
//     //   .get(`/user-profiles?user-Id=${collaboratorDummy}`)
//     //   .reply(200, dummyUser);
//     await request(parentApp)
//       .post('/rfp/get-collaborator-detail/js-enabled')
//       .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
//       .send({ rfi_collaborators: collaboratorDummy })
//       .expect(res => {
        
//         expect(res.body).to.have.property('userName');
//         expect(res.body).to.have.property('firstName');
//         expect(res.body).to.have.property('lastName');
//         expect(res.body).to.have.property('tel');
//         expect(res.body.tel).to.equal(dummyUser.telephone);
//         expect(res.status).to.equal(200);
//       });
//   });

//   it('should be able to do post with js enabled and no phone in service', async () => {
//     const collaboratorDummy = 'dummy1';
//     const dummyUserNoPhone = {
//       userName: 'a',
//       firstName: 'b',
//       lastName: 'c',
//     };
//     // nock('https://tst.api.crowncommercial.gov.uk')
//     //   .get(`/user-profiles?user-Id=${collaboratorDummy}`)
//     //   .reply(200, dummyUserNoPhone);
//     await request(parentApp)
//       .post('/rfp/get-collaborator-detail/js-enabled')
//       .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
//       .send({ rfi_collaborators: collaboratorDummy })
//       .expect(res => {
//         expect(res.body).to.have.property('userName');
//         expect(res.body).to.have.property('firstName');
//         expect(res.body).to.have.property('lastName');
//         expect(res.body).to.have.property('tel');
//         expect(res.body.tel).to.equal('N/A');
//         expect(res.status).to.equal(200);
//       });
//   });

//   it('should be able to do post', async () => {
//     const collaboratorDummy = 'dummy1';
//     await request(parentApp)
//       .post('/rfp/get-collaborator-detail')
//       .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
//       .send({ rfi_collaborators: collaboratorDummy })
//       .expect(res => {
//         expect(res.status).to.equal(302);
//         expect(res.header.location).to.be.equal('/rfi/add-collaborators');
//       });
//   });

//       it('should be able to do post to jaggaer', async () => {
//         const collaboratorDummy = 'dummy1';
//         const dummyUserNoPhone = {
//           userName: 'a',
//           firstName: 'b',
//           lastName: 'c',
//         };
//         nock(envs.TENDERS_SERVICE_API_URL)
//           .put(`/tenders/projects/${projectId}/users/${collaboratorDummy}`)
//           .reply(200, dummyUserNoPhone);
//         await request(parentApp)
//           .post('/rfp/add-collaborator-detail')
//           .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
//           .send({ rfi_collaborator: collaboratorDummy })
//           .expect(res => {
//             expect(res.status).to.equal(302);
//             expect(res.header.location).to.be.equal('/rfp/add-collaborators');
//           });
//       });

//       it('should be able to proceed to tasklist', async () => {
//         nock(envs.TENDERS_SERVICE_API_URL).put(`/journeys/${eventId}/steps/29`).reply(200, true);
//         const startTime = process.hrtime();
//         await request(parentApp)
//           .post('/rfp/proceed-collaborators')
//           .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
//           .expect(res => {
//             expect(res.status).to.equal(302);
//             const timeDifference = process.hrtime(startTime);
//             console.log(`Request took ${timeDifference[0] * 1e9 + timeDifference[1]} nanoseconds`);
//             expect(res.header.location).to.be.equal('/rfp/task-list');
//           });
//       });
});
