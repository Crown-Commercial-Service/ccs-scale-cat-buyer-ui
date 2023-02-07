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

describe('MCF3: Upload Document', async () => {
  let parentApp;
  let OauthToken;
   let eventId=mcfData.procurements.eventId;

  beforeEach(async function () {
    OauthToken = await getToken();
    parentApp = express();
    parentApp.use(function (req, res, next) {
    req.session = getProJson
    req.session.access_token=OauthToken;    
      next();
    });
    parentApp.use(app);
  });

  it('should render `Upload documents (optional)` page when everything is fine', async () => {
    await request(parentApp)
    .get(`/rfi/upload-doc`)
    .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
    .expect(res => {
      expect(res.status).to.equal(200);
     // const dom = new JSDOM(res.text);
     // const { textContent } = dom.window.document.querySelector('h1.govuk-heading-xl');
    //  expect(textContent).to.contains(`Upload documents (optional)`);
    });
  }).timeout(0);
   
  // it('when everything is fine after add files', async () => {
  //   const bodyDummyValue = {"rfi_file_started":"true"}

  //   await request(parentApp)
  //   .post('/rfi/upload-doc')
  //   .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
  //  // .send(bodyDummyValue)
  //   //.attach('rfi_offline_document', 'src/test/unit/dos6/dummyfiles/zip_2MB.zip')
  //   .expect(res => {
  //     expect(res.status).to.equal(302);
  //   });
  // }).timeout(0);
  
  it('should redirect to "/rfi/suppliers" after submit', async () => {
    await request(parentApp)
    .post('/rfi/upload-doc/proceed')
    .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
    .expect(res => {
      expect(res.status).to.equal(302);
      expect(res.header.location).to.be.equal('/rfi/suppliers');
    });
  }).timeout(0);
  
  

});
