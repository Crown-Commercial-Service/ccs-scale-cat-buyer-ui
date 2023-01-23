//@ts-nocheck

import { expect } from 'chai';
import request from 'supertest';
let chais = require("chai");
let chaiHttp = require("chai-http");
import { app } from '../../../../main/app';
import nock from 'nock';
import express from 'express';
import { createDummyJwt } from 'test/utils/auth';
const environentVar = require('dotenv').config();
const { parsed: envs } = environentVar;
import { JSDOM } from 'jsdom';
import { getToken } from 'test/utils/getToken';
import  mcfData from '../../../data/mcf/rfi/rfiProcurementLead.json';

chais.should();
chais.use(chaiHttp);

describe('MCF3: ProcurementLead page render', async () => {
  let parentApp;
  let OauthToken;
  // let procid=mcfData.procurements.procurementID;
  // let procid=mcfData.procurements.eventId;
  
  // console.log("procid",procid);
  // console.log("eventId",eventId);

  beforeEach(async function () {
    OauthToken = await getToken();
    parentApp = express();
    parentApp.use(function (req, res, next) {
    req.session = mcfData
    req.session.access_token=OauthToken;    
      next();
    });
    parentApp.use(app);
  });

  it('should render `MCF3 Change who will lead the Project ` page when everything is fine', async () => {
    await request(parentApp)
      .get('/rfi/procurement-lead')
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(200);
      });
  });

  it('MCF3 Change who will lead the Project Updated', async () => {
    const dummyName = 'test';
    let userMail = "cas_uat_28@yopmail.com";
    let projectId = mcfData.projectId;
   
    nock(envs.TENDERS_SERVICE_API_URL).put(`/tenders/projects/${projectId}/users/${userMail}`).reply(200, true);
    await request(parentApp)
      .post(`/rfi/procurement-lead`)
      .send({"userType":"PROJECT_OWNER"})
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(302);
        
      });
  });

});
