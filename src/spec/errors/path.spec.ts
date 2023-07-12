import { expect } from 'chai';
import Sinon from 'sinon';
import errorRoutes from 'main/errors/path';
import request from 'supertest';
import { initApp } from 'spec/support/app';
import { mockCheckUserAuth } from 'spec/support/mocks/publicProcurementGateway/oauth';

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

        const responseText = response.text;
        expect(responseText).to.match(/<h1 class="govuk-heading-xl page-title">Page not found<\/h1>/);
        expect(responseText).to.match(/<a class="nav-list__link" href="\/oauth\/login">Sign in<\/a>/);
      });
    });
  });

  describe('GET /401', () => {
    describe('when the user is not authenticated', () => {
      it('responds with the  correct template and a 401 status', async () => {
        const response = await agent.get('/401');

        expect(response.headers['content-type']).to.match(/text\/html/);
        expect(response.status).to.eq(401);

        const responseText = response.text;
        expect(responseText).to.match(/<h1 class="govuk-heading-xl page-title">You are not authorised to view this page<\/h1>/);
        expect(responseText).to.match(/<a class="nav-list__link" href="\/oauth\/login">Sign in<\/a>/);
      });
    });

    describe('when the user is authenticated', () => {
      it('responds with the  correct template and a 401 status', async () => {
        mockCheckUserAuth(mock, true);

        const response = await agent.get('/401').set('Cookie', ['SESSION_ID=SESSION_ID']);

        expect(response.headers['content-type']).to.match(/text\/html/);
        expect(response.status).to.eq(401);

        const responseText = response.text;
        expect(responseText).to.match(/<h1 class="govuk-heading-xl page-title">You are not authorised to view this page<\/h1>/);
        expect(responseText).to.match(/<a class="nav-list__link" href="\/oauth\/logout">Sign out<\/a>/);
        expect(responseText).to.match(/<a class="nav-list__link" href=>My account<\/a>/);
      });
    });
  });

  describe('GET /500', () => {
    describe('when the user is not authenticated', () => {
      it('responds with the  correct template and a 500 status', async () => {
        const response = await agent.get('/500');

        expect(response.headers['content-type']).to.match(/text\/html/);
        expect(response.status).to.eq(500);

        const responseText = response.text;
        expect(responseText).to.match(/<h1 class="govuk-heading-xl page-title">Sorry, there is a problem with the service<\/h1>/);
        expect(responseText).to.match(/<a class="nav-list__link" href="\/oauth\/login">Sign in<\/a>/);
      });
    });

    describe('when the user is authenticated', () => {
      it('responds with the  correct template and a 500 status', async () => {
        mockCheckUserAuth(mock, true);

        const response = await agent.get('/500').set('Cookie', ['SESSION_ID=SESSION_ID']);

        expect(response.headers['content-type']).to.match(/text\/html/);
        expect(response.status).to.eq(500);

        const responseText = response.text;
        expect(responseText).to.match(/<h1 class="govuk-heading-xl page-title">Sorry, there is a problem with the service<\/h1>/);
        expect(responseText).to.match(/<a class="nav-list__link" href="\/oauth\/logout">Sign out<\/a>/);
        expect(responseText).to.match(/<a class="nav-list__link" href=>My account<\/a>/);
      });
    });
  });
});
