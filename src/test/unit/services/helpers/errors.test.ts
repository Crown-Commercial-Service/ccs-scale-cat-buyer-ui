import { expect } from 'chai';
import { FetchError } from 'main/services/helpers/errors';
import { HTTPMethod } from 'main/services/types/helpers/api';

describe('Service API Errors', () => {
  it ('returns the correct message for FetchError with get', () => {
    const error = new FetchError(HTTPMethod.GET, 'http://example.com/test', 404);

    expect(error.message).to.eq('The call GET http://example.com/test returned an unexpected status: 404');
  });

  it ('returns the correct message for FetchError with POST', () => {
    const error = new FetchError(HTTPMethod.POST, 'http://example.com/test', 403);

    expect(error.message).to.eq('The call POST http://example.com/test returned an unexpected status: 403');
  });
});
