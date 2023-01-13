//@ts-nocheck

import { expect } from 'chai';
import request from 'supertest';
let chais = require("chai");
let chaiHttp = require("chai-http");
import { app } from '../../../main/app';
import express from 'express';
import { createDummyJwt } from 'test/utils/auth';
import { getToken } from 'test/utils/getToken';
chais.should();
chais.use(chaiHttp);

describe('Dos6 : Name your Project', async () => {
  let parentApp;
  let procId = 17717;
  const eventId = 12;
  const projectId = 'exampleTextT';

  beforeEach(function () {
    parentApp = express();
    parentApp.use(app);
  });

  it('should redirect to procurement lead if name fulfilled', async () => {
    const OauthToken = await getToken();
    const testName = 'testname';
    chais.request(process.env.TENDERS_SERVICE_API_URL)
    .put(`/tenders/projects/${procId}/name`)
    .set('Authorization', `Bearer ${OauthToken}`)
    .send({"name":testName})
    .end((response) => {
      expect(response.statusCode).to.equal(200);
    });
  });
});
