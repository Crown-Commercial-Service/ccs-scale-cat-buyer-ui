import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../../main/app';
import { RFI_PATHS } from '../../../../main/features/rfi/model/rficonstant'
import { ALL_STATIC_RFI_PATH } from './__Mock__/rficonstants'

/**
 * @Test
 * Dynamic Testing using Path config file
 */
const allRoutes = Object.values(RFI_PATHS);
const AUTH_BARRIER_REDIRECT_STATUS = 302;
const REFERAL_ORIGIN = '/oauth/login'

describe('All Tests regarding RFI Paths - Dynamic Loading \n \n \n \n \n', () => {
  for (const route of allRoutes) {
    it(` expect Controller at ${route} endpoint to return success status ${AUTH_BARRIER_REDIRECT_STATUS}`, async () => {
      const data = await request(app).get(route);
      const payloadAuthCheck = data.unauthorized;
      const HEADERLOCATION = data.headers?.location;
      expect(HEADERLOCATION).to.equals(REFERAL_ORIGIN)
      if (!payloadAuthCheck) { expect(payloadAuthCheck).to.equals(false) }
      else expect(payloadAuthCheck).to.equals(true)
      await request(app)
        .get(route)
        .expect(res => expect(res.status).to.equal(AUTH_BARRIER_REDIRECT_STATUS))
    })
  }
})
describe('All Tests regarding RFI Paths - Static Loading \n \n \n \n \n', () => {
  for (const route of ALL_STATIC_RFI_PATH) {
    it(`expect Controller at ${route} endpoint to return success status ${AUTH_BARRIER_REDIRECT_STATUS}`, async () => {
      const data = await request(app).get(route);
      const payloadAuthCheck = data.unauthorized;
      if (!payloadAuthCheck) { expect(payloadAuthCheck).to.equals(false) }
      else expect(payloadAuthCheck).to.equals(true)
      await request(app)
        .get(route)
        .expect(res => expect(res.status).to.equal(AUTH_BARRIER_REDIRECT_STATUS))
    })
  }
})

