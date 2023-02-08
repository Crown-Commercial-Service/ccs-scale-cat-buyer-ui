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

describe('MCF3: Name a project', async () => {
  let parentApp;
  let OauthToken;

  beforeEach(async function () {
    OauthToken = await getToken();
    parentApp = express();
    parentApp.use(function (req, res, next) {
    
      getProJson.project_name = "UNIT TEST RFI till response date com";
      req.session = getProJson;
      req.session.procurements= getProJson.procurements;
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
  }).timeout(0);

  it('should redirect to procurement lead if name fulfilled', async () => {
    const dummyName = "UNIT TEST RFI till response date com";
    
    let procId = getProJson.procurements[0].procurementID;
    let eventId = getProJson.procurements[0].eventId;
   console.log("procIdNAME",procId);
    await request(parentApp)
      .post(`/rfi/name?procid=${procId}`)
      .send({ rfi_projLongName: dummyName })
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
       // console.log("res.header.location",res.header.location)
       expect(res.status).to.equal(302);
        
      });
  }).timeout(0);

});
