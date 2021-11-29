/* eslint-disable @typescript-eslint/no-unused-vars */
import { app } from '../../../../../main/app';
import chai from 'chai';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);
import request from 'supertest';

describe("Dashboard redirect", () => {

  it('should redirect request to dashboard', (done) => {
    request(app)
      .get('/oauth/login')
      .end((err, res) => {
        if (err) { return done(err); }
        request(app)
          .get('/dashboard')
          .end((err, res) => {
            if (err) { return done(err); }
            done();
          });
      });
  });
});