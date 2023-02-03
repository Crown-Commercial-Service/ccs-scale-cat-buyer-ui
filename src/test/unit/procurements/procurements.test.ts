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
import  mcfData from '../../data/mcf/mcfProcurements.json';
import  dosData from '../../data/dos/dosprocurements.json';
import  gCloudData from '../../data/gcloud/procurements.json';
const getProJson = require('test/utils/getJson').getProJson

chais.should();
chais.use(chaiHttp);

describe('MCF3: Procurement overview', async () => {
  let parentApp;
  let OauthToken;

  beforeEach(async function () {
    OauthToken = await getToken();
    parentApp = express();
    parentApp.use(function (req, res, next) {
       console.log("SESSSSSIONNE")
       console.log("HHHHHHHH",getProJson);
   req.session = getProJson;
   req.session.access_token=OauthToken;    
      
      next();
    });
    parentApp.use(app);
  });

  it('should render `MCF3 Procurement overview ` page when everything is fine', async () => {
    await request(parentApp)
      .get('/projects/create-or-choose')
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(200);
      });
  }).timeout(0);

  
  it('should render `Choose EOI or RFI ` page when everything is fine', async () => {
    await request(parentApp)
      .get('/projects/events/choose-route')
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(200);
      });
  }).timeout(0);

  it('particular event choosed', async () => {
    const collaboratorDummy = "andrew.watts@crowncommercial.gov.uk";
    
    await request(parentApp)
      .post('/projects/events/choose-route')
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .send({ choose_eoi_type: ["RFI","true"] })
      .expect(res => {
      
        expect(res.status).to.equal(200);
      });
  }).timeout(0);


  //req.body {"_csrf":"","choose_eoi_type":["RFI","true"]}
  

});


// describe('DOS: Procurement overview', async () => {
//   let parentApp;
//   let OauthToken;

//   beforeEach(async function () {
//     OauthToken = await getToken();
//     parentApp = express();
//     parentApp.use(function (req, res, next) {
//       // lets stub session middleware
//      //const procurementDummy = {"procurementID":17983,"eventId":"ocds-pfhb7i-18742","defaultName":{"name":"RM6187-Lot 2-TENSHIN SHINYO CONSULTING LTD","components":{"agreementId":"RM6187","lotId":"Lot 2","org":"COGNIZANT BUSINESS SERVICES UK LIMITED"}},"started":false};
    
//      // req.session = {
//       //   lotId: 'Lot 2',
//       //   agreementLotName: 'test',
//       //   agreementName:'test',
//       //   agreement_id: 'RM6187',
//       //   access_token: OauthToken,
//       //   isRFIComplete:false,
//       //   cookie: {},
//       //  procurements: [procurementDummy],
//       // };

//     req.session = dosData
//     req.session.access_token=OauthToken;    
      
//       next();
//     });
//     parentApp.use(app);
//   });

//   it('should render `DOS Procurement overview ` page when everything is fine', async () => {
//     await request(parentApp)
//       .get('/projects/create-or-choose')
//       .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
//       .expect(res => {
//         expect(res.status).to.equal(200);
//       });
//   });


// });

// describe('GCLOUD: Procurement overview', async () => {
//   let parentApp;
//   let OauthToken;

//   beforeEach(async function () {
//     OauthToken = await getToken();
//     parentApp = express();
//     parentApp.use(function (req, res, next) {
//       // lets stub session middleware
//      //const procurementDummy = {"procurementID":17983,"eventId":"ocds-pfhb7i-18742","defaultName":{"name":"RM6187-Lot 2-TENSHIN SHINYO CONSULTING LTD","components":{"agreementId":"RM6187","lotId":"Lot 2","org":"COGNIZANT BUSINESS SERVICES UK LIMITED"}},"started":false};
    
//      // req.session = {
//       //   lotId: 'Lot 2',
//       //   agreementLotName: 'test',
//       //   agreementName:'test',
//       //   agreement_id: 'RM6187',
//       //   access_token: OauthToken,
//       //   isRFIComplete:false,
//       //   cookie: {},
//       //  procurements: [procurementDummy],
//       // };

//     req.session = gCloudData
//     req.session.access_token=OauthToken;    
      
//       next();
//     });
//     parentApp.use(app);
//   });

//   it('should render `gcloud Procurement overview ` page when everything is fine', async () => {
//     await request(parentApp)
//       .get('/projects/create-or-choose')
//       .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
//       .expect(res => {
//         expect(res.status).to.equal(200);
//       });
//   });


// });