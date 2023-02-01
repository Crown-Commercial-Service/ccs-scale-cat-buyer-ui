//@ts-nocheck

import { expect } from 'chai';
import request from 'supertest';
let chais = require("chai");
let nock = require("nock");
let chaiHttp = require("chai-http");
import { app } from '../../../main/app';
import express from 'express';
const environentVar = require('dotenv').config();
const { parsed: envs } = environentVar;
import { getToken } from 'test/utils/getToken';
chais.should();
chais.use(chaiHttp);

describe('Dos6 : Set scoring criteria', async function() {
  let parentApp;
  let OauthToken;
  const agreement_id ='RM1043.8';
  const eventId = process.env.eventId;
  const procurementId = process.env.proc_id;
  const projectId = process.env.projectId;
  const agreementLotName = process.env.agreementLotName;
  const project_name = process.env.project_name;
  const lotId = process.env.lotid;
  const organizationId = '669821636384259971';
  const group_id = lotId == 1 ? 'Group 13' : 'Group 11';
  const nonOCDSList = [{
    groupId: `${group_id}`,
    questionId: 'Question 1',
    questionType: 'Table',
    mandatory: true,
    multiAnswer: false,
    length: undefined
  },
   {
    groupId: `${group_id}`,
    questionId: 'Question 2',
    questionType: 'Text',
    mandatory: false,
    multiAnswer: true,
    length: undefined
  },
   {
    groupId: `${group_id}`,
    questionId: 'Question 3',
    questionType: 'Integer',
    mandatory: false,
    multiAnswer: true,
    length: undefined
  },
   {
    groupId: `${group_id}`,
    questionId: 'Question 4',
    questionType: 'Text',
    mandatory: false,
    multiAnswer: true,
    length: undefined
  }]

  beforeEach(() => nock.cleanAll())
  before(async function () {
    
    OauthToken = await getToken();
    parentApp = express();
    parentApp.use(function (req, res, next) {
      // lets stub session middleware
      const procurementDummy = { procurementID: procurementId, defaultName: { components: { lotId: lotId } } };
      req.session = {
        lotId: lotId,
        eventId,
        nonOCDSList:nonOCDSList,
        agreement_id: agreement_id,
        agreementLotName: `${agreementLotName}`,
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

  it('should render "How you will score suppliers" page when everything is fine', async () => {
      await request(parentApp)
      .get(`/rfp/set-scoring-criteria`)
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(200);
      });
  }).timeout(0);

  it('should redirect to procurement lead if "rfp_build_started=true" send', async () => {
    const _body = {
         question_id: ['Question 1','Question 1','Question 2'],
         score_criteria_level: [ 'met1', 'met2','','','','','','','',''],
         score_criteria_points: ['0', '1','','','','','','','',''],
         score_criteria_desc: ['des1','des2','','','','','','','',''],
         rfp_build_started: 'true'
      };
    await request(parentApp)
      .post(`/rfp/set-scoring-criteria?agreement_id=${agreement_id}&proc_id=${procurementId}&event_id=${eventId}&id=Criterion 2&group_id=${group_id}&section=5`)
      .send(_body)
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(302);
        expect(res.header.location).to.be.equal('/rfp/task-list');
      });
    }).timeout(0);

  it('should redirect to "error page" if "rfp_build_started=false"', async () => {
    const _body = {
         question_id: ['Question 1','Question 1','Question 2'],
         score_criteria_level: [ 'met1', 'met2','','','','','','','',''],
         score_criteria_points: ['0', '1','','','','','','','',''],
         score_criteria_desc: ['des1','des2','','','','','','','',''],
         rfp_build_started: 'false'
      };
    await request(parentApp)
      .post(`/rfp/set-scoring-criteria?agreement_id=${agreement_id}&proc_id=${procurementId}&event_id=${eventId}&id=Criterion 2&group_id=${group_id}&section=5`)
      .send(_body)
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(302);
        expect(res.header.location).to.be.equal('/error');
      });
    }).timeout(0);

  it('should redirect to "error page" if "send empty _body"', async () => {
    const _body = {};
    await request(parentApp)
      .post(`/rfp/set-scoring-criteria?agreement_id=${agreement_id}&proc_id=${procurementId}&event_id=${eventId}&id=Criterion 2&group_id=${group_id}&section=5`)
      .send(_body)
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(302);
        expect(res.header.location).to.be.equal('/error');
      });
    }).timeout(0);
});