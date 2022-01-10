/* eslint-disable @typescript-eslint/no-unused-vars */
import { app } from '../../../../../main/app';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);
import { createDummyJwt } from '../../../../utils/auth';

describe('Dashboard redirect', () => {
  const jwtUser = 'dummyEmail@dummyServer.com';
  const jwt = createDummyJwt(jwtUser, ['CAT_ADMINISTRATOR', 'CAT_USER']);
  it('should redirect request to Dashboard', (done) => {
    chai
      .request(app)
      .get('/oauth/login')
      .set('Cookie', [`SESSION_ID=${jwt}`, 'state=blah'])
      .redirects(0)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res).to.redirect;
        expect(res).to.have.status(302);
        done();
      });
  });
});
