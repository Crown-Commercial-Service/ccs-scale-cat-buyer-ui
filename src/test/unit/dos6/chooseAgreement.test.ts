//@ts-nocheck

import { expect } from 'chai';
import chaiHttp from "chai-http";
import request from 'supertest';
import { app } from '../../../main/app';
import nock from 'nock';
import express from 'express';
import { createDummyJwt } from 'test/utils/auth';
 let chais = require("chai");
let chaiHttp = require("chai-http");

chais.should();

chais.use(chaiHttp);
describe('Choose Agreement', () => {
  let parentApp;
   beforeEach(function () {
    parentApp = express();
    parentApp.use(function (req, res, next) {
     next();
    });
    parentApp.use(app);
     
  });
  const agreements = ['RM6187','RM1043.8','RM1557.13'];
  let agreementApiBaseUrl = process.env['AGREEMENTS_SERVICE_API_URL'];
  console.log('agreementApiBaseUrl',agreementApiBaseUrl);
     for (const agreement of agreements) {
       console.log('agreement',agreement);
        it('should get Agreements details - '+agreement, async () => {
             nock(agreementApiBaseUrl)
              .get(`/agreements/${agreement}`)
              .query(true)
              .reply(200);
              chais
              .request(agreementApiBaseUrl)
              .get(`/agreements/${agreement}`)
              .end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a("object");
              });
           
          });
          it('should render error page when get Agreement api is not ready', async () => {
            nock(agreementApiBaseUrl)
            .get(`/agreements/${agreement}`)
              .query(true)
              .replyWithError(500, {
                description: 'An unknown error has occurred.',
              });
            await request(parentApp)
              .get('/projects/choose-agreement')
              .expect(res => {
                expect(res.status).to.equal(302);
              });
          }); 
          it('should get Agreement lots details - '+agreement, async () => {
            nock(agreementApiBaseUrl)
             .get(`/agreements/${agreement}/lots`)
             .query(true)
             .reply(200);
             chais
             .request(agreementApiBaseUrl)
             .get(`/agreements/${agreement}/lots`)
             .end((err, response) => {
               response.should.have.status(200);
               response.body.should.be.a("object");
             });
           await request(parentApp)
             .get('/projects/choose-agreement')
             .expect(res => expect(res.status).to.equal(302));
         });  
         it('should render error page when lot api is not ready', async () => {
          nock(agreementApiBaseUrl)
            .get(`/agreements/${agreement}/lots`)
            .query(true)
            .replyWithError(500, {
              description: 'An unknown error has occurred.',
            });
          await request(parentApp)
            .get('/projects/choose-agreement')
            .expect(res => {
              expect(res.status).to.equal(302);
            });
        }); 

        
     }

 
});
