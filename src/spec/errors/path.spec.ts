import { expect } from 'chai';
import Sinon from 'sinon';
import errorRoutes from 'main/errors/path';
import request from 'supertest';
import { initApp } from 'spec/support/app';
import { mockCheckUserAuth } from 'spec/support/mocks/publicProcurementGateway/oauth';
import * as cheerio from 'cheerio';

describe('Error routes', () => {
  const app = initApp(errorRoutes);
  const agent = request.agent(app);
  const mock = Sinon.createSandbox();

  afterEach(() => {
    mock.restore();
  });

  describe('GET /404', () => {
    describe('when the user is not authenticated', () => {
      it('responds with the  correct template and a 404 status', async () => {
        const response = await agent.get('/404');

        expect(response.headers['content-type']).to.match(/text\/html/);
        expect(response.status).to.eq(404);

        const $ = cheerio.load(response.text);

        expect($('#main-content > h1').text()).to.eq('Page not found');
        expect($('nav > ul.nav-list.nav-list--personal > li > a').text()).to.eq('Sign in');
      });
    });
  });

  describe('GET /401', () => {
    describe('when the user is not authenticated', () => {
      it('responds with the  correct template and a 401 status', async () => {
        const response = await agent.get('/401');

        expect(response.headers['content-type']).to.match(/text\/html/);
        expect(response.status).to.eq(401);

        const $ = cheerio.load(response.text);

        expect($('#main-content > h1').text()).to.eq('You are not authorised to view this page');
        expect($('ul.nav-list.nav-list--personal > li > a').text()).to.eq('Sign in');
      });
    });

    describe('when the user is authenticated', () => {
      it('responds with the  correct template and a 401 status', async () => {
        mockCheckUserAuth(mock, true);

        const response = await agent.get('/401').set('Cookie', ['SESSION_ID=SESSION_ID']);

        expect(response.headers['content-type']).to.match(/text\/html/);
        expect(response.status).to.eq(401);

        const $ = cheerio.load(response.text);

        expect($('#main-content > h1').text()).to.eq('You are not authorised to view this page');
        expect($('ul.nav-list.nav-list--personal > li:nth-child(1) > a').text()).to.eq('My account');
        expect($('ul.nav-list.nav-list--personal > li:nth-child(2) > a').text()).to.eq('Sign out');
      });
    });
  });

  describe('GET /500', () => {
    describe('when the user is not authenticated', () => {
      it('responds with the  correct template and a 500 status', async () => {
        const response = await agent.get('/500');

        expect(response.headers['content-type']).to.match(/text\/html/);
        expect(response.status).to.eq(500);

        const $ = cheerio.load(response.text);

        expect($('#main-content > div > div > h1').text()).to.eq('Sorry, there is a problem with the service');
        expect($('body > header > div > div > nav > ul.nav-list.nav-list--personal > li > a').text()).to.eq('Sign in');
      });
    });

    describe('when the user is authenticated', () => {
      it('responds with the  correct template and a 500 status', async () => {
        mockCheckUserAuth(mock, true);

        const response = await agent.get('/500').set('Cookie', ['SESSION_ID=SESSION_ID']);

        expect(response.headers['content-type']).to.match(/text\/html/);
        expect(response.status).to.eq(500);

        const $ = cheerio.load(response.text);

        expect($('#main-content > div > div > h1').text()).to.eq('Sorry, there is a problem with the service');
        expect($('ul.nav-list.nav-list--personal > li:nth-child(1) > a').text()).to.eq('My account');
        expect($('ul.nav-list.nav-list--personal > li:nth-child(2) > a').text()).to.eq('Sign out');
      });
    });
  });
});
