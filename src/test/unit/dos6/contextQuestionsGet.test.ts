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
import { postData , postData_lot3 } from 'test/data/dos/contextQuestions.json';
const contextgroups = require('test/utils/qsData').context_datas

chais.should();
chais.use(chaiHttp);

describe('Dos6 : Add context and requirements Get', async function() {
  this.timeout(0);
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


  it('should redirect to `/rfp/add-context?agreement_id=RM1043.8&proc_id...` page when everything is fine', async () => {
    await request(parentApp)
    .get('/rfp/add-context')
    .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
    .expect(res => {
        expect(res.status).to.equal(302);
        let expectLocation = `/rfp/add-context?agreement_id=RM1043.8&proc_id=${procurementId}&event_id=${eventId}`;
        console.log(expectLocation)
        expect(res.header.location).to.be.equal(expectLocation)
    });
  }).timeout(0);

  it('should render `Add context and requirements` page when everything is fine', async () => {
    await request(parentApp)
    .get(`/rfp/add-context?agreement_id=RM1043.8&proc_id=${procurementId}&event_id=${eventId}`)
    .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
    .expect(res => {
      expect(res.status).to.equal(200);
    });
  }).timeout(0);

  describe('# Get context questions page', async function() {
    for(let i=1;i < contextgroups.length;i++){
      it(`shoud render ${contextgroups[i]?.OCDS?.description} page when everything is fine`, async () => {
        if(contextgroups[i]?.OCDS?.id != undefined){
          await request(parentApp)
          .get(`/rfp/add-context?agreement_id=RM1043.8&proc_id=${procurementId}&event_id=${eventId}&id=Criterion 3&group_id=${contextgroups[i]?.OCDS?.id}`)
          .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
          .expect(res => {
            expect(res.status).to.equal(200);
          });
        }
      });
    }
  });

});