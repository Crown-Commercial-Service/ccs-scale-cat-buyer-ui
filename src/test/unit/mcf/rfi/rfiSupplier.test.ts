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
import  mcfData from '../../../data/mcf/rfi/rfiSupplier.json';

chais.should();
chais.use(chaiHttp);

describe('MCF3: View suppliers', async () => {
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

  it('should render `MCF3 View suppliers` page when everything is fine', async () => {
    await request(parentApp)
      .get('/rfi/suppliers')
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(200);
      });
  }).timeout(0);
  
//   it('Selected the project lead Updated ', async () => {
//     let testValue = 'andrew.watts@crowncommercial.gov.uk';
//     await request(parentApp)
//     .get(`/rfi/users-procurement-lead?id=${testValue}`)
//       .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
//       .expect(res => {
//         expect(res.status).to.equal(200);
//       });
//   }).timeout(0);
  
  it('should be able to proceed to add collaborators', async () => {
    await request(parentApp)
      .post(`/rfi/suppliers`)
      
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
       // console.log("res.header.location",res.header.location)
        expect(res.status).to.equal(302);
        expect(res.header.location).to.be.equal('/rfi/response-date'); 
      });
  }).timeout(0);

});
