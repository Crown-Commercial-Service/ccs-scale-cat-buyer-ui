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

describe('Dos6 : Review and publish stage 1', async () => {
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

  
  it('should render "Set your timeline" page when everything is fine', async () => {
    await request(parentApp)
    .get(`/rfp/response-date`)
    .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
    .expect(res => {
      expect(res.status).to.equal(200);
      const dom = new JSDOM(res.text);
      const { textContent } = dom.window.document.querySelector('h1.govuk-heading-xl');
      expect(textContent).to.contain(`Set your timeline`);
    });
  });

  it('Initial data after render the "Set your timeline" page', async () => {
    await request(parentApp)
    .get(`/rfp/response-date`)
    .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
    .expect(res => {
      expect(res.status).to.equal(200);
      const dom = new JSDOM(res.text);
      const dateFields = dom.window.document.querySelectorAll('.rfi-timeline-list').length
      expect(dateFields).to.equal(13)
    });
  });

// it('should redirect to procurement lead if "rfp_build_started=true" send', async () => {
//   const _body = {
//        question_id: ['Question 1','Question 1','Question 2'],
//        score_criteria_level: [ 'met1', 'met2','','','','','','','',''],
//        score_criteria_points: ['0', '1','','','','','','','',''],
//        score_criteria_desc: ['des1','des2','','','','','','','',''],
//        rfp_build_started: 'true'
//     };
//   await request(parentApp)
//     .post(`/rfp/set-scoring-criteria?agreement_id=${agreement_id}&proc_id=${projectId}&event_id=${eventId}&id=Criterion 2&group_id=Group 13&section=5`)
//     .send(_body)
//     .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
//     .expect(res => {
//       expect(res.status).to.equal(302);
//       expect(res.header.location).to.be.equal('/rfp/task-list');
//     });
// });

// it('should redirect to "error page" if "rfp_build_started=false"', async () => {
//   const _body = {
//        question_id: ['Question 1','Question 1','Question 2'],
//        score_criteria_level: [ 'met1', 'met2','','','','','','','',''],
//        score_criteria_points: ['0', '1','','','','','','','',''],
//        score_criteria_desc: ['des1','des2','','','','','','','',''],
//        rfp_build_started: 'false'
//     };
//   await request(parentApp)
//     .post(`/rfp/set-scoring-criteria?agreement_id=${agreement_id}&proc_id=${projectId}&event_id=${eventId}&id=Criterion 2&group_id=Group 13&section=5`)
//     .send(_body)
//     .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
//     .expect(res => {
//       expect(res.status).to.equal(302);
//       expect(res.header.location).to.be.equal('/error');
//     });
// });

// it('should redirect to "error page" if "send empty _body"', async () => {
//   const _body = {};
//   await request(parentApp)
//     .post(`/rfp/set-scoring-criteria?agreement_id=${agreement_id}&proc_id=${projectId}&event_id=${eventId}&id=Criterion 2&group_id=Group 13&section=5`)
//     .send(_body)
//     .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
//     .expect(res => {
//       expect(res.status).to.equal(302);
//       expect(res.header.location).to.be.equal('/error');
//     });
// });

});