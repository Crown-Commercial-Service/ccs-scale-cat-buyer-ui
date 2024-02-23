import { expect } from 'chai';
import Sinon from 'sinon';
import { genericFecthGet, genericFecthPost } from 'main/services/helpers/api';
import { FetchError, FetchTimeoutError } from 'main/services/helpers/errors';
import { FetchResultError, FetchResultOK, FetchResultStatus, HTTPMethod } from 'main/services/helpers/api.types';
import { setupServer } from 'msw/node';
import { http, passthrough } from 'msw';
import { matchHeaders, matchJSON, matchQueryParams, mswEmptyResponseWithStatus, mswJSONResponse } from 'spec/support/mswHelpers';
import { assertRedisCalls, assertRedisCallsWithCache, creatRedisMockSpy } from 'spec/support/mocks/redis';
import { assertPerformanceLoggerCalls, creatPerformanceLoggerMockSpy } from 'spec/support/mocks/performanceLogger';

interface GenericData {
  ok: string
}

describe('fecth helpers', () => {
  const baseURL = 'http://example.com';

  const headers = {
    'Content-Type': 'application/json'
  };
  const body = {
    data: 'myData'
  };

  const restHandlers = [
    http.get(`${baseURL}/test`, ({ request }) => {
      if (matchHeaders(request, headers)) {
        if (matchQueryParams(request, '')) {
          return mswJSONResponse({ ok: 'GET /test' });
        }
        if (matchQueryParams(request, '?myParam=myParam')) {
          return mswJSONResponse({ ok: 'GET /test?myParam=myParam' });
        }
      }

      return mswEmptyResponseWithStatus(400);
    }),
    http.get(`${baseURL}/test/test-1234`, ({ request }) => {
      if (matchHeaders(request, headers)) {
        if (matchQueryParams(request, '')) {
          return mswJSONResponse({ ok: 'GET /test/test-1234' });
        }
        if (matchQueryParams(request, '?myParam=myParam')) {
          return mswJSONResponse({ ok: 'GET /test/test-1234?myParam=myParam' });
        }
      }

      return mswEmptyResponseWithStatus(400);
    }),
    http.get(`${baseURL}/teapot`, ({ request }) => {
      if (matchHeaders(request, headers)) {
        return mswEmptyResponseWithStatus(418);
      }

      return mswEmptyResponseWithStatus(400);
    }),
    http.get(`${baseURL}/error`, ({ request }) => {
      if (matchHeaders(request, headers)) {
        return new Response(
          '> INVALID JSON',
          {
            headers: {
              'Content-Type': 'application/json',
            },
            status: 200
          }
        );
      }

      return mswEmptyResponseWithStatus(400);
    }),
    http.get(`${baseURL}/timeout`, ({ request }) => {
      if (matchHeaders(request, headers)) {
        return passthrough();
      }

      return mswEmptyResponseWithStatus(400);
    }),
    http.post(`${baseURL}/test`, ({ request }) => {
      if (matchHeaders(request, headers) && matchJSON(request, body)) {
        if (matchQueryParams(request, '')) {
          return mswJSONResponse({ ok: 'POST /test' });
        }
        if (matchQueryParams(request, '?myParam=myParam')) {
          return mswJSONResponse({ ok: 'POST /test?myParam=myParam' });
        }
      }

      return mswEmptyResponseWithStatus(400);
    }),
    http.post(`${baseURL}/test/test-1234`, ({ request }) => {
      if (matchHeaders(request, headers)) {
        if (matchQueryParams(request, '') && matchJSON(request, body)) {
          return mswJSONResponse({ ok: 'POST /test/test-1234' });
        }
        if (matchQueryParams(request, '?myParam=myParam')) {
          return mswJSONResponse({ ok: 'POST /test/test-1234?myParam=myParam' });
        }
      }

      return mswEmptyResponseWithStatus(400);
    }),
    http.post(`${baseURL}/not-authorised`, ({ request }) => {
      if (matchHeaders(request, headers)) {
        return mswEmptyResponseWithStatus(403);
      }

      return mswEmptyResponseWithStatus(400);
    }),
    http.post(`${baseURL}/error`, ({ request }) => {
      if (matchHeaders(request, headers)) {
        return new Response(
          '> INVALID JSON',
          {
            headers: {
              'Content-Type': 'application/json',
            },
            status: 200
          }
        );
      }

      return mswEmptyResponseWithStatus(400);
    }),
    http.post(`${baseURL}/timeout`, ({ request }) => {
      if (matchHeaders(request, headers)) {
        return passthrough();
      }

      return mswEmptyResponseWithStatus(400);
    }),
  ];

  const server = setupServer(...restHandlers);
  const mock = Sinon.createSandbox();

  before(() => server.listen({ onUnhandledRequest: 'error' }));

  after(() => server.close());

  afterEach(() => {
    mock.restore();
    server.resetHandlers();
  });

  describe('generic fecth get', () => {
    describe('when the response is 200', () => {
      it('calls get with the formatted URL and the provided headers', async () => {
        const path = '/test';

        const genericFecthGetResult = await genericFecthGet(
          {
            baseURL: baseURL,
            path: path
          },
          headers
        ) as FetchResultOK<GenericData>;

        expect(genericFecthGetResult.status).to.eq(FetchResultStatus.OK);
        expect(genericFecthGetResult.data).to.eql({ ok: 'GET /test' });
      });

      it('calls get with the formatted URL and the provided headers when there is an id', async () => {
        const path = '/test/:testId';

        const genericFecthGetResult = await genericFecthGet(
          {
            baseURL: baseURL,
            path: path,
            params: { testId: 'test-1234' }
          },
          headers
        ) as FetchResultOK<GenericData>;

        expect(genericFecthGetResult.status).to.eq(FetchResultStatus.OK);
        expect(genericFecthGetResult.data).to.eql({ ok: 'GET /test/test-1234' });
      });

      it('calls get with the formatted URL and the provided headers when there are query params', async () => {
        const path = '/test';
        const queryParams = {
          myParam: 'myParam'
        };

        const genericFecthGetResult = await genericFecthGet(
          {
            baseURL: baseURL,
            path: path,
            queryParams: queryParams
          },
          headers
        ) as FetchResultOK<GenericData>;

        expect(genericFecthGetResult.status).to.eq(FetchResultStatus.OK);
        expect(genericFecthGetResult.data).to.eql({ ok: 'GET /test?myParam=myParam' });
      });

      it('calls get with the formatted URL and the provided headers when there is an id and query params', async () => {
        const path = '/test/:testId';
        const queryParams = {
          myParam: 'myParam'
        };

        const genericFecthGetResult = await genericFecthGet(
          {
            baseURL: baseURL,
            path: path,
            params: { testId: 'test-1234' },
            queryParams: queryParams
          },
          headers
        ) as FetchResultOK<GenericData>;

        expect(genericFecthGetResult.status).to.eq(FetchResultStatus.OK);
        expect(genericFecthGetResult.data).to.eql({ ok: 'GET /test/test-1234?myParam=myParam' });
      });

      it('can unwrap the result', async () => {
        const path = '/test';

        const genericFecthGetResult = await genericFecthGet(
          {
            baseURL: baseURL,
            path: path
          },
          headers
        );

        expect(genericFecthGetResult.unwrap()).to.eql({ ok: 'GET /test' });
      });

      describe('and there are cache params', () => {
        const path = '/test';

        it('calls the redis cache and the endpoint when there is no data', async () => {
          const redisSpy = creatRedisMockSpy(mock);

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
          expect(genericFecthGetResult.data).to.eql({ ok: 'GET /test' });

          assertRedisCalls(redisSpy, 'my_cache_key', { ok: 'GET /test' }, 394);
        });

        it('calls only the redis cache when there is data', async () => {
          const redisSpy = creatRedisMockSpy(mock, { ok: 'GET /test' });

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
          expect(genericFecthGetResult.data).to.eql({ ok: 'GET /test' });

          assertRedisCallsWithCache(redisSpy, 'my_cache_key');
        });
      });

      describe('and we consider logger options', () => {
        const path = '/test';

        it('calls the logger when it has logger options', async () => {
          const performanceLoggerSpy = creatPerformanceLoggerMockSpy(mock, {
            name: 'generic fetch',
            message: 'This is the generic fetch message'
          });

          const genericFecthGetResult = await genericFecthGet(
            {
              baseURL: baseURL,
              path: path
            },
            headers,
            undefined,
            {
              name: 'generic fetch',
              message: 'This is the generic fetch message'
            }
          ) as FetchResultOK<GenericData>;

          expect(genericFecthGetResult.status).to.eq(FetchResultStatus.OK);
          expect(genericFecthGetResult.data).to.eql({ ok: 'GET /test' });

          assertPerformanceLoggerCalls(performanceLoggerSpy);
        });

        it('calls the logger when it has no logger options', async () => {
          const performanceLoggerSpy = creatPerformanceLoggerMockSpy(mock, undefined);

          const genericFecthGetResult = await genericFecthGet(
            {
              baseURL: baseURL,
              path: path
            },
            headers
          ) as FetchResultOK<GenericData>;

          expect(genericFecthGetResult.status).to.eq(FetchResultStatus.OK);
          expect(genericFecthGetResult.data).to.eql({ ok: 'GET /test' });

          assertPerformanceLoggerCalls(performanceLoggerSpy);
        });
      });
    });

    describe('when the response is not 200', () => {
      it('returns an error result', async () => {
        const path = '/teapot';

        const genericFecthGetResult = await genericFecthGet(
          {
            baseURL: baseURL,
            path: path
          },
          headers
        ) as FetchResultError;

        expect(genericFecthGetResult.status).to.eq(FetchResultStatus.ERROR);
        expect(genericFecthGetResult.error).to.eql(new FetchError(HTTPMethod.GET, baseURL + path, 418));
      });
    });

    describe('when an error is thrown', () => {
      const path = '/error';

      it('returns an error result', async () => {
        const genericFecthGetResult = await genericFecthGet(
          {
            baseURL: baseURL,
            path: path
          },
          headers
        ) as FetchResultError;

        expect(genericFecthGetResult.status).to.eq(FetchResultStatus.ERROR);
        expect(genericFecthGetResult.error).to.eql(new SyntaxError('Unexpected token \'>\', "> INVALID JSON" is not valid JSON'));
      });

      it('it throws the error when the result is unwrapped', async () => {
        const genericFecthGetResult = await genericFecthGet(
          {
            baseURL: baseURL,
            path: path
          },
          headers
        );

        expect(genericFecthGetResult.unwrap).to.throw(SyntaxError, 'Unexpected token \'>\', "> INVALID JSON" is not valid JSON');
      });
    });

    describe('when the request times out', () => {
      it('returns an error result', async () => {
        const path = '/timeout';

        const genericFecthGetResult = await genericFecthGet(
          {
            baseURL: baseURL,
            path: path
          },
          headers,
          undefined,
          undefined,
          10
        ) as FetchResultError;

        expect(genericFecthGetResult.status).to.eq(FetchResultStatus.ERROR);
        expect(genericFecthGetResult.error).to.eql(new FetchTimeoutError(HTTPMethod.GET, baseURL + path, 10));
      });
    });
  });

  describe('generic fecth post', () => {
    describe('when the response is 200', () => {
      it('calls get with the formatted URL and the provided headers', async () => {
        const path = '/test';

        const genericFecthPostResult = await genericFecthPost(
          {
            baseURL: baseURL,
            path: path
          },
          headers,
          body
        ) as FetchResultOK<GenericData>;

        expect(genericFecthPostResult.status).to.eq(FetchResultStatus.OK);
        expect(genericFecthPostResult.data).to.eql({ ok: 'POST /test' });
      });

      it('calls get with the formatted URL and the provided headers when there is an id', async () => {
        const path = '/test/:testId';

        const genericFecthPostResult = await genericFecthPost(
          {
            baseURL: baseURL,
            path: path,
            params: { testId: 'test-1234' }
          },
          headers,
          body
        ) as FetchResultOK<GenericData>;

        expect(genericFecthPostResult.status).to.eq(FetchResultStatus.OK);
        expect(genericFecthPostResult.data).to.eql({ ok: 'POST /test/test-1234' });
      });

      it('calls get with the formatted URL and the provided headers when there are query params', async () => {
        const path = '/test';
        const queryParams = {
          myParam: 'myParam'
        };

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
        expect(genericFecthPostResult.data).to.eql({ ok: 'POST /test?myParam=myParam' });
      });

      it('calls get with the formatted URL and the provided headers when there is an id and query params', async () => {
        const path = '/test/:testId';
        const queryParams = {
          myParam: 'myParam'
        };

        const genericFecthPostResult = await genericFecthPost(
          {
            baseURL: baseURL,
            path: path,
            params: { testId: 'test-1234' },
            queryParams: queryParams
          },
          headers,
          body
        ) as FetchResultOK<GenericData>;

        expect(genericFecthPostResult.status).to.eq(FetchResultStatus.OK);
        expect(genericFecthPostResult.data).to.eql({ ok: 'POST /test/test-1234?myParam=myParam' });
      });

      it('can unwrap the result', async () => {
        const path = '/test';

        const genericFecthPostResult = await genericFecthPost(
          {
            baseURL: baseURL,
            path: path
          },
          headers,
          body
        );

        expect(genericFecthPostResult.unwrap()).to.eql({ ok: 'POST /test' });
      });

      describe('and we consider logger options', () => {
        const path = '/test';

        it('calls the logger when it has logger options', async () => {
          const performanceLoggerSpy = creatPerformanceLoggerMockSpy(mock, {
            name: 'generic fetch',
            message: 'This is the generic fetch message'
          });

          const genericFecthPostResult = await genericFecthPost(
            {
              baseURL: baseURL,
              path: path
            },
            headers,
            body,
            {
              name: 'generic fetch',
              message: 'This is the generic fetch message'
            }
          ) as FetchResultOK<GenericData>;

          expect(genericFecthPostResult.status).to.eq(FetchResultStatus.OK);
          expect(genericFecthPostResult.data).to.eql({ ok: 'POST /test' });

          assertPerformanceLoggerCalls(performanceLoggerSpy);
        });

        it('calls the logger when it has no logger options', async () => {
          const performanceLoggerSpy = creatPerformanceLoggerMockSpy(mock, undefined);

          const genericFecthPostResult = await genericFecthPost(
            {
              baseURL: baseURL,
              path: path
            },
            headers,
            body
          ) as FetchResultOK<GenericData>;

          expect(genericFecthPostResult.status).to.eq(FetchResultStatus.OK);
          expect(genericFecthPostResult.data).to.eql({ ok: 'POST /test' });

          assertPerformanceLoggerCalls(performanceLoggerSpy);
        });
      });
    });

    describe('when the response is not 200', () => {
      it('returns an error result', async () => {
        const path = '/not-authorised';

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
      const path = '/error';

      it('returns an error result', async () => {
        const genericFecthPostResult = await genericFecthPost(
          {
            baseURL: baseURL,
            path: path
          },
          headers,
          body
        ) as FetchResultError;

        expect(genericFecthPostResult.status).to.eq(FetchResultStatus.ERROR);
        expect(genericFecthPostResult.error).to.eql(new SyntaxError('Unexpected token \'>\', "> INVALID JSON" is not valid JSON'));
      });

      it('it throws the error when the result is unwrapped', async () => {
        const genericFecthPostResult = await genericFecthPost(
          {
            baseURL: baseURL,
            path: path
          },
          headers,
          body
        );

        expect(genericFecthPostResult.unwrap).to.throw(SyntaxError, 'Unexpected token \'>\', "> INVALID JSON" is not valid JSON');
      });
    });

    describe('when the request times out', () => {
      it('returns an error result', async () => {
        const path = '/timeout';

        const genericFecthPostResult = await genericFecthPost(
          {
            baseURL: baseURL,
            path: path
          },
          headers,
          body,
          undefined,
          10
        ) as FetchResultError;

        expect(genericFecthPostResult.status).to.eq(FetchResultStatus.ERROR);
        expect(genericFecthPostResult.error).to.eql(new FetchTimeoutError(HTTPMethod.POST, baseURL + path, 10));
      });
    });
  });
});
