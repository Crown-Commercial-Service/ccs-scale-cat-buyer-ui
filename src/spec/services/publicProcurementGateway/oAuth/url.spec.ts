import { expect } from 'chai';
import { oAuthURL } from 'main/services/publicProcurementGateway/oAuth/url';
import { Request } from 'express';

describe('OAuth URL helpers', () => {
  describe('login', () => {
    it('returns the login URL when there is no request', () => {
      expect(oAuthURL.login()).to.eq('http://auth-server.com/security/authorize?response_type=code&scope=openid+profile+FirstName+LastName++email++offline_access&client_id=auth-server-client-id&redirect_uri=http%3A%2F%2Fcas.com%2Freceiver');
    });

    it('returns the login URL when there is a request but no supplier_qa_url', () => {
      const req = { session: {} } as Request;

      expect(oAuthURL.login(req)).to.eq('http://auth-server.com/security/authorize?response_type=code&scope=openid+profile+FirstName+LastName++email++offline_access&client_id=auth-server-client-id&redirect_uri=http%3A%2F%2Fcas.com%2Freceiver');
    });

    it('returns the login URL with the urlId when there is a request and supplier_qa_url', () => {
      // TODO: Remove cast to unknown
      const req = { session: { supplier_qa_url: 'http://supplier-qa.com' } } as unknown as Request;

      expect(oAuthURL.login(req)).to.eq('http://auth-server.com/security/authorize?response_type=code&scope=openid+profile+FirstName+LastName++email++offline_access&client_id=auth-server-client-id&redirect_uri=http%3A%2F%2Fcas.com%2Freceiver&urlId=http%3A%2F%2Fsupplier-qa.com');
    });
  });

  describe('logout', () => {
    it('returns the logout URL', () => {
      expect(oAuthURL.logout()).to.eq('http://auth-server.com/security/log-out?client-id=auth-server-client-id&redirect-uri=http%3A%2F%2Fcas.com%2Flogout');
    });
  });
});
