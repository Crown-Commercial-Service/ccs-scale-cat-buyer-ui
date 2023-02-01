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
import { postData ,postData_lot3} from 'test/data/dos/assessmentQuestions.json';
 const assessmentnonOCDS = require('test/utils/qsData').assessment_nonOCDS

chais.should();
chais.use(chaiHttp);

describe('Dos6 : Your assessment criteria Post', async function() {
  let parentApp;
  let OauthToken;
  let questionsInfo = [];
  const eventId = process.env.eventId;
  const procurementId = process.env.proc_id;
  const projectId = process.env.projectId;
  const agreementLotName = process.env.agreementLotName;
  const lotId = process.env.lotid;
  let postData = lotId == 1 ? postData : postData_lot3;
  const organizationId = 234;

  beforeEach(() => nock.cleanAll())
  before(async function () {
    OauthToken = await getToken();
    parentApp = express();
    parentApp.use(function (req, res, next) {
      // lets stub session middleware
      const procurementDummy = { procurementID: 123, defaultName: { components: { lotId: 1 } } };
      req.session = {
        lotId: 1,
        eventId,
        nonOCDSList:assessmentnonOCDS,
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

  for(let i=0;i < postData.length;i++){
    it(`Post : assessment question ${postData[i]?.OCDS?.description} `, async () => {
        await request(parentApp)
        .post(`/rfp/assessment-question?agreement_id=RM1043.8&proc_id=${procurementId}&event_id=${eventId}&id=Criterion 2&group_id=${postData[i]?.OCDS?.id}`)
        .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
        .send(postData[i]?._body)
        .expect(res => {
          expect(res.status).to.equal(302);
          let redir_location = res.header.location;
          expect(redir_location.substr(0, 24)).to.contain.oneOf(['/rfp/task-list', '/rfp/assessment-question'])
        });
    }).timeout(0);
  }

});