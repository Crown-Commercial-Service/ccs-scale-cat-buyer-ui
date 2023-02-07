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
//import  mcfData from '../../../data/mcf/rfi/rfiJsonFormet.json';
import  gcloudData from '../../../data/gcloud/rfi/rfiJsonFormet.json';

chais.should();
chais.use(chaiHttp);

describe('MCF3 : Name your Project', async function() {
  let parentApp;
  let OauthToken;
  this.timeout(0);
  // let procid=mcfData.procurements.procurementID;
  // let procid=mcfData.procurements.eventId;
  
  // console.log("procid",procid);
  // console.log("eventId",eventId);

  beforeEach(async function () {
    OauthToken = await getToken();
    parentApp = express();
    parentApp.use(function (req, res, next) {
    //req.session = mcfData
    req.session = gcloudData
    req.session.access_token=OauthToken;    
      next();
    });
    parentApp.use(app);
  });

  it('should render `MCF3 Name a project ` page when everything is fine', async () => {
    await request(parentApp)
      .get('/rfi/name-your-project')
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(200);
      });
  });

  it('should redirect to procurement lead if name fulfilled', async () => {
    const dummyName = 'test_Gcloud';
    //Mcf
    // let procId = mcfData.procurements[0].procurementID;
    // let eventId = mcfData.procurements[0].eventId;

    //Gcloud
    let procId = gcloudData.procurements[0].procurementID;
    let eventId = gcloudData.procurements[0].eventId;
    
    
    //nock(envs.TENDERS_SERVICE_API_URL).put(`/tenders/projects/${procId}/name`).reply(200, true);
    //nock(envs.TENDERS_SERVICE_API_URL).put(`/tenders/projects/${procId}/events/${eventId}`).reply(200, true);
    await request(parentApp)
      .post(`/rfi/name?procid=${procId}`)
      .send({ name: dummyName })
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
       // console.log("res.header.location",res.header.location)
       expect(res.status).to.equal(302);
        
      });
  });

});
