/* eslint-disable @typescript-eslint/no-unused-vars */
import { app } from '../../../../../main/app';
import request from 'supertest';

describe("Login redirect", () => {

   it('should redirect request to Login', (done) => {
      request(app)
         .get('/')
         .end((err, res) => {
            if (err) { return done(err); }
            request(app)
               .get('/oauth/login')
               .end((err, res) => {
                  if (err) { return done(err); }
                  done();
               });
         });
   });
});