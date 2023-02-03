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
import { JSDOM } from 'jsdom';
import { getToken } from 'test/utils/getToken';
chais.should();
chais.use(chaiHttp);

describe('Dos6 : Name your Project', async function() {
  this.slow(30000);
  this.timeout(0);
  let parentApp;
  let OauthToken;
  const eventId = process.env.eventId;
  const procurementId = process.env.proc_id;
  const projectId = process.env.projectId;
  const agreementLotName = process.env.agreementLotName;
  const lotId = process.env.lotid;

  before(async function () {
    OauthToken = await getToken();
    parentApp = express();
    parentApp.use(function (req, res, next) {
      // lets stub session middleware
      const procurementDummy = { procurementID: procurementId, defaultName: { components: { lotId: lotId } } };
      req.session = {
        lotId: lotId,
        eventId,
        agreementLotName: `${agreementLotName}`,
        agreement_id: 'RM1043.8',
        access_token: OauthToken,
        cookie: {},
        procurements: [procurementDummy],
        project_name: projectId,
      };
      next();
    });
    parentApp.use(app);
  });

  it('should render `nameAproject` page when everything is fine', async () => {
    await request(parentApp)
      .get('/rfp/name-your-project')
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(200)
      .then(function (res) {
        expect(res.status).to.equal(200);
      });
  });

  it('should redirect to procurement lead if name fulfilled', async () => {
    const dummyName = 'dummyName';
    nock(envs.TENDERS_SERVICE_API_URL).put(`/tenders/projects/${procurementId}/name`).reply(200, true);
    nock(envs.TENDERS_SERVICE_API_URL).put(`/journeys/${eventId}/steps/27`).reply(200, true);
    await request(parentApp)
      .post(`/rfp/name?procid=${procurementId}`)
      .send({ rfi_projLongName: dummyName })
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(302);
        expect(res.header.location).to.be.equal('/rfp/procurement-lead');
      });
    }).timeout(0);

  it('should redirect to name your project if name not fulfilled', async () => {
    await request(parentApp)
      .post(`/rfp/name?procid=${procurementId}`)
      .send({ rfi_projLongName: '' })
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(302);
        expect(res.header.location).to.be.equal('/rfp/name-your-project');
      });
    }).timeout(0);

  it('should redirect to error page if something goes wrong with external service when post', async () => {
    nock(envs.TENDERS_SERVICE_API_URL).put(`/tenders/projects/${procurementId}/name`).reply(500, {
      msg: 'Internal Server Error',
    });
    nock(envs.TENDERS_SERVICE_API_URL).put(`/journeys/${eventId}/steps/27`).reply(200, true);
    await request(parentApp)
      .post(`/rfp/name?procid=${procurementId}`)
      .send({ rfi_projLongName: 'nameExample' })
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(200);
      });
    }).timeout(0);
});
