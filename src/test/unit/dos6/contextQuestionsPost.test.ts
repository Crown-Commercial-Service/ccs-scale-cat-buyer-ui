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
import { postData } from 'test/data/dos/contextQuestions.json';
const contextnonOCDS = require('test/utils/qsData').context_nonOCDS
chais.should();
chais.use(chaiHttp);

describe('Dos6 : Add context and requirements Post', async function() {
  this.timeout(0);
  let parentApp;
  let OauthToken;
  let questionsInfo = [];
  const eventId = 'ocds-pfhb7i-18898';
  const procurementId = '18139';
  const projectId = '18139';
  const organizationId = 234;

  before(async function () {
    OauthToken = await getToken();
    parentApp = express();
    parentApp.use(function (req, res, next) {
      // lets stub session middleware
      const procurementDummy = { procurementID: procurementId, defaultName: { components: { lotId: 1 } } };
      req.session = {
        lotId: 1,
        eventId,
        nonOCDSList:contextnonOCDS,
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
    if (!nock.isActive()) nock.activate();
    
  });

  for(let i=0;i < postData.length;i++){
    it(`Post : expect Controller at endpoint ${postData[i]?.OCDS?.id} to return success status`, async () => {
      //nock(envs.TENDERS_SERVICE_API_URL).put(`/journeys/${eventId}/steps/20`).reply(200, true);
        await request(parentApp)
        .post(`/rfp/questionnaire?agreement_id=RM1043.8&proc_id=${projectId}&event_id=${eventId}&id=Criterion 3&group_id=${postData[i]?.OCDS?.id}`)
        .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
        .send(postData[i]?._body)
        .expect(res => {
          expect(res.status).to.equal(302);
          let redir_location = res.header.location;
          expect(redir_location.substr(0, 14)).to.contain.oneOf(['/rfp/task-list', '/rfp/questions'])
        });
    }).timeout(0);
  }
});