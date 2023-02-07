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

describe('MCF3: Add colleagues to your project', async function () {
  let parentApp;
  let OauthToken;
  this.timeout(0);
   //let eventId=mcfData.procurements.eventId;
  let eventId=gcloudData.procurements.eventId;

  beforeEach(async function () {
    OauthToken = await getToken();
    parentApp = express();
    parentApp.use(function (req, res, next) {
   // req.session = mcfData
    req.session = gcloudData
    req.session.access_token=OauthToken;    
      next();
    });
    parentApp.use(app);
  });

  it('Should be able to get Add colleagues page', async () => {
    await request(parentApp)
      .get('/rfi/add-collaborators')
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(200);
        const dom = new JSDOM(res.text);
        const { textContent } = dom.window.document.querySelector('title');
        expect(textContent).contains('Add colleagues');
      });
  }).timeout(0);

   it('AJAX should be able to do post with js enabled and phone in service', async () => {
    const collaboratorDummy = "andrew.watts@crowncommercial.gov.uk";
    
    await request(parentApp)
      .post('/rfi/get-collaborator-detail/js-enabled')
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .send({ rfi_collaborators: collaboratorDummy })
      .expect(res => {
      
        expect(res.status).to.equal(200);
      });
  }).timeout(0);

  it('should be able to do post Colleagues created  ', async () => {
    const collaboratorDummy = 'andrew.watts@crowncommercial.gov.uk';
    await request(parentApp)
      .post('/rfi/add-collaborator-detail')
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .send({ rfi_collaborators: collaboratorDummy })
      .expect(res => {
        expect(res.status).to.equal(302);
       // expect(res.header.location).to.be.equal('/rfi/add-collaborators');
      });
  }).timeout(0);

  // it('Should be able to do Delete', async () => {
  //  // const collaboratorDummy = 'andrew.watts@crowncommercial.gov.uk';//mcf3
  //   const collaboratorDummy  = 'cas_uat_28@yopmail.com';//gcloud
  //   const bodyDumm = {"id":"andrew.watts@crowncommercial.gov.uk"}
    
  //   await request(parentApp)
  //  .get(`/rfi/delete-collaborators?id=${collaboratorDummy}`)
  //     .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
  //     .expect(res => {
  //       expect(res.status).to.equal(302);
  //      // expect(res.header.location).to.be.equal('/rfi/add-collaborators');
  //     });
  // }).timeout(0);

  it('should be able to proceed to tasklist', async () => {
   // nock(envs.TENDERS_SERVICE_API_URL).put(`/journeys/${eventId}/steps/9`).reply(200, true);
    await request(parentApp)
      .post('/rfi/proceed-collaborators')
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(302);

       // expect(res.header.location).to.be.equal('/rfi/rfi-tasklist');
      });
  }).timeout(0);
  
  

});
