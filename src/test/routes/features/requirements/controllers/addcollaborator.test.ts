//@ts-nocheck

import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../../../main/app';
import nock from 'nock';
import express from 'express';
import { createDummyJwt } from 'test/utils/auth';
const environentVar = require('dotenv').config();
const { parsed: envs } = environentVar;
import { JSDOM } from 'jsdom';

describe('Add collaborator', () => {
  let parentApp;
  const jwtUser = 'dummyEmail@dummyServer.com';
  const jwt = createDummyJwt(jwtUser, ['CAT_ADMINISTRATOR', 'CAT_USER']);
  const eventId = 12;
  const procurementId = 23;
  const projectId = 987;
  const organizationId = 234;

  beforeEach(function () {
    parentApp = express();
    parentApp.use(function (req, res, next) {
      // lets stub session middleware
      const procurementDummy = { procurementID: procurementId, defaultName: { components: { lotId: 1 } } };
      req.session = {
        lotId: 1,
        eventId,
        agreementLotName: 'test',
        access_token: jwt,
        cookie: {},
        procurements: [procurementDummy],
        user: { payload: { ciiOrgId: organizationId } },
        projectId,
        searched_user: { userName: 'dummyName', firstName: 'dummyFirst', lastName: 'dummyLast' },
      };
      next();
    });
    parentApp.use(app);
    const mockMenus = ['21', '22', '23', '24', '25'];

    for (const mockMenu of mockMenus) {
      nock('https://webprod-cms.crowncommercial.gov.uk')
        .get(`/wp-json/wp-api-menus/v2/menus/${mockMenu}`)
        .query(true)
        .reply(200, { data: { data: { name: 'sisar', ID: mockMenu } } });
    }
    nock('https://tst.api.crowncommercial.gov.uk')
      .post(`/security/tokens/validation`)
      .query({ 'client-id': /z.*/ })
      .reply(200, { data: true });

    nock('https://tst.api.crowncommercial.gov.uk')
      .get(`/user-profiles`)
      .query({ 'user-id': jwtUser })
      .reply(200, { data: true });

    nock('https://dev-ccs-scale-shared-agreements-service.london.cloudapps.digital')
      .get(`/agreements/RM6263`)
      .query(true)
      .reply(200, { data: [{ name: 'sisarProject' }] });

    const dummyLots = [
      {
        number: 'Lot 2',
        name: 'Digital Specialists and Programmes Lot 2',
        startDate: '2021-06-01',
        endDate: '2023-05-31',
        description: 'Digital Specialists and Programmes Lot 2 Description',
        type: 'service',
        routesToMarket: null,
        sectors: ['Devolved'],
      },
    ];
    nock('https://dev-ccs-scale-shared-agreements-service.london.cloudapps.digital')
      .get(`/agreements/RM6263/lots`)
      .query(true)
      .reply(200, dummyLots);
  });

  it('should be able to get addCollaborator page', async () => {
    const dummyUsers = [
      {
        OCDS: { id: 'dummy1', contact: { email: 'dummyEmail1@dummyServer.com' } },
        nonOCDS: { teamMember: true, emailRecipient: false, projectOwner: false },
      },
      {
        OCDS: { id: 'dummy2', contact: { email: 'dummyEmail2@dummyServer.com' } },
        nonOCDS: { teamMember: true, emailRecipient: true, projectOwner: true },
      },
    ];
    nock('https://tst.api.crowncommercial.gov.uk')
      .get(`/organisation-profiles/${organizationId}/users`)
      .reply(200, true);
    nock(envs.TENDERS_SERVICE_API_URL).get(`/tenders/projects/${procurementId}/users`).reply(200, dummyUsers);
    await request(parentApp)
      .get('/rfp/add-collaborators')
      .set('Cookie', [`SESSION_ID=${jwt}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(200);
        const dom = new JSDOM(res.text);
        const { textContent } = dom.window.document.querySelector('title');
        expect(textContent).contains('Add colleagues');
      });
  });

  it('should be able to do post with js enabled and phone in service', async () => {
    const collaboratorDummy = 'dummy1';
    const dummyUser = {
      userName: 'a',
      firstName: 'b',
      lastName: 'c',
      telephone: 'd',
    };
    nock('https://tst.api.crowncommercial.gov.uk')
      .get(`/user-profiles?user-Id=${collaboratorDummy}`)
      .reply(200, dummyUser);
    await request(parentApp)
      .post('/rfp/get-collaborator-detail/js-enabled')
      .set('Cookie', [`SESSION_ID=${jwt}`, 'state=blah'])
      .send({ rfi_collaborators: collaboratorDummy })
      .expect(res => {
        expect(res.body).to.have.property('userName');
        expect(res.body).to.have.property('firstName');
        expect(res.body).to.have.property('lastName');
        expect(res.body).to.have.property('tel');
        expect(res.body.tel).to.equal(dummyUser.telephone);
        expect(res.status).to.equal(200);
      });
  });

  it('should be able to do post with js enabled and no phone in service', async () => {
    const collaboratorDummy = 'dummy1';
    const dummyUserNoPhone = {
      userName: 'a',
      firstName: 'b',
      lastName: 'c',
    };
    nock('https://tst.api.crowncommercial.gov.uk')
      .get(`/user-profiles?user-Id=${collaboratorDummy}`)
      .reply(200, dummyUserNoPhone);
    await request(parentApp)
      .post('/rfp/get-collaborator-detail/js-enabled')
      .set('Cookie', [`SESSION_ID=${jwt}`, 'state=blah'])
      .send({ rfi_collaborators: collaboratorDummy })
      .expect(res => {
        expect(res.body).to.have.property('userName');
        expect(res.body).to.have.property('firstName');
        expect(res.body).to.have.property('lastName');
        expect(res.body).to.have.property('tel');
        expect(res.body.tel).to.equal('N/A');
        expect(res.status).to.equal(200);
      });
  });

  it('should be able to do post', async () => {
    const collaboratorDummy = 'dummy1';
    const dummyUserNoPhone = {
      userName: 'a',
      firstName: 'b',
      lastName: 'c',
    };
    nock('https://tst.api.crowncommercial.gov.uk')
      .get(`/user-profiles?user-Id=${collaboratorDummy}`)
      .reply(200, dummyUserNoPhone);
    await request(parentApp)
      .post('/rfp/get-collaborator-detail')
      .set('Cookie', [`SESSION_ID=${jwt}`, 'state=blah'])
      .send({ rfi_collaborators: collaboratorDummy })
      .expect(res => {
        expect(res.status).to.equal(302);
        expect(res.header.location).to.be.equal('/rfp/add-collaborators');
      });
  });

  it('should be able to do post to jaggaer', async () => {
    const collaboratorDummy = 'dummy1';
    const dummyUserNoPhone = {
      userName: 'a',
      firstName: 'b',
      lastName: 'c',
    };
    nock(envs.TENDERS_SERVICE_API_URL)
      .put(`/tenders/projects/${projectId}/users/${collaboratorDummy}`)
      .reply(200, dummyUserNoPhone);
    await request(parentApp)
      .post('/rfp/add-collaborator-detail')
      .set('Cookie', [`SESSION_ID=${jwt}`, 'state=blah'])
      .send({ rfi_collaborator: collaboratorDummy })
      .expect(res => {
        expect(res.status).to.equal(302);
        expect(res.header.location).to.be.equal('/rfp/add-collaborators');
      });
  });

  it('should be able to proceed to tasklist', async () => {
    nock(envs.TENDERS_SERVICE_API_URL).put(`/journeys/${eventId}/steps/28`).reply(200, true);
    await request(parentApp)
      .post('/rfp/proceed-collaborators')
      .set('Cookie', [`SESSION_ID=${jwt}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(302);
        expect(res.header.location).to.be.equal('/rfp/task-list');
      });
  });
});
