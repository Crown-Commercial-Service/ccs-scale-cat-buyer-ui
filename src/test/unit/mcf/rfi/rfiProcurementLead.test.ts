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
import  mcfData from '../../../data/mcf/rfi/rfiJsonFormet.json';
const getProJson = require('test/utils/getJson').getProJson

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
      req.session = getProJson;
      req.session.procurements= getProJson.procurements;
      req.session.access_token=OauthToken;    
      req.session.user={"payload": {
        "iat": 1674466741,
        "jti": "29dc4062-4312-4974-bef5-e4aec5570484",
        "uid": "12762",
        "caller": "user",
        "ciiOrgId": "669821636384259971",
        "sid": "kyEdzMySgFvLxFx2wznHXTSqUixqniKstdmwC7tfXXdBJdgm+a/PkkOfq4MWseEF/EpOjEbgmIsfNLhP0aU6PA==",
        "roles": "CAT_USER",
        "sub": "cas_uat_28@yopmail.com",
        "exp": 1674467641,
        "iss": "https://tst.api.crowncommercial.gov.uk/security",
        "aud": "zyicrDa0oJsH4hULIWTNdadxQV477w45"
      } }
      getProJson.user=req.session.user;
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
  }).timeout(0);
  
  it('Selected the project lead Updated ', async () => {
    let testValue = 'andrew.watts@crowncommercial.gov.uk';
    await request(parentApp)
    .get(`/rfi/users-procurement-lead?id=${testValue}`)
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(200);
      });
  }).timeout(0);
  
  it('should be able to proceed to add collaborators', async () => {
    const bodyDummyValue = {"rfi_procurement_lead_input":"andrew.watts@crowncommercial.gov.uk"}
    await request(parentApp)
      .post(`/rfi/procurement-lead`)
      .send(bodyDummyValue)
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
      
        expect(res.status).to.equal(302);
        expect(res.header.location).to.be.equal('/rfi/add-collaborators'); 
      });
  }).timeout(0);

});
