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

describe('Dos6 : Review and publish stage 1 > Review and publish', async function() {
  this.timeout(0);
  let parentApp;
  let OauthToken;
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
      // lets stub session middleware
      const procurementDummy = { procurementID: procurementId, defaultName: { components: { lotId: lotId } } };
      req.session = {
        lotId: lotId,
        eventId,
        agreement_id: 'RM1043.8',
        agreementLotName: `${agreementLotName}`,
        endDate: new Date().toISOString(),
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

  
  it('should render "Review and publish" page when everything is fine', async () => {
    await request(parentApp)
    .get(`/rfp/review`)
    .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
    .expect(res => {
      expect(res.status).to.equal(200);
    });
  });
  
  // it('should redirect to "Review and publish" if click "Publish and Continue" button', async () => {
  //   await request(parentApp)
  //   .post(`/rfp/review`)
  //   .send({"rfp_publish_confirmation":1,finished_pre_engage:true})
  //   .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
  //   .expect(res => {
  //     expect(res.status).to.equal(200);
  //     expect(res.header.location).to.be.equal('/rfp/rfp-eventpublished');
  //   });
  // });

  // '/rfp/rfp-eventpublished' > h1.govuk-heading-xl > Your requirements have been published

  // it('should "Publish and Continue" button disabled on bottom of the "Review and publish" page', async () => {
  //   await request(parentApp)
  //   .get(`/rfp/review`)
  //   .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
  //   .expect(res => {
  //     expect(res.status).to.equal(200);
  //   });
  // });

  // it('should downlod file properly when click the "Export your draft stage 1 requirements" button', async () => {
  //   await request(parentApp)
  //   .get(`rfp/review?download=1`)
  //   .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
  //   .expect(200);
  //   // .expect(res => {
  //   //   console.log('res',res)
  //   //   // expect(res.status).to.equal(200);
  //   // });
  // });

});