//@ts-nocheck

import { expect } from 'chai';
import request from 'supertest';
let chais = require("chai");
let chaiHttp = require("chai-http");
import { app } from '../../../main/app';
import nock from 'nock';
import express from 'express';
const environentVar = require('dotenv').config();
const { parsed: envs } = environentVar;
import { JSDOM } from 'jsdom';
import { getToken } from 'test/utils/getToken';
import { activeevents } from 'test/data/dos/activeEvents.json';


chais.should();
chais.use(chaiHttp);

describe('Dos6 : Evaluate Suppliers', async function() {
  this.timeout(0);
  let parentApp;
  let OauthToken;
  let questionsInfo = [];
  const eventId = process.env.eventId;
  const procurementId = process.env.proc_id;
  const projectId = process.env.projectId;
  const agreementLotName = process.env.agreementLotName;
  const project_name = process.env.project_name;
  const lotId = process.env.lotid;
  const organizationId = 234;

  const agreement_header = {
    project_name: project_name,
    projectId: projectId,
    agreementName: 'Digital Outcomes 6',
    agreement_id: 'RM1043.8',
    agreementLotName: agreementLotName,
    lotid: lotId
  }

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
        openProjectActiveEvents:activeevents,
        cookie: {},
        procurements: [procurementDummy],
        user: { payload: { ciiOrgId: organizationId } },
        projectId,
        searched_user: { userName: 'dummyName', firstName: 'dummyFirst', lastName: 'dummyLast' },
        agreement_header:agreement_header
      };
      next();
    });
    parentApp.use(app);

  });

  it('should render `Evaluate Suppliers` page when everything is fine', async () => {
    await request(parentApp)
    .get(`/evaluate-suppliers`)
    .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
    .expect(res => {
        expect(res.status).to.equal(200);
    });
  });

  it('should render `Enter the supplier’s final score` page when everything is fine', async () => {
    await request(parentApp)
    .get(`/enter-evaluation?supplierid=US-DUNS-364807771&suppliername=Deloitte LLP`)
    .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
    .expect(res => {
        expect(res.status).to.equal(200);
    });
  });

  // it('should redirect to `Enter the supplier’s final score` page when everything is fine', async () => {
  //   await request(parentApp)
  //   .post(`/enter-evaluation?supplierid=US-DUNS-364807771&suppliername=Deloitte LLP`)
  //   .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
  //   .send({'enter_evaluation_score':3})
  //   .expect(res => {
  //       expect(res.status).to.equal(200);
  //       const dom = new JSDOM(res.text);
  //       const { textContent } = dom.window.document.querySelector('h1.govuk-heading-xl strong');
  //       expect(textContent).to.contains(`Enter the supplier’s final score`);
  //   });
  // });
  

});