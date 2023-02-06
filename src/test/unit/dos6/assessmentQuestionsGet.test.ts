//@ts-nocheck

import { expect } from 'chai';
import request from 'supertest';
let chais = require("chai");
let chaiHttp = require("chai-http");
import { app } from '../../../main/app';
import nock from 'nock';
import express from 'express';
import { createDummyJwt } from 'test/utils/auth';
const path = require('path');
const environentVar = require('dotenv').config({path:path.join(__dirname, '../../../../.env')})
const { parsed: envs } = environentVar;
import { JSDOM } from 'jsdom';
import { getToken } from 'test/utils/getToken';
const assessmentgroups = require('test/utils/qsData').assessment_datas


chais.should();
chais.use(chaiHttp);

describe('Dos6 :  Your assessment criteria Get', async function() {
  this.timeout(0);
  let parentApp;
  let OauthToken;
  let questionsInfo = [];
  const eventId = process.env.eventId;
  const procurementId = process.env.proc_id;
  const projectId = process.env.projectId;
  const agreementLotName = process.env.agreementLotName;
  const lotId = process.env.lotid;
  const organizationId = 234;

  before(async function () {
    OauthToken = await getToken();
    parentApp = express();
    parentApp.use(function (req, res, next) {
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
        projectId,
        searched_user: { userName: 'dummyName', firstName: 'dummyFirst', lastName: 'dummyLast' },
      };
      next();
    });
    parentApp.use(app);
  });

  for(let i=1;i < assessmentgroups.length;i++){
    it(`expect Controller at endpoint ${assessmentgroups[i]?.OCDS?.id} to return success status`, async () => {
        await request(parentApp)
        .get(`/rfp/assessment-question?agreement_id=RM1043.8&proc_id=${projectId}&event_id=${eventId}&id=Criterion 2&group_id=${assessmentgroups[i]?.OCDS?.id}`)
        .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
        .expect(res => {
          expect(res.status).to.equal(200);
        });
    });
  }

  it('should redirect to `/rfp/your-assessment?agreement_id=RM1043.8&proc_id...` page when everything is fine', async () => {
    await request(parentApp)
    .get('/rfp/your-assessment')
    .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
    .expect(res => {
        expect(res.status).to.equal(302);
        expect(res.header.location).to.be.equal(`/rfp/your-assessment?agreement_id=RM1043.8&proc_id=${projectId}&event_id=${eventId}`)
    });
  });

  it('should render `Your assessment criteria` page when everything is fine', async () => {
    await request(parentApp)
    .get(`/rfp/your-assessment?agreement_id=RM1043.8&proc_id=${projectId}&event_id=${eventId}`)
    .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
    .expect(res => {
      expect(res.status).to.equal(200);
      // const dom = new JSDOM(res.text);
      // const { textContent } = dom.window.document.querySelector('h1.govuk-heading-l');
      // expect(textContent).to.contains(`Your assessment criteria`);
    });
  });

});