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
import { postData } from 'test/data/mcf/rfi/rfiQuestionPosted.json';
const contextnonOCDS = require('test/utils/mcf/rfi/qsData').context_nonOCDS
//const contextnonOCDS = require('test/utils/qsData').context_nonOCDS
//const contextgroups from 
chais.should();
chais.use(chaiHttp);

describe('MCF3: Add Context', async () => {
  let parentApp;
  let OauthToken;
   let eventId=mcfData.eventId;
   let procId = mcfData.projectId;
  before(async function () {
   
    OauthToken = await getToken();
    parentApp = express();
    parentApp.use(function (req, res, next) {
    
    req.session = mcfData;
    req.session.nonOCDSList=contextnonOCDS;
    // req.session.isLocationMandatoryError=false;
    req.session.access_token=OauthToken; 
        
      next();
    });

    parentApp.use(app);
  });
  
  for(let i=0;i < postData.length;i++){
    it(`Post : expect Controller at endpoint ${postData[i]?.OCDS?.id} to return success status`, async () => {
      //nock(envs.TENDERS_SERVICE_API_URL).put(`/journeys/${eventId}/steps/20`).reply(200, true);
        await request(parentApp)
        .post(`/rfi/questionnaire?agreement_id=RM6187&proc_id=${procId}&event_id=${eventId}&id=Criterion 1&group_id=${postData[i]?.OCDS?.id}`)
        .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
        .send(postData[i]?._body)
        .expect(res => {
          expect(res.status).to.equal(302);
         // let redir_location = res.header.location;
        //  expect(redir_location.substr(0, 14)).to.contain.oneOf(['/rfp/task-list', '/rfp/questions'])
        });
    }).timeout(0);
  }


  

});
