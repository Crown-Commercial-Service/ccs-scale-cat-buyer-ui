import { app } from '../../../../../main/app';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);

describe('Logout redirect', () => {
  it('should redirect request to home', (done) => {
    chai
      .request(app)
      .get('/logout')
      .redirects(0)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res).to.have.status(302);
        expect(res).to.redirectTo('/');
        done();
      });
  });
});
