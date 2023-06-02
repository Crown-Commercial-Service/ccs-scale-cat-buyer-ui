import { expect } from 'chai';
import { genericFecthGet, genericFecthPost } from 'main/services/helpers/api';
import { FetchGetError, FetchPostError } from 'main/services/helpers/errors';
import { FetchResultStatus } from 'main/services/types/helpers/api';
import { Interceptable, MockAgent, setGlobalDispatcher } from 'undici';

describe('fecth helpers', () => {
  const baseURL = 'http://example.com';
  let mockPool: Interceptable;

  beforeEach(() => {
    const mockAgent = new MockAgent();
    mockPool = mockAgent.get(baseURL);
    setGlobalDispatcher(mockAgent);
  });

  describe('generic fecth get', () => {
    const headers = {
      'Content-Type': 'application/json'
    };

    describe('when the response is 200', () => {
      it('calls get with the formatted URL and the provided headers', async () => {
        const path = '/test';

        mockPool.intercept({
          path: path,
          headers: headers
        }).reply(200, { ok: true });

        const genericFecthGetResult = await genericFecthGet(baseURL, path, headers);

        expect(genericFecthGetResult).to.eql(
          {
            status: FetchResultStatus.OK,
            data: { ok: true }
          }
        );
      });

      it('calls get with the formatted URL and the provided headers when there is an id', async () => {
        const path = '/test/:test-id';

        mockPool.intercept({
          path: '/test/test-1234',
          headers: headers
        }).reply(200, { ok: true });

        const genericFecthGetResult = await genericFecthGet(baseURL, path, headers, [[':test-id', 'test-1234']]);

        expect(genericFecthGetResult).to.eql(
          {
            status: FetchResultStatus.OK,
            data: { ok: true }
          }
        );
      });

      it('calls get with the formatted URL and the provided headers when there are query params', async () => {
        const path = '/test';
        const queryParams = {
          myParam: 'myParam'
        };

        mockPool.intercept({
          path: '/test?myParam=myParam',
          headers: headers
        }).reply(200, { ok: true });

        const genericFecthGetResult = await genericFecthGet(baseURL, path, headers, [], queryParams);

        expect(genericFecthGetResult).to.eql(
          {
            status: FetchResultStatus.OK,
            data: { ok: true }
          }
        );
      });

      it('calls get with the formatted URL and the provided headers when there is an id and query params', async () => {
        const path = '/test/:test-id';
        const queryParams = {
          myParam: 'myParam'
        };

        mockPool.intercept({
          path: '/test/test-1234?myParam=myParam',
          headers: headers
        }).reply(200, { ok: true });

        const genericFecthGetResult = await genericFecthGet(baseURL, path, headers, [[':test-id', 'test-1234']], queryParams);

        expect(genericFecthGetResult).to.eql(
          {
            status: FetchResultStatus.OK,
            data: { ok: true }
          }
        );
      });
    });

    describe('when the response is not 200', () => {
      it('returns an error result', async () => {
        const path = '/test';

        mockPool.intercept({
          path: path,
          headers: headers
        }).reply(404);

        const genericFecthGetResult = await genericFecthGet(baseURL, path, headers);

        expect(genericFecthGetResult).to.eql(
          {
            status: FetchResultStatus.ERROR,
            error: new FetchGetError(baseURL + path, 404)
          }
        );
      });
    });

    describe('when an error is thrown', () => {
      it('returns an error result', async () => {
        const path = '/test';

        mockPool.intercept({
          path: path,
          headers: headers
        }).reply(200, '> INVALID JSON');

        const genericFecthGetResult = await genericFecthGet(baseURL, path, headers);

        expect(genericFecthGetResult).to.eql(
          {
            status: FetchResultStatus.ERROR,
            error: new SyntaxError('Unexpected token > in JSON at position 0')
          }
        );
      });
    });
  });

  describe('generic fecth post', () => {
    const headers = {
      'Content-Type': 'application/json'
    };
    const body = {
      data: 'myData'
    };

    describe('when the response is 200', () => {
      it('calls get with the formatted URL and the provided headers', async () => {
        const path = '/test';

        mockPool.intercept({
          method: 'POST',
          path: path,
          headers: headers,
          body: JSON.stringify(body)
        }).reply(200, { ok: true });

        const genericFecthPostResult = await genericFecthPost(baseURL, path, headers, body);

        expect(genericFecthPostResult).to.eql(
          {
            status: FetchResultStatus.OK,
            data: { ok: true }
          }
        );
      });

      it('calls get with the formatted URL and the provided headers when there is an id', async () => {
        const path = '/test/:test-id';

        mockPool.intercept({
          method: 'POST',
          path: '/test/test-1234',
          headers: headers,
          body: JSON.stringify(body)
        }).reply(200, { ok: true });

        const genericFecthPostResult = await genericFecthPost(baseURL, path, headers, body, [[':test-id', 'test-1234']]);

        expect(genericFecthPostResult).to.eql(
          {
            status: FetchResultStatus.OK,
            data: { ok: true }
          }
        );
      });

      it('calls get with the formatted URL and the provided headers when there are query params', async () => {
        const path = '/test';
        const queryParams = {
          myParam: 'myParam'
        };

        mockPool.intercept({
          method: 'POST',
          path: '/test?myParam=myParam',
          headers: headers,
          body: JSON.stringify(body)
        }).reply(200, { ok: true });

        const genericFecthPostResult = await genericFecthPost(baseURL, path, headers, body, [], queryParams);

        expect(genericFecthPostResult).to.eql(
          {
            status: FetchResultStatus.OK,
            data: { ok: true }
          }
        );
      });

      it('calls get with the formatted URL and the provided headers when there is an id and query params', async () => {
        const path = '/test/:test-id';
        const queryParams = {
          myParam: 'myParam'
        };

        mockPool.intercept({
          method: 'POST',
          path: '/test/test-1234?myParam=myParam',
          headers: headers,
          body: JSON.stringify(body)
        }).reply(200, { ok: true });

        const genericFecthPostResult = await genericFecthPost(baseURL, path, headers, body, [[':test-id', 'test-1234']], queryParams);

        expect(genericFecthPostResult).to.eql(
          {
            status: FetchResultStatus.OK,
            data: { ok: true }
          }
        );
      });
    });

    describe('when the response is not 200', () => {
      it('returns an error result', async () => {
        const path = '/test';

        mockPool.intercept({
          method: 'POST',
          path: path,
          headers: headers,
          body: JSON.stringify(body)
        }).reply(403);

        const genericFecthPostResult = await genericFecthPost(baseURL, path, headers, body);

        expect(genericFecthPostResult).to.eql(
          {
            status: FetchResultStatus.ERROR,
            error: new FetchPostError(baseURL + path, 403)
          }
        );
      });
    });

    describe('when an error is thrown', () => {
      it('returns an error result', async () => {
        const path = '/test';

        mockPool.intercept({
          method: 'POST',
          path: path,
          headers: headers,
          body: JSON.stringify(body)
        }).reply(200, '> INVALID JSON');

        const genericFecthPostResult = await genericFecthPost(baseURL, path, headers, body);

        expect(genericFecthPostResult).to.eql(
          {
            status: FetchResultStatus.ERROR,
            error: new SyntaxError('Unexpected token > in JSON at position 0')
          }
        );
      });
    });
  });
});
