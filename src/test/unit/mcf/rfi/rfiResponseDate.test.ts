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
import config from 'config';
import moment from 'moment-business-days';
import  {getResponseDate} from './helper/responseDate';

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
   // req.session = getProJson
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

    let preDefineDays = getResponseDate();
    let preDefineDaysRfi = preDefineDays.responseDate;
    console.log("preDefineDays=",preDefineDaysRfi);
  
    console.log("preDefineDays=",typeof(preDefineDaysRfi));
  
    const bodyDummyValue = {"rfi_clarification_date":"Question 1*07 February 2023","rfi_clarification_period_end":"Question 2*13 February 2023, 16:00","deadline_period_for_clarification_period":"Question 3*15 February 2023, 16:00","supplier_period_for_clarification_period":"Question 4*21 February 2023, 16:00","supplier_dealine_for_clarification_period":"Question 5*01 March 2023, 16:00"}
    console.log("bodyDummyValue",bodyDummyValue);
    console.log("bodyDummyValue",typeof(bodyDummyValue));

    await request(parentApp)
      .post(`/rfi/response-date`)
      .send(preDefineDaysRfi)
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
        console.log("res.status",res.status)
        expect(res.status).to.equal(302);
        expect(res.header.location).to.be.equal('/rfi/review'); 
      });
  }).timeout(0);

});
