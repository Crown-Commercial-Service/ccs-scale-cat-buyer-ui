//@ts-nocheck 

import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../../../main/app';
import nock from 'nock'
import express from 'express';
import { createDummyJwt } from 'test/utils/auth';

describe('Procurement page', () => {
  let parentApp;
  const jwtUser = 'dummyEmail@dummyServer.com';
  const jwt = createDummyJwt(jwtUser, ['CAT_ADMINISTRATOR', 'CAT_USER']);

  beforeEach(function () {
    parentApp = express();
    parentApp.use(function (req, res, next) {
      req.session = { lotId: 1, agreementLotName: 'test', access_token: jwt, cookie: {}, procurements: [] };
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
      .query({ 'client-id': 'zyicrDa0oJsH4hULIWTNdadxQV477w45' })
      .reply(200, { data: true });

    nock('https://tst.api.crowncommercial.gov.uk')
      .get(`/user-profiles`)
      .query({ 'user-id': jwtUser })
      .reply(200, { data: true });

    nock('https://dev-ccs-scale-shared-agreements-service.london.cloudapps.digital')
      .get(`/agreements/RM6263`)
      .query(true)
      .reply(200, { data: [{ 'name': 'sisarProject' }] });
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
    .query({ 'client-id': 'zyicrDa0oJsH4hULIWTNdadxQV477w45' })
    .reply(200, { data: true });

  nock('https://tst.api.crowncommercial.gov.uk')
    .get(`/user-profiles`)
    .query({ 'user-id': 'dummyEmail@dummyServer.com' })
    .reply(200, { data: true });

  nock('https://dev-ccs-scale-shared-agreements-service.london.cloudapps.digital')
    .get(`/agreements/RM6263`)
    .query(true)
    .reply(200, { data: [{ 'name': 'sisarProject' }] });
});


describe('Should be able to show procurements', () => {
  it('should render `Procurements` page when everything is fine', async () => {
    nock('https://dev-ccs-scale-shared-agreements-service.london.cloudapps.digital')
      .get(`/agreements/RM6263/lots/1/event-types`)
      .query(true)
      .reply(200, [{ 'type': 'EOI' }]);

    nock('http://localhost:8080')
      .post(`/tenders/projects/agreements`)
      .reply(200, {
        "procurementID": 981,
        "eventId": "ocds-b5fd17-904",
        "defaultName": {
          "name": "RM6263-Lot 1-CCS",
          "components": {
            "agreementId": "RM6263",
            "lotId": "Lot 1",
            "org": "CCS"
          }
        }
      }
      );
    await request(parentApp)
      .get('/agreement/lot')
      .set('Cookie', [`SESSION_ID=${jwt}`, 'state=blah'])
      .expect(res => expect(res.status).to.equal(200))
  });

  it('should render error page when event types api not ready', async () => {
    nock('https://dev-ccs-scale-shared-agreements-service.london.cloudapps.digital')
      .get(`/agreements/RM6263/lots/1/event-types`)
      .query(true)
      .replyWithError(500, {
        "description": "An unknown error has occurred."
      });

    await request(parentApp)
      .get('/agreement/lot')
      .set('Cookie', [`SESSION_ID=${jwt}`, 'state=blah'])
      .expect(res => {
        console.log(res.body);

        expect(res.status).to.equal(200)
      })
  });


  it('should render error page when agreement api not ready', async () => {
    nock('https://dev-ccs-scale-shared-agreements-service.london.cloudapps.digital')
      .get(`/agreements/RM6263/lots/1/event-types`)
      .query(true)
      .reply(200, [{ 'type': 'EOI' }]);

    nock('http://localhost:8080')
      .post(`/tenders/projects/agreements`)
      .replyWithError(500, {
        "description": "An unknown error has occurred."
      });
    await request(parentApp)
      .get('/agreement/lot')
      .set('Cookie', [`SESSION_ID=${jwt}`, 'state=blah'])
      .expect(res => expect(res.status).to.equal(200))
  });
})
