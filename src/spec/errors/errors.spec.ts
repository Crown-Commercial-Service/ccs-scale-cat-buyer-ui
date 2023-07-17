import { expect } from 'chai';
import { ForbiddenError, HTTPError, InternalServerError, NotFoundError, UnauthorizedError } from 'main/errors/errors';

describe('Error classes', () => {
  describe('NotFoundError', () => {
    it('has the correct error message, status code and assosiated view', () => {
      const error = new NotFoundError('https://example.com');

      expect(error.message).to.eq('Page Not Found, request path: "https://example.com"');
      expect(error.statusCode).to.eq(404);
      expect(error.associatedView).to.eq('/404');
    });
  });

  describe('InternalServerError', () => {
    it('has the correct error message, status code and assosiated view', () => {
      const error = new InternalServerError();

      expect(error.message).to.eq('Internal Server error');
      expect(error.statusCode).to.eq(500);
      expect(error.associatedView).to.eq('/500');
    });
  });

  describe('ForbiddenError', () => {
    it('has the correct error message, status code and assosiated view', () => {
      const error = new ForbiddenError();

      expect(error.message).to.eq('You are not allowed to access this resource');
      expect(error.statusCode).to.eq(403);
      expect(error.associatedView).to.eq('forbidden');
    });
  });

  describe('UnauthorizedError', () => {
    it('has the correct error message, status code and assosiated view', () => {
      const error = new UnauthorizedError();

      expect(error.message).to.eq('You are not allowed to access this resource');
      expect(error.statusCode).to.eq(401);
      expect(error.associatedView).to.eq('/401');
    });
  });

  describe('HTTPError', () => {
    it('has the correct error message and status', () => {
      const error = new HTTPError('My random error message');

      expect(error.message).to.eq('My random error message');
      expect(error.status).to.eq(undefined);
    });
  });
});