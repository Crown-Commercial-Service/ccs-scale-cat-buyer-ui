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
  this.timeout(0);
  let parentApp;
  let OauthToken;
  let procId = 17717;
  const eventId = 12;
  const projectId = 'exampleTextT';

  before(async function () {
    OauthToken = await getToken();
    parentApp = express();
    parentApp.use(function (req, res, next) {
      // lets stub session middleware
      const procurementDummy = { procurementID: 123, defaultName: { components: { lotId: 1 } } };
      req.session = {
        lotId: 1,
        eventId,
        agreementLotName: 'test',
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
    }).timeout(0);

  it('should redirect to name your project if name not fulfilled', async () => {
    await request(parentApp)
      .post(`/rfp/name?procid=${procId}`)
      .send({ rfi_projLongName: '' })
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(302);
        expect(res.header.location).to.be.equal('/rfp/name-your-project');
      });
    }).timeout(0);

  it('should redirect to error page if something goes wrong with external service when post', async () => {
    nock(envs.TENDERS_SERVICE_API_URL).put(`/tenders/projects/${procId}/name`).reply(500, {
      msg: 'Internal Server Error',
    });
    nock(envs.TENDERS_SERVICE_API_URL).put(`/journeys/${eventId}/steps/27`).reply(200, true);
    await request(parentApp)
      .post(`/rfp/name?procid=${procId}`)
      .send({ rfi_projLongName: 'nameExample' })
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(200);
        const dom = new JSDOM(res.text);
        const { textContent } = dom.window.document.querySelector('h1.page-title');
        expect(textContent).to.equal('Sorry, there is a problem with the service');
      });
    }).timeout(0);
});
