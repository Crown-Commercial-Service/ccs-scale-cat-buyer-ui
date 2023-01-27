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

chais.should();
chais.use(chaiHttp);

describe('MCF3: Set your RfI timeline page render', async () => {
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
    req.session.UIDate=null
    
      next();
    });
    parentApp.use(app);
  });

  it('should render `MCF3 Set your RfI timeline ` page when everything is fine', async () => {
    await request(parentApp)
      .get('/rfi/response-date')
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(200);
      });
  }).timeout(0);
  
  it('should be able to proceed to Set your RfI timeline ', async () => {
    const bodyDummyValue = {
            "rfi_clarification_date": "Question 1*27 January 2023",
            "rfi_clarification_period_end": "Question 2*02 February 2023, 16:00",
            "deadline_period_for_clarification_period": "Question 3*06 February 2023, 16:00",
            "supplier_period_for_clarification_period": "Question 4*10 February 2023, 16:00",
            "supplier_dealine_for_clarification_period": "Question 5*20 February 2023, 16:00"
    }
    await request(parentApp)
      .post(`/rfi/response-date`)
      .send(bodyDummyValue)
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(302);
        expect(res.header.location).to.be.equal('/rfi/review'); 
      });
  }).timeout(0);

});
