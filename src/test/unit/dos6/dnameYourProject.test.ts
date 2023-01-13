//@ts-nocheck

import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../main/app';
import express from 'express';
import { createDummyJwt } from 'test/utils/auth';
import { getToken } from 'test/utils/getToken';

describe('Name a project', async () => {
  let parentApp;
  const OauthToken = await getToken();
  const eventId = 12;
  const procId = 17717;
  const projectId = 'exampleTextT';

  beforeEach(function () {
    parentApp = express();
    // parentApp.use(function (req, res, next) {
    //   // lets stub session middleware
    //   const procurementDummy = { procurementID: 123, defaultName: { components: { lotId: 1 } } };
    //   req.session = {
    //     lotId: 1,
    //     eventId,
    //     agreementLotName: 'test',
    //     access_token: OauthToken,
    //     cookie: {},
    //     procurements: [procurementDummy],
    //     project_name: projectId,
    //   };
    //   next();
    // });
    parentApp.use(app);

  });


  it('should redirect to procurement lead if name fulfilled', async () => {
    const dummyName = 'dummyName';
    await request(parentApp)
      .post(`/rfp/name?procid=${procId}`)
      .send({ rfi_projLongName: dummyName })
      .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
      .expect(res => {
        expect(res.status).to.equal(302);
        // expect(res.header.location).to.be.equal('/rfp/procurement-lead');
      });
  });

//   it('should redirect to name your project if name not fulfilled', async () => {
//     await request(parentApp)
//       .post(`/rfp/name?procid=${procId}`)
//       .send({ rfi_projLongName: '' })
//       .set('Cookie', [`SESSION_ID=${OauthToken}`, 'state=blah'])
//       .expect(res => {
//         expect(res.status).to.equal(302);
//         expect(res.header.location).to.be.equal('/rfp/name-your-project');
//       });
//   });


});
