import { app } from '../../../../../main/app';
import request from 'supertest';

describe("Logout redirect", () => {

  it('should redirect request to home', (done) => {
    request(app)
      .post('/logout')
      .end((err, res) => {
        if (err) { return done(err); }
        request(app)
          .get('/')
          .end((err, res) => {
            if (err) { return done(err); }
            done();
          });
      });
  });
});