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

describe('Name a project', () => {
  let parentApp;
  const jwtUser = 'dummyEmail@dummyServer.com';
  const jwt = createDummyJwt(jwtUser, ['CAT_ADMINISTRATOR', 'CAT_USER']);
  const eventId = 12;
  const procId = 23;
  const projectId = 'exampleTextT';

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
        project_name: projectId,
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

  it('should render `nameAproject` page when everything is fine', async () => {
    await request(parentApp)
      .get('/rfp/name-your-project')
      .set('Cookie', [`SESSION_ID=${jwt}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(200);
        const dom = new JSDOM(res.text);
        const { textContent } = dom.window.document.querySelector('.govuk-inset-text p');
        expect(textContent).to.equal(`Your unique project ID is ${projectId}`);
      });
  });

  it('should redirect to procurement lead if name fulfilled', async () => {
    const dummyName = 'dummyName';
    nock(envs.TENDERS_SERVICE_API_URL).put(`/tenders/projects/${procId}/name`).reply(200, true);
    nock(envs.TENDERS_SERVICE_API_URL).put(`/journeys/${projectId}/steps/27`).reply(200, true);
    await request(parentApp)
      .post(`/rfp/name?procid=${procId}`)
      .send({ rfi_projLongName: dummyName })
      .set('Cookie', [`SESSION_ID=${jwt}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(302);
        expect(res.header.location).to.be.equal('/rfp/procurement-lead');
      });
  });

  it('should redirect to name your project if name not fulfilled', async () => {
    await request(parentApp)
      .post(`/rfp/name?procid=${procId}`)
      .send({ rfi_projLongName: '' })
      .set('Cookie', [`SESSION_ID=${jwt}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(302);
        expect(res.header.location).to.be.equal('/rfp/name-your-project');
      });
  });

  it('should redirect to error page if something goes wrong with external service when post', async () => {
    nock(envs.TENDERS_SERVICE_API_URL).put(`/tenders/projects/${procId}/name`).reply(500, {
      msg: 'Internal Server Error',
    });
    nock(envs.TENDERS_SERVICE_API_URL).put(`/journeys/${projectId}/steps/27`).reply(200, true);
    await request(parentApp)
      .post(`/rfp/name?procid=${procId}`)
      .send({ rfi_projLongName: 'nameExample' })
      .set('Cookie', [`SESSION_ID=${jwt}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(200);
        const dom = new JSDOM(res.text);
        const { textContent } = dom.window.document.querySelector('h1.page-title');
        expect(textContent).to.equal('Sorry, there is a problem with the service');
      });
  });
});
