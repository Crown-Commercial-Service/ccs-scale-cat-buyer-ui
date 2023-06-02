import { expect } from 'chai';
import { FetchGetError, FetchPostError } from 'main/services/helpers/errors';

describe('Service API Errors', () => {
  it ('returns the correct message for FetchGetError', () => {
    const error = new FetchGetError('http://example.com/test', 404);

    expect(error.message).to.eq('The call GET http://example.com/test returned an unexpected status: 404');
  });

  it ('returns the correct message for FetchPostError', () => {
    const error = new FetchPostError('http://example.com/test', 403);

    expect(error.message).to.eq('The call POST http://example.com/test returned an unexpected status: 403');
  });
});
