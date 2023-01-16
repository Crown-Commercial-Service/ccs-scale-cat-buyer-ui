//@ts-nocheck

import { expect } from 'chai';
import request from 'supertest';
let chais = require("chai");
let chaiHttp = require("chai-http");
import { app } from '../../../main/app';
import nock from 'nock';
import express from 'express';
import { createDummyJwt } from 'test/utils/auth';
const environentVar = require('dotenv').config();
const { parsed: envs } = environentVar;
import { getToken } from 'test/utils/getToken';
chais.should();
chais.use(chaiHttp);

describe('Dos6 : Name your Project', async () => {
  let parentApp;
  const jwtUser = 'dummyEmail@dummyServer.com';
  let OauthToken;
  let procId = 17717;
  const eventId = 12;
  const projectId = 'exampleTextT';

  beforeEach(async function () {
    OauthToken = await getToken();
    parentApp = express();
    parentApp.use(function (req, res, next) {
      // lets stub session middleware
      const procurementDummy = { procurementID: 123, defaultName: { components: { lotId: 1 } } };
      req.session = {
        lotId: 1,
        eventId,
        agreementLotName: 'test',
        access_token: OauthToken,
        cookie: {},
        procurements: [procurementDummy],
        project_name: projectId,
      };
      next();
    });
    parentApp.use(app);
  });

  it('Backend : should redirect to procurement lead if name fulfilled', async () => {
    const testName = 'testname';
    chais.request(process.env.TENDERS_SERVICE_API_URL)
    .put(`/tenders/projects/${procId}/name`)
    .set('Authorization', `Bearer ${OauthToken}`)
    .send({"name":testName})
    .end((response) => {
      expect(response.statusCode).to.equal(200);
    });
  });

  it('Intenal : should redirect to procurement lead if name fulfilled', async () => {
    const dummyName = 'dummyName';
    nock(envs.TENDERS_SERVICE_API_URL).put(`/tenders/projects/${procId}/name`).reply(200, true);
    nock(envs.TENDERS_SERVICE_API_URL).put(`/journeys/${eventId}/steps/27`).reply(200, true);
    await request(parentApp)
      .post(`/rfp/name?procid=${procId}`)
      .send({ rfi_projLongName: dummyName })
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(302);
        expect(res.header.location).to.be.equal('/rfp/procurement-lead');
      });
  });

});
