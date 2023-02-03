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
const contextgroups = require('test/utils/mcf/rfi/qsData').context_datas
//const contextgroups from 
chais.should();
chais.use(chaiHttp);

describe('MCF3: Add Context', async () => {
  let parentApp;
  let OauthToken;
   let eventId=mcfData.eventId;
   let procId = mcfData.projectId;
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

  it('Should be able to get Build your RfI  page', async () => {
    await request(parentApp)
      .get('/rfi/online-task-list')
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(200);
      });
  }).timeout(0);
  
  for(let i=1;i < contextgroups.length;i++){
    it(`expect Controller at endpoint ${contextgroups[i]?.OCDS?.id} to return success status`, async () => {
   
           if(contextgroups[i]?.OCDS?.id != undefined){
        
        await request(parentApp)
       .get(`/rfi/questions?agreement_id=RM1043.8&proc_id=${procId}&event_id=${eventId}&id=Criterion 1&group_id=${contextgroups[i]?.OCDS?.id}`)
        .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
        .expect(res => {
          expect(res.status).to.equal(200);
        });
       }
    }).timeout(0);
  }
  

});
