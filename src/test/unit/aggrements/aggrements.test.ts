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
import  mcfData from '../../../data/mcf/rfi/rfiJsonFormet.json';

chais.should();
chais.use(chaiHttp);

describe('Project Aggrement', async () => {
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
    
    req.session = {
        agreementLotName: '',
        agreement_id: '',
        access_token: OauthToken,
        cookie: {},
      };

      next();
    });
    parentApp.use(app);
  });

  it('should render `Aggrement ` page when everything is fine', async () => {
    await request(parentApp)
      .get('/projects/choose-agreement')
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(200);
      });
  }).timeout(0);

});




describe('Project Selected Aggrement', async () => {
    let parentApp;
    let OauthToken;
  
    beforeEach(async function () {
      OauthToken = await getToken();
      parentApp = express();
      parentApp.use(function (req, res, next) {
      
        req.session = {
            lotId: 'Lot 2',
            agreementLotName: 'test12388888888',
            agreementName: 'test567',
            agreement_id:'RM6187',
            access_token: OauthToken,
            cookie: {},
          };
  
        next();
      });
      parentApp.use(app);
    });
  
  
   
  it('should render `Aggrement ` page when everything is fine', async () => {
      let agreementId="RM6187";
      let lotId="Lot 2";
      let agreementLotName="Strategy and Policy";
      let agreementName="Management Consultancy Framework Three (MCF3)";
     
      await request(parentApp)
        .get(`/projects/selected-agreement?agreementName=${agreementName}&agreementId=${agreementId}&lotId=${lotId}&agreementLotName=${agreementLotName}`)
        .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
        .expect(res => {
          expect(res.status).to.equal(302);
        });
    }).timeout(0);
  
  
  
  
  });