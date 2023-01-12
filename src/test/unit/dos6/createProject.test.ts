import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../main/app';
import express from 'express';
import { createDummyJwt } from 'test/utils/auth';

describe('Create Project from Dashboard', async () => {

  // const OauthToken = await getToken();
  let parentApp :any ;
  const jwtUser = 'dummyEmail@dummyServer.com';
  const jwt = createDummyJwt(jwtUser, ['CAT_ADMINISTRATOR', 'CAT_USER']);

  beforeEach(function () {
    parentApp = express();
    parentApp.use(function (req:any, res:any, next:any) {
      // lets stub session middleware
     // req.session = { lotId: 1, agreementLotName: 'test', access_token: jwt, cookie: {}, procurements: [] };
      next();
    });
    parentApp.use(app);
   // const mockMenus = ['21', '22', '23', '24', '25'];

  });
      it("It should get a new agg", async () => {
        await request(parentApp)
        .get('/projects/choose-agreement')
        .set('Cookie', [`SESSION_ID=${jwt}`, 'state=blah'])
        .expect(res => expect(res.status).to.equal(302));
      });
});


// ********* api in side function *********
// let chais = require("chai");
// let chaiHttp = require("chai-http");
// //Assertion Style
// chais.should();

// chais.use(chaiHttp);

// describe("Hotel Reservation API", () => {
//   /**
//    * Test the GET All Reservations
//    */
//   describe("GET /v1/reservations", () => {
//     it("It should GET all the reservations", (done) => {
//       chais.request("https://dev-ccs-scale-shared-agreements-service.london.cloudapps.digital")
//         .get("/agreements/RM6187")
//         .end((err:any, response:any) => {
//           response.should.have.status(200);
//           done();
//         });
//     });
//   });
// });


