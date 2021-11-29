/* eslint-disable @typescript-eslint/no-unused-vars */
import { app } from '../../../../../main/app';
import chai from 'chai';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);
import request from 'supertest';

describe("Auth Logout redirect", () => {

    it('should log out the user', (done) => {
        request(app)
            .post('/oauth/logout')
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