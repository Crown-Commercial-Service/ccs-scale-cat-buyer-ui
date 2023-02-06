//@ts-nocheck

import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../main/app';
import nock from 'nock';
import express from 'express';
const environentVar = require('dotenv').config();
const { parsed: envs } = environentVar;
import { getToken } from 'test/utils/getToken';
import { users } from 'test/data/dos/orgUsers.json';
import { JSDOM } from 'jsdom';

describe('Dos6 : Lead procurement', async function() {
  this.timeout(0);
  let parentApp;
  let OauthToken;
  const eventId = process.env.eventId;
  const procurementId = process.env.proc_id;
  const projectId = process.env.projectId;
  const agreementLotName = process.env.agreementLotName;
  const lotId = process.env.lotid;
  const organizationId = '669821636384259971';
  const dummyUsers = [
    {
      name: 'cas_uat_28',
      userName: 'cas_uat_28@yopmail.com',
    },
    {
      name: 'dummy2',
      userName: 'dummyEmail2@dummyServer.com',
    },
  ];

  before(async function () {
    OauthToken = await getToken();
    parentApp = express();
    parentApp.use(function (req, res, next) {
      // lets stub session middleware
      const procurementDummy = { procurementID: 123, defaultName: { components: { lotId: lotId } } };
      req.session = {
        users:users,
        lotId: lotId,
        eventId,
        agreementLotName: agreementLotName,
        access_token: OauthToken,
        cookie: {},
        procurements: [procurementDummy],
        user: { payload: { ciiOrgId: organizationId } },
        projectId,
      };
      next();
    });
    parentApp.use(app);
  });

  afterEach(()=> nock.cleanAll())
  
  it('Dos6 : should be able to get leaderProcurement page', async () => {
    await request(parentApp)
      .get('/rfp/procurement-lead')
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => expect(res.status).to.equal(200));
  });

  it('Dos6 : should be able to redirect to add collaborators if no errors', async () => {
    await request(parentApp)
      .post(`/rfp/procurement-lead`)
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .send({ rfp_procurement_lead_input: dummyUsers[0].userName })
      .expect(res => {
        expect(res.status).to.equal(302);
        expect(res.header.location).to.be.equal('/rfp/add-collaborators');
      });
  });

  // it('Dos6 : should redirect to error page if something goes wrong with external services when Post', async () => {
  //   await request(parentApp)
  //     .post(`/rfp/procurement-lead`)
  //     .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
  //     .send({ rfp_procurement_lead_input: dummyUsers[1].userName })
  //     .expect(res => {
  //       expect(res.status).to.equal(302);
  //       expect(res.header.location).to.be.equal('/rfp/procurement-lead');
  //     });
  // });

  //   it('Dos6 : should go to error page if something goes wrong with external services when get', async () => {
  //   await request(parentApp)
  //     .get(`/rfp/users-procurement-lead?id=${ dummyUsers[1].userName}`)
  //     .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
  //     .expect(200)
  //     .expect((res) => {
  //       // const dom = new JSDOM(res.text);
  //       // const { textContent } = dom.window.document.querySelector('h1.page-title');
  //       // console.log('textContent',textContent)
  //       // expect(textContent).to.equal('Sorry, there is a problem with the service');
  //       expect(res.status).to.equal(200);
  //     });
  // });

});
