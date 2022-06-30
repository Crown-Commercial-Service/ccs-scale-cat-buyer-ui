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

describe('Lead procurement', () => {
  let parentApp;
  const jwtUser = 'dummyEmail@dummyServer.com';
  const jwt = createDummyJwt(jwtUser, ['CAT_ADMINISTRATOR', 'CAT_USER']);
  const eventId = 12;
  const projectId = 987;
  const organizationId = 234;
  const dummyUsers = [
    {
      name: 'dummy1',
      userName: 'dummyEmail1@dummyServer.com',
    },
    {
      name: 'dummy2',
      userName: 'dummyEmail2@dummyServer.com',
    },
  ];

  beforeEach(function () {
    parentApp = express();
    parentApp.use(function (req, res, next) {
      // lets stub session middleware
      const procurementDummy = { procurementID: 123, defaultName: { components: { lotId: 1 } } };
      req.session = {
        lotId: 1,
        eventId,
        agreementLotName: 'test',
        access_token: jwt,
        cookie: {},
        procurements: [procurementDummy],
        user: { payload: { ciiOrgId: organizationId } },
        users: dummyUsers,
        projectId,
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
    nock(envs.CONCLAVE_WRAPPER_API_BASE_URL)
      .post(`/security/tokens/validation`)
      .query({ 'client-id': /z.*/ })
      .reply(200, { data: true });

    nock(envs.CONCLAVE_WRAPPER_API_BASE_URL)
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

  it('should be able to get leaderProcurement page', async () => {
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
    nock(envs.TENDERS_SERVICE_API_URL).get(`/tenders/projects/${projectId}/users`).reply(200, dummyUsers);
    nock(envs.CONCLAVE_WRAPPER_API_BASE_URL).get(`/organisation-profiles/${organizationId}/users`).reply(200, true);
    await request(parentApp)
      .get('/rfp/procurement-lead')
      .set('Cookie', [`SESSION_ID=${jwt}`, 'state=blah'])
      .expect(res => expect(res.status).to.equal(200));
  });

  it('should set the user param as leader if the organization backend contains this value', async () => {
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
    const dummyOrgUsers = {
      organisationId: '123456789',
      userList: [
        {
          name: 'dummy1',
          userName: 'dummyEmail1@dummyServer.com',
        },
        {
          name: 'dummy2',
          userName: 'dummyEmail2@dummyServer.com',
        },
      ],
      currentPage: 1,
      pageCount: 1,
      rowCount: 1,
    };
    nock(envs.TENDERS_SERVICE_API_URL).get(`/tenders/projects/${projectId}/users`).reply(200, dummyUsers);
    nock(envs.CONCLAVE_WRAPPER_API_BASE_URL)
      .get(`/organisation-profiles/${organizationId}/users`)
      .reply(200, dummyOrgUsers);
    nock(envs.CONCLAVE_WRAPPER_API_BASE_URL)
      .get(`/organisation-profiles/${organizationId}/users?currentPage=1`)
      .reply(200, dummyOrgUsers);
    await request(parentApp)
      .get(`/rfp/procurement-lead?rfp_procurement_lead=${dummyOrgUsers.userList[1].userName}`)
      .set('Cookie', [`SESSION_ID=${jwt}`, 'state=blah'])
      .expect(res => {
        const dom = new JSDOM(res.text);
        const { textContent } = dom.window.document.querySelector('#rfp-lead-email');
        expect(textContent).to.equal(dummyOrgUsers.userList[1].userName);
        expect(res.status).to.equal(200);
      });
  });

  it('should be able to redirect to add collaborators if no errors', async () => {
    nock(envs.TENDERS_SERVICE_API_URL)
      .put(`/tenders/projects/${projectId}/users/${dummyUsers[1].userName}`)
      .reply(200, dummyUsers);
    nock(envs.TENDERS_SERVICE_API_URL).put(`/journeys/${eventId}/steps/27`).reply(200, true);

    await request(parentApp)
      .post(`/rfp/procurement-lead`)
      .set('Cookie', [`SESSION_ID=${jwt}`, 'state=blah'])
      .send({ rfp_procurement_lead_input: dummyUsers[1].userName })
      .expect(res => {
        expect(res.status).to.equal(302);
        expect(res.header.location).to.be.equal('/rfp/add-collaborators');
      });
  });

  it('should set the user param as leader if the organization backend contains this value', async () => {
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
    const dummyOrgUsers = {
      organisationId: '123456789',
      userList: [
        {
          name: 'dummy1',
          userName: 'dummyEmail1@dummyServer.com',
        },
        {
          name: 'dummy2',
          userName: 'dummyEmail2@dummyServer.com',
        },
      ],
      currentPage: 1,
      pageCount: 1,
      rowCount: 1,
    };
    nock(envs.TENDERS_SERVICE_API_URL).get(`/tenders/projects/${projectId}/users`).reply(200, dummyUsers);
    nock(envs.CONCLAVE_WRAPPER_API_BASE_URL)
      .get(`/organisation-profiles/${organizationId}/users`)
      .reply(200, dummyOrgUsers);
    nock(envs.CONCLAVE_WRAPPER_API_BASE_URL)
      .get(`/organisation-profiles/${organizationId}/users?currentPage=1`)
      .reply(200, dummyOrgUsers);
    await request(parentApp)
      .get(`/rfp/procurement-lead?rfp_procurement_lead=${dummyOrgUsers.userList[1].userName}`)
      .set('Cookie', [`SESSION_ID=${jwt}`, 'state=blah'])
      .expect(res => {
        const dom = new JSDOM(res.text);
        const { textContent } = dom.window.document.querySelector('#rfp-lead-email');
        expect(textContent).to.equal(dummyOrgUsers.userList[1].userName);
        expect(res.status).to.equal(200);
      });
  });

  it('should redirect to error page if something goes wrong with external services when get', async () => {
    const expectationsError = res => {
      expect(res.status).to.equal(200);
      const dom = new JSDOM(res.text);
      const { textContent } = dom.window.document.querySelector('h1.page-title');
      expect(textContent).to.equal('Sorry, there is a problem with the service');
    };
    nock(envs.TENDERS_SERVICE_API_URL).get(`/tenders/projects/${projectId}/users`).reply(500, {
      msg: 'Internal Server Error',
    });
    nock(envs.CONCLAVE_WRAPPER_API_BASE_URL).get(`/organisation-profiles/${organizationId}/users`).reply(200, true);
    await request(parentApp)
      .get('/rfp/procurement-lead')
      .set('Cookie', [`SESSION_ID=${jwt}`, 'state=blah'])
      .expect(res => {
        expectationsError(res);
      });
    nock(envs.TENDERS_SERVICE_API_URL)
      .put(`/tenders/projects/${projectId}/users/${dummyUsers[1].userName}`)
      .reply(500, dummyUsers);
    nock(envs.TENDERS_SERVICE_API_URL).put(`/journeys/${eventId}/steps/28`).reply(200, true);

    await request(parentApp)
      .post(`/rfp/procurement-lead`)
      .set('Cookie', [`SESSION_ID=${jwt}`, 'state=blah'])
      .send({ rfp_procurement_lead_input: dummyUsers[1].userName })
      .expect(res => {
        expectationsError(res);
      });
  });
});
