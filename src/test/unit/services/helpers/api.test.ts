import Sinon from 'sinon';
import { expect } from 'chai';
import { genericFecthGet, genericFecthPost } from 'main/services/helpers/api';
import { FetchError, FetchTimeoutError } from 'main/services/helpers/errors';
import { FetchResultError, FetchResultOK, FetchResultStatus, HTTPMethod } from 'main/services/types/helpers/api';
import { assertRedisCalls, assertRedisCallsWithCache, creatRedisMockSpy } from 'test/utils/mocks/redis';
import { Interceptable, MockAgent, setGlobalDispatcher } from 'undici';

type GenericData = {
  ok: boolean
}

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

        const genericFecthGetResult = await genericFecthGet(
          {
            baseURL: baseURL,
            path: path
          },
          headers
        ) as FetchResultOK<GenericData>;

        expect(genericFecthGetResult.status).to.eq(FetchResultStatus.OK);
        expect(genericFecthGetResult.data).to.eql({ ok: true });
      });

      it('calls get with the formatted URL and the provided headers when there is an id', async () => {
        const path = '/test/:test-id';

        mockPool.intercept({
          path: '/test/test-1234',
          headers: headers
        }).reply(200, { ok: true });

        const genericFecthGetResult = await genericFecthGet(
          {
            baseURL: baseURL,
            path: path,
            params: [[':test-id', 'test-1234']]
          },
          headers
        ) as FetchResultOK<GenericData>;

        expect(genericFecthGetResult.status).to.eq(FetchResultStatus.OK);
        expect(genericFecthGetResult.data).to.eql({ ok: true });
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

        const genericFecthGetResult = await genericFecthGet(
          {
            baseURL: baseURL,
            path: path,
            queryParams: queryParams
          },
          headers
        ) as FetchResultOK<GenericData>;

        expect(genericFecthGetResult.status).to.eq(FetchResultStatus.OK);
        expect(genericFecthGetResult.data).to.eql({ ok: true });
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

        const genericFecthGetResult = await genericFecthGet(
          {
            baseURL: baseURL,
            path: path,
            params: [[':test-id', 'test-1234']],
            queryParams: queryParams
          },
          headers
        ) as FetchResultOK<GenericData>;

        expect(genericFecthGetResult.status).to.eq(FetchResultStatus.OK);
        expect(genericFecthGetResult.data).to.eql({ ok: true });
      });

      it('can unwrap the result', async () => {
        const path = '/test';

        mockPool.intercept({
          path: path,
          headers: headers
        }).reply(200, { ok: true });

        const genericFecthGetResult = await genericFecthGet(
          {
            baseURL: baseURL,
            path: path
          },
          headers
        );

        expect(genericFecthGetResult.unwrap()).to.eql({ ok: true });
      });

      describe('and there are cache params', () => {
        const mock = Sinon.createSandbox();
        const path = '/test';

        afterEach(() => {
          mock.restore();
        });

        it('calls the redis cache and the endpoint when there is no data', async () => {
          const mockRedisClientSpy = creatRedisMockSpy(mock);

          mockPool.intercept({
            path: path,
            headers: headers
          }).reply(200, { ok: true });

          const genericFecthGetResult = await genericFecthGet(
            {
              baseURL: baseURL,
              path: path
            },
            headers,
            {
              key: 'my_cache_key',
              seconds: 394
            }
          ) as FetchResultOK<GenericData>;

          expect(genericFecthGetResult.status).to.eq(FetchResultStatus.OK);
          expect(genericFecthGetResult.data).to.eql({ ok: true });

          assertRedisCalls(mockRedisClientSpy, 'my_cache_key', { ok: true }, 394);
        });

        it('calls only the redis cache when there is data', async () => {
          const mockRedisClientSpy = creatRedisMockSpy(mock, { ok: true });

          const genericFecthGetResult = await genericFecthGet(
            {
              baseURL: baseURL,
              path: path
            },
            headers,
            {
              key: 'my_cache_key',
              seconds: 394
            }
          ) as FetchResultOK<GenericData>;

          expect(genericFecthGetResult.status).to.eq(FetchResultStatus.OK);
          expect(genericFecthGetResult.data).to.eql({ ok: true });

          assertRedisCallsWithCache(mockRedisClientSpy, 'my_cache_key');
        });
      });
    });

    describe('when the response is not 200', () => {
      it('returns an error result', async () => {
        const path = '/test';

        mockPool.intercept({
          path: path,
          headers: headers
        }).reply(404);

        const genericFecthGetResult = await genericFecthGet(
          {
            baseURL: baseURL,
            path: path
          },
          headers
        ) as FetchResultError;

        expect(genericFecthGetResult.status).to.eq(FetchResultStatus.ERROR);
        expect(genericFecthGetResult.error).to.eql(new FetchError(HTTPMethod.GET, baseURL + path, 404));
      });
    });

    describe('when an error is thrown', () => {
      it('returns an error result', async () => {
        const path = '/test';

        mockPool.intercept({
          path: path,
          headers: headers
        }).reply(200, '> INVALID JSON');

        const genericFecthGetResult = await genericFecthGet(
          {
            baseURL: baseURL,
            path: path
          },
          headers
        ) as FetchResultError;

        expect(genericFecthGetResult.status).to.eq(FetchResultStatus.ERROR);
        expect(genericFecthGetResult.error).to.eql(new SyntaxError('Unexpected token > in JSON at position 0'));
      });

      it('it throws the error when the result is unwrapped', async () => {
        const path = '/test';

        mockPool.intercept({
          path: path,
          headers: headers
        }).reply(200, '> INVALID JSON');

        const genericFecthGetResult = await genericFecthGet(
          {
            baseURL: baseURL,
            path: path
          },
          headers
        );

        expect(genericFecthGetResult.unwrap).to.throw(SyntaxError, 'Unexpected token > in JSON at position 0');
      });
    });

    describe('when the request times out', () => {
      it('returns an error result', async () => {
        const path = '/test';

        mockPool.intercept({
          path: path,
          headers: headers,
        }).reply(200, { ok: true })
          .delay(1000);

        const genericFecthGetResult = await genericFecthGet(
          {
            baseURL: baseURL,
            path: path
          },
          headers,
          undefined,
          10
        ) as FetchResultError;

        expect(genericFecthGetResult.status).to.eq(FetchResultStatus.ERROR);
        expect(genericFecthGetResult.error).to.eql(new FetchTimeoutError(HTTPMethod.GET, baseURL + path, 10));
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

        const genericFecthPostResult = await genericFecthPost(
          {
            baseURL: baseURL,
            path: path
          },
          headers,
          body
        ) as FetchResultOK<GenericData>;

        expect(genericFecthPostResult.status).to.eq(FetchResultStatus.OK);
        expect(genericFecthPostResult.data).to.eql({ ok: true });
      });

      it('calls get with the formatted URL and the provided headers when there is an id', async () => {
        const path = '/test/:test-id';

        mockPool.intercept({
          method: 'POST',
          path: '/test/test-1234',
          headers: headers,
          body: JSON.stringify(body)
        }).reply(200, { ok: true });

        const genericFecthPostResult = await genericFecthPost(
          {
            baseURL: baseURL,
            path: path,
            params: [[':test-id', 'test-1234']]
          },
          headers,
          body
        ) as FetchResultOK<GenericData>;

        expect(genericFecthPostResult.status).to.eq(FetchResultStatus.OK);
        expect(genericFecthPostResult.data).to.eql({ ok: true });
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

        const genericFecthPostResult = await genericFecthPost(
          {
            baseURL: baseURL,
            path: path,
            queryParams: queryParams
          },
          headers,
          body
        ) as FetchResultOK<GenericData>;

        expect(genericFecthPostResult.status).to.eq(FetchResultStatus.OK);
        expect(genericFecthPostResult.data).to.eql({ ok: true });
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

        const genericFecthPostResult = await genericFecthPost(
          {
            baseURL: baseURL,
            path: path,
            params: [[':test-id', 'test-1234']],
            queryParams: queryParams
          },
          headers,
          body
        ) as FetchResultOK<GenericData>;

        expect(genericFecthPostResult.status).to.eq(FetchResultStatus.OK);
        expect(genericFecthPostResult.data).to.eql({ ok: true });
      });

      it('can unwrap the result', async () => {
        const path = '/test';

        mockPool.intercept({
          method: 'POST',
          path: path,
          headers: headers,
          body: JSON.stringify(body)
        }).reply(200, { ok: true });

        const genericFecthPostResult = await genericFecthPost(
          {
            baseURL: baseURL,
            path: path
          },
          headers,
          body
        );

        expect(genericFecthPostResult.unwrap()).to.eql({ ok: true });
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

        const genericFecthPostResult = await genericFecthPost(
          {
            baseURL: baseURL,
            path: path
          },
          headers,
          body
        ) as FetchResultError;

        expect(genericFecthPostResult.status).to.eq(FetchResultStatus.ERROR);
        expect(genericFecthPostResult.error).to.eql(new FetchError(HTTPMethod.POST, baseURL + path, 403));
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

        const genericFecthPostResult = await genericFecthPost(
          {
            baseURL: baseURL,
            path: path
          },
          headers,
          body
        ) as FetchResultError;

        expect(genericFecthPostResult.status).to.eq(FetchResultStatus.ERROR);
        expect(genericFecthPostResult.error).to.eql(new SyntaxError('Unexpected token > in JSON at position 0'));
      });

      it('it throws the error when the result is unwrapped', async () => {
        const path = '/test';

        mockPool.intercept({
          method: 'POST',
          path: path,
          headers: headers,
          body: JSON.stringify(body)
        }).reply(200, '> INVALID JSON');

        const genericFecthPostResult = await genericFecthPost(
          {
            baseURL: baseURL,
            path: path
          },
          headers,
          body
        );

        expect(genericFecthPostResult.unwrap).to.throw(SyntaxError, 'Unexpected token > in JSON at position 0');
      });
    });

    describe('when the request times out', () => {
      it('returns an error result', async () => {
        const path = '/test';

        mockPool.intercept({
          method: 'POST',
          path: path,
          headers: headers,
          body: JSON.stringify(body)
        }).reply(200, { ok: true })
          .delay(1000);

        const genericFecthPostResult = await genericFecthPost(
          {
            baseURL: baseURL,
            path: path
          },
          headers,
          body,
          10
        ) as FetchResultError;

        expect(genericFecthPostResult.status).to.eq(FetchResultStatus.ERROR);
        expect(genericFecthPostResult.error).to.eql(new FetchTimeoutError(HTTPMethod.POST, baseURL + path, 10));
      });
    });
  });
});
