import { expect } from 'chai';
import { FetchError, FetchTimeoutError } from 'main/services/helpers/errors';
import { HTTPMethod } from 'main/services/types/helpers/api';

describe('Service API Errors', () => {
  describe('FetchError', () => {
    it('returns the correct message and status for FetchError with GET', () => {
      const error = new FetchError(HTTPMethod.GET, 'http://example.com/test', 404);

      expect(error.message).to.eq('The call GET http://example.com/test returned an unexpected status: 404');
      expect(error.status).to.eq(404);
    });

    it('returns the correct message and status for FetchError with POST', () => {
      const error = new FetchError(HTTPMethod.POST, 'http://example.com/test', 403);

      expect(error.message).to.eq('The call POST http://example.com/test returned an unexpected status: 403');
      expect(error.status).to.eq(403);
    });
  });

  describe('FetchTimeoutError', () => {
    it('returns the correct message for FetchTimeoutError with GET', () => {
      const error = new FetchTimeoutError(HTTPMethod.GET, 'http://example.com/test', 100);

      expect(error.message).to.eq('The call GET http://example.com/test did not respond within 0.10');
    });

    it('returns the correct message for FetchTimeoutError with POST', () => {
      const error = new FetchTimeoutError(HTTPMethod.POST, 'http://example.com/test', 1500);

      expect(error.message).to.eq('The call POST http://example.com/test did not respond within 1.50');
    });
  });
});
