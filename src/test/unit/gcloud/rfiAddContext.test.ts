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
//const getProJson = require('test/utils/getJson').getProJson
const getProJson = require('test/utils/getGcloudJson').getProJson

const contextgroups = require('test/utils/gcloud/qsData').context_datas_gcloud
//const contextgroups from 
chais.should();
chais.use(chaiHttp);

describe('MCF3: Add Context', async () => {
  let parentApp;
  let OauthToken;
   let eventId=getProJson.eventId;
   let procId = getProJson.projectId;
  beforeEach(async function () {
  
    OauthToken = await getToken();
    console.log("contextgroupsGCLOUD",contextgroups)
    parentApp = express();
    parentApp.use(function (req, res, next) {
    req.session = getProJson;
    req.session.access_token=OauthToken;    
      next();
    });

    parentApp.use(app);
  });

  //rfi/choose-build-your-rfi
  it('Choose how to build your RfI page redirect', async () => {
    await request(parentApp)
      .get('/rfi/choose-build-your-rfi')
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(200);
      });
  }).timeout(0);

  it('Posted the Choose how to build your RfI  selected the all_information_online', async () => {
    await request(parentApp)
      .post('/rfi/choose-build-your-rfi')
      .send({ goto_choose: "all_information_online" })
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(302);
      });
  }).timeout(0);

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
           // rfi/questions?agreement_id=RM6187&proc_id=18547&event_id=ocds-pfhb7i-19319&id=Criterion%201&group_id=Group%201
        await request(parentApp)
       .get(`/rfi/questions?agreement_id=RM1557.13&proc_id=${procId}&event_id=${eventId}&id=Criterion 1&group_id=${contextgroups[i]?.OCDS?.id}`)
        .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
        .expect(res => {
          expect(res.status).to.equal(200);
        });
       }
    }).timeout(0);
  }
  

});
