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
import  gcloudData from '../../../data/gcloud/rfi/rfiJsonFormet.json';
//import  mcfData from '../../../data/mcf/rfi/rfiJsonFormet.json';

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
