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
import { timeline } from '../../data/dos/timeline.json';
chais.should();
chais.use(chaiHttp);

describe('Dos6 : Review and publish stage 1 > Set your timeline', async function() {
  this.timeout(0);
  let parentApp;
  let OauthToken;
  const eventId = 'ocds-pfhb7i-18728';
  const procurementId = 23;
  const projectId = 17972;
  const organizationId = 234;
  
  before(async function () {
    OauthToken = await getToken();
    parentApp = express();
    parentApp.use(function (req, res, next) {
      // lets stub session middleware
      const procurementDummy = { procurementID: 123, defaultName: { components: { lotId: 1 } } };
      req.session = {
        lotId: 1,
        eventId,
        agreement_id: 'RM1043.8',
        timeline: timeline,
        agreementLotName: 'test',
        access_token: OauthToken,
        stage2_value:'stage 1',
        cookie: {},
        selectedRoute :'dos',
        procurements: [procurementDummy],
        user: { payload: { ciiOrgId: organizationId } },
        projectId,
        searched_user: { userName: 'dummyName', firstName: 'dummyFirst', lastName: 'dummyLast' },
      };
      next();
    });
    parentApp.use(app);
  });

  
  it('should render "Set your timeline" page when everything is fine', async () => {
    await request(parentApp)
    .get(`/rfp/response-date`)
    .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
    .expect(res => {
      expect(res.status).to.equal(200);
      const dom = new JSDOM(res.text);
      const { textContent } = dom.window.document.querySelector('h1.govuk-heading-xl');
      expect(textContent).to.contain(`Set your timeline`);
    });
  });

  it('Initial data after render the "Set your timeline" page', async () => {
    await request(parentApp)
    .get(`/rfp/response-date`)
    .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
    .expect(res => {
      expect(res.status).to.equal(200);
      const dom = new JSDOM(res.text);
      const dateFields = dom.window.document.querySelectorAll('.rfi-timeline-list').length
      expect(dateFields).to.equal(13)
    });
  });

  it('should redirect to "Review and publish" if submit with valid _body', async () => {
    const _body = {
          rfp_clarification_date: 'Question 1*23 January 2023',
          rfp_clarification_period_end: 'Question 2*27 January 2023, 16:00',
          deadline_period_for_clarification_period: 'Question 3*31 January 2023, 16:00',
          supplier_period_for_clarification_period: 'Question 4*06 February 2023, 16:00',
          supplier_dealine_for_clarification_period: 'Question 5*13 February 2023, 16:00',
          deadline_for_submission_of_stage_one: 'Question 6*14 February 2023, 16:00',
          evaluation_process_start_date: 'Question 7*28 February 2023, 16:00',
          bidder_presentations_date: 'Question 8*07 March 2023, 16:00',
          standstill_period_starts_date: 'Question 9*09 March 2023, 16:00',
          proposed_award_date: 'Question 10*20 March 2023, 16:00',
          expected_signature_date: 'Question 11*03 April 2023, 16:00',
          contract_signed_date: 'Question 12*19 April 2023, 16:00',
          supplier_start_date: 'Question 13*26 April 2023, 16:00'
      };
    await request(parentApp)
      .post(`/rfp/response-date`)
      .send(_body)
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(302);
        expect(res.header.location).to.be.equal('/rfp/review');
      });
  });



  it('should redirect to "Review and publish" if click "Save New Date" button', async () => {
    const _body = {  
      clarification_date_day: '08',
      clarification_date_month: '03',
      clarification_date_year: '2023',
      clarification_date_hour: '16',
      clarification_date_minute: '0',
      selected_question_id: 'Question 8',
      selected_question_index: '8'
    };
    await request(parentApp)
      .post(`/rfp/add/response-date`)
      .send(_body)
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
         expect(res.status).to.equal(302);
        expect(res.header.location).to.be.equal('/rfp/response-date');
      });
  });

  it('should redirect to "Set your timeline" if click "Save New Date" button with empty _body', async () => {
    const _body = {  
      clarification_date_day: '',
      clarification_date_month: '',
      clarification_date_year: '',
      clarification_date_hour: '',
      clarification_date_minute: '',
      selected_question_id: 'Question 8',
      selected_question_index: '8'
    };
    await request(parentApp)
      .post(`/rfp/add/response-date`)
      .send(_body)
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
         expect(res.status).to.equal(200);
        expect(res.header.location).to.be.equal(undefined);
      });
  });

});