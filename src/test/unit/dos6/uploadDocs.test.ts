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

describe('Dos6 : Upload documents', async function() {
  let parentApp;
  let OauthToken;
  const eventId = 'ocds-pfhb7i-18728';
  const procurementId = 23;
  const projectId = 17972;
  const organizationId = 234;

  before(async function () {
    OauthToken = await getToken();
    parentApp = express();
    parentApp.use(function (req, res, next) {
      // lets stub session middleware
      const procurementDummy = { procurementID: 123, defaultName: { components: { lotId: 1 } } };
      req.session = {
        lotId: 1,
        eventId,
        agreement_id: 'RM1043.8',
        agreementLotName: 'test',
        access_token: OauthToken,
        stage2_value:'stage 1',
        cookie: {},
        selectedRoute :'dos',
        procurements: [procurementDummy],
        user: { payload: { ciiOrgId: organizationId } },
        projectId,
        searched_user: { userName: 'dummyName', firstName: 'dummyFirst', lastName: 'dummyLast' },
      };
      next();
    });
    parentApp.use(app);
  });

    it('should render `Upload documents (optional)` page when everything is fine', async () => {
      await request(parentApp)
      .get(`/rfp/upload-additional`)
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(200);
      });
    }).timeout(0);

    it('Redirect to "/rfp/upload-additional" when without file choosen', async () => {
      await request(parentApp)
      .post('/rfp/upload-additional')
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(302);
        expect(res.header.location).to.be.equal('/rfp/upload-additional');
      });
    }).timeout(0);

    it('when everything is fine after add files', async () => {
      await request(parentApp)
      .post('/rfp/upload-additional')
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .attach('rfp_offline_document2', 'src/test/unit/dos6/dummyfiles/zip_2MB.zip')
      .expect(res => {
        expect(res.status).to.equal(200);
      });
    }).timeout(0);

    it('should redirect to "/rfp/IR35" after submit', async () => {
      await request(parentApp)
      .post('/rfp/upload-additional/proceed')
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(302);
        expect(res.header.location).to.be.equal('/rfp/task-list');
      });
    }).timeout(0);

});