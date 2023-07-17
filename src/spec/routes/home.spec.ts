import { expect } from 'chai';
import Sinon from 'sinon';
import homeRoutes from 'main/routes/home';
import request from 'supertest';
import { initApp } from 'spec/support/app';
import { mockCheckUserAuth } from 'spec/support/mocks/publicProcurementGateway/oauth';

describe('Error routes', () => {
  const app = initApp(homeRoutes);
  const agent = request.agent(app);
  const mock = Sinon.createSandbox();

  afterEach(() => {
    mock.restore();
  });

  describe('GET /', () => {
    describe('when the user is not authenticated', () => {
      it('redirects to the dashboard url', async () => {
        const response = await agent.get('/');

        expect(response.status).to.eq(302);
        expect(response.headers['location']).to.match(/\/dashboard/);
      });
    });

    describe('when the user is authenticated', () => {
      it('redirects to the dashboard url', async () => {
        mockCheckUserAuth(mock, true);

        const response = await agent.get('/').set('Cookie', ['SESSION_ID=SESSION_ID']);

        expect(response.status).to.eq(302);
        expect(response.headers['location']).to.match(/\/dashboard/);
      });
    });
  });
});
