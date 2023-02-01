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

describe('DOS6 : Add collaborator', async function() {
  this.timeout(0);
    let parentApp;
    let OauthToken;
    const eventId = process.env.eventId;
    const procurementId = process.env.proc_id;
    const projectId = process.env.projectId;
    const agreementLotName = process.env.agreementLotName;
    const lotId = process.env.lotid;
    const organizationId = '669821636384259971';

  before(async function () {
    OauthToken = await getToken();
    parentApp = express();
    parentApp.use(function (req, res, next) {
      // lets stub session middleware 
      const procurementDummy = { procurementID: procurementId, defaultName: { components: { lotId: lotId } } };
      req.session = {
        lotId: lotId,
        eventId,
        agreement_id: 'RM1043.8',
        agreementLotName: `${agreementLotName}`,
        access_token: OauthToken,
        cookie: {},
        procurements: [procurementDummy],
        user: { payload: { ciiOrgId: organizationId } },
        organizationId: organizationId,
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
    nock(envs.TENDERS_SERVICE_API_URL).get(`/tenders/projects/${procurementId}/users`).reply(200, dummyUsers);
    await request(parentApp)
      .get('/rfp/add-collaborators')
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(200);
      });
  }).timeout(0);

  it('should be able to do post', async () => {
    const collaboratorDummy = 'dummy1';
    await request(parentApp)
      .post('/rfp/get-collaborator-detail')
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .send({ rfi_collaborators: collaboratorDummy })
      .expect(res => {
        expect(res.status).to.equal(302);
        expect(res.header.location).to.be.equal('/rfi/add-collaborators');
      });
  }).timeout(0);

  it('should be able to do post to jaggaer', async () => {
    const collaboratorDummy = 'dummy1';
    const dummyUserNoPhone = {
      userName: 'a',
      firstName: 'b',
      lastName: 'c',
    };
    nock(envs.TENDERS_SERVICE_API_URL)
      .put(`/tenders/projects/${projectId}/users/${collaboratorDummy}`)
      .reply(200, dummyUserNoPhone);
    await request(parentApp)
      .post('/rfp/add-collaborator-detail')
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .send({ rfi_collaborator: collaboratorDummy })
      .expect(res => {
        expect(res.status).to.equal(302);
        expect(res.header.location).to.be.equal('/rfp/add-collaborators');
      });
  }).timeout(0);

  it('should be able to proceed to tasklist', async () => {
    nock(envs.TENDERS_SERVICE_API_URL).put(`/journeys/${eventId}/steps/29`).reply(200, true);
    const startTime = process.hrtime();
    await request(parentApp)
      .post('/rfp/proceed-collaborators')
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(302);
        const timeDifference = process.hrtime(startTime);
        console.log(`Request took ${timeDifference[0] * 1e9 + timeDifference[1]} nanoseconds`);
        expect(res.header.location).to.be.equal('/rfp/task-list');
      });
  }).timeout(0);
});
