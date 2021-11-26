//@ts-nocheck 

import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../../../main/app';
import nock from 'nock'
import express from 'express';
import {jwt} from '../../__Mock__/env'

describe('Choose a commercial agreement page', () => {
  let parentApp;
  
  beforeEach(function(){
      parentApp = express();
      parentApp.use(function(req, res, next) { // lets stub session middleware
          req.session = {lotId: 1, agreementLotName: 'test', access_token: jwt, cookie: {}, procurements: []};
          next();
      });
      parentApp.use(app);
      const mockMenus = ['21', '22', '23', '24', '25'];

      for (const mockMenu of mockMenus) {
        nock('https://webprod-cms.crowncommercial.gov.uk')
        .get(`/wp-json/wp-api-menus/v2/menus/${mockMenu}`)
        .query(true)
        .reply(200, { data: {data: {name: 'sisar', ID: mockMenu}} });
      }
      nock('https://tst.api.crowncommercial.gov.uk')
      .post(`/security/tokens/validation`)
      .query({ 'client-id': 'zyicrDa0oJsH4hULIWTNdadxQV477w45'  })
      .reply(200, { data: true});

      nock('https://tst.api.crowncommercial.gov.uk')
      .get(`/user-profiles`)
      .query({ 'user-id': 'dummyEmail@dummyServer.com'  })
      .reply(200, { data: true});
          
      nock('https://dev-ccs-scale-shared-agreements-service.london.cloudapps.digital')
      .get(`/agreements/RM6263`)
      .query(true)
      .reply(200, { data: [{'name': 'sisarProject'}]});

  });

  it('should render `Agreements` page when everything is fine', async () => {
    const dummyLots = [
      {
        number: 'Lot 2',
        name: 'Digital Specialists and Programmes Lot 2',
        startDate: '2021-06-01',
        endDate: '2023-05-31',
        description: 'Digital Specialists and Programmes Lot 2 Description',
        type: 'service',
        routesToMarket: null,
        sectors: [
          'Devolved'
        ]
      }
    ];
    nock('https://dev-ccs-scale-shared-agreements-service.london.cloudapps.digital')
    .get(`/agreements/RM6263/lots`)
    .query(true)
    .reply(200, dummyLots);
    await request(parentApp)
      .get('/projects/choose-agreement')
      .set('Cookie', [`SESSION_ID=${jwt}`, 'state=blah'])
      .expect(res => expect(res.status).to.equal(200)) 
  });

  it('should render error page when lot api is not ready', async () => {
    nock('https://dev-ccs-scale-shared-agreements-service.london.cloudapps.digital')
    .get(`/agreements/RM6263/lots`)
    .query(true)
    .replyWithError(500, {
      "description": "An unknown error has occurred."
      }
    );
    await request(parentApp)
      .get('/projects/choose-agreement')
      .set('Cookie', [`SESSION_ID=${jwt}`, 'state=blah'])
      .expect(res => { 
          expect(res.status).to.equal(200);
      })
  });

})
