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
import  mcfData from '../../../data/mcf/rfi/rfiReview.json';
const getProJson = require('test/utils/getGcloudJson').getProJson

chais.should();
chais.use(chaiHttp);

describe('MCF3: Set your RfI review page render', async () => {
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
    req.session = getProJson
    req.session.access_token=OauthToken; 
    req.session.endDate="Question 4*20 February 2023, 16:00";
    req.session['publishclickevents']=[];
      next();
    });
    parentApp.use(app);
  });

  it('should render `MCF3 Set your RfI review ` page when everything is fine', async () => {
    await request(parentApp)
      .get('/rfi/review')
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(200);
      });
  }).timeout(0);

//   {"_csrf":"","rfi_publish_confirmation":"1","finished_pre_engage":"true"}
// req.session.endDate Question 4*10 February 2023, 16:00
// req.session.endDate "Question 4*10 February 2023, 16:00"


  it('should be able to proceed to Set your RfI timeline ', async () => {
    const bodyDummyValue = {
            "rfi_publish_confirmation": "1",
            "finished_pre_engage": "true",
    }
    await request(parentApp)
      .post(`/rfi/review`)
      .send(bodyDummyValue)
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
        //console.log("res.header.location",res.header.location)
        expect(res.status).to.equal(302);
        //expect(res.header.location).to.be.equal('/rfi/review'); 
      });
  }).timeout(0);

});
