//@ts-nocheck

import { expect } from 'chai';
import request from 'supertest';
let chais = require("chai");
let chaiHttp = require("chai-http");
import { app } from '../../../main/app';
import nock from 'nock';
import express from 'express';
const environentVar = require('dotenv').config();
const { parsed: envs } = environentVar;
import { JSDOM } from 'jsdom';
import { getToken } from 'test/utils/getToken';
import { activeevents } from 'test/data/dos/activeEvents.json';


chais.should();
chais.use(chaiHttp);

describe('Dos6 : Your Project (stage 1)', async function() {
  this.timeout(0);
  let parentApp;
  let OauthToken;
  let questionsInfo = [];
  const eventId = process.env.eventId;
  const procurementId = process.env.proc_id;
  const projectId = process.env.projectId;
  const agreementLotName = process.env.agreementLotName;
  const project_name = process.env.project_name;
  const lotId = process.env.lotid;
  const organizationId = 234;

  before(async function () {
    OauthToken = await getToken();
    parentApp = express();
    parentApp.use(function (req, res, next) {
      const procurementDummy = { procurementID: procurementId, defaultName: { components: { lotId: lotId } } };
      req.session = {
        lotId: lotId,
        eventId,
        agreement_id: 'RM1043.8',
        agreementLotName: `${agreementLotName}`,
        access_token: OauthToken,
        openProjectActiveEvents:activeevents,
        cookie: {},
        procurements: [procurementDummy],
        user: { payload: { ciiOrgId: organizationId } },
        projectId,
        searched_user: { userName: 'dummyName', firstName: 'dummyFirst', lastName: 'dummyLast' },
      };
      next();
    });
    parentApp.use(app);

  });

  it('should render `/event/management?id=....` page when everything is fine', async () => {
    await request(parentApp)
    .get(`/event/management?id=${eventId}`)
    .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
    .expect(res => {
        expect(res.status).to.equal(200);
    });
  });

  it('should render `Your Project` page when everything is fine', async () => {
    await request(parentApp)
    .get(`/message/inbox?id=${eventId}`)
    .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
    .expect(res => {
        expect(res.status).to.equal(200);
    });
  });

  describe('Dos6 : Messaging', async function() {

    const message_tabs = [
      {
        url:"/message/create/supplier?type=received?type=create",
        tab:"Write message to a supplier"
      },
      {
        url:"/message/create?type=received",
        tab:"Write message to all suppliers"
      },
      {
        url:"/message/inbox?type=received",
        tab:"Received"
      },
      {
        url:"/message/sent?type=sent",
        tab:"Sent"
      }
    ];

    for(let i=1;i < message_tabs.length;i++){
      it(`should render 'Your inbox - (${message_tabs[i].tab})' page when everything is fine`, async () => {
        await request(parentApp)
        .get(`${message_tabs[i].url}`)
        .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
        .expect(res => {
            expect(res.status).to.equal(200);
        });
      });
    }

    it(`should redirect to 'Your inbox' page when 'Write message to a supplier'`, async () => {
      await request(parentApp)
      .post(`/message/createSupplier`)
      .send({
        create_supplier_message: "US-DUNS-218417092",
        create_message: "Qualification Clarification",
        create_subject_input: "test",
        create_message_input: "test msg"
      })
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
          expect(res.status).to.equal(302);
          expect(res.header.location).to.be.equal(`/message/create/supplier?type=received?type=received`);
      });
    });

    it(`should redirect to 'Your inbox' page when 'Write message to all suppliers'`, async () => {
      await request(parentApp)
      .post(`/message/createSupplier`)
      .send({
        create_message: "Qualification Clarification",
        create_subject_input: "test all",
        create_message_input: "test msg to all"
      })
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
          expect(res.status).to.equal(302);
          expect(res.header.location).to.be.equal(`/message/inbox?created=true`);
      });
    });

  });

});