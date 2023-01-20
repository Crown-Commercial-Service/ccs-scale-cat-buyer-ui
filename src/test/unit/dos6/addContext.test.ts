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

describe('Dos6 : Add context and requirements', async () => {
  let parentApp;
  let OauthToken;
  const eventId = 'ocds-pfhb7i-18728';
  const procurementId = 23;
  const projectId = 17972;
  const organizationId = 234;

  beforeEach(async function () {
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

    it('should redirect to `/rfp/add-context?agreement_id=RM1043.8&proc_id...` page when everything is fine', async () => {
      await request(parentApp)
      .get('/rfp/add-context')
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
          expect(res.status).to.equal(302);
          expect(res.header.location).to.be.equal(`/rfp/add-context?agreement_id=RM1043.8&proc_id=${projectId}&event_id=${eventId}`)
      });
    });

    it('should render `Add context and requirements` page when everything is fine', async () => {
      await request(parentApp)
      .get(`/rfp/add-context?agreement_id=RM1043.8&proc_id=${projectId}&event_id=${eventId}`)
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(200);
        const dom = new JSDOM(res.text);
        const { textContent } = dom.window.document.querySelector('h1.govuk-heading-xl');
        expect(textContent).to.equal(`Add context and requirements`);
      });
  });
});