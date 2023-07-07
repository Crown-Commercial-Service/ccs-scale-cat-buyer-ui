import { describe, it, expect, afterEach, beforeAll, afterAll, vi } from 'vitest';
import config from 'config';
import { FetchResultError, FetchResultOK, FetchResultStatus, HTTPMethod } from 'main/services/types/helpers/api';
import { contentServiceAPI } from 'main/services/contentService/api';
import { FetchTimeoutError } from 'main/services/helpers/errors';
import { ContentServiceMenu } from 'main/services/types/contentService/api';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { matchHeaders } from 'specs/support/mswMatchers';
import { assertPerformanceLoggerCalls, creatPerformanceLoggerMockSpys } from 'specs/support/mocks/performanceLogger';
import { assertRedisCalls, assertRedisCallsWithCache, creatRedisMockSpys } from 'specs/support/mocks/redis';

describe('Content service API helpers', () => {
  const baseURL = config.get('contentService.BASEURL') as string;
  const headers = {
    'Content-Type': 'application/json',
  };

  describe('getMenu', () => {
    const menuId = 'menuId-1234';
    const path = `/wp-json/wp-api-menus/v2/menus/${menuId}`;
    const data: ContentServiceMenu = {
      ID: 1234,
      name: 'myName',
      slug: 'mySlug',
      description: 'myDescription',
      count: 234,
      items: [],
      meta: {
        links: {
          collection: 'myCollection',
          self: 'mySelf'
        }
      }
    };

    afterEach(() => {
      vi.restoreAllMocks();
    });

    describe('when the request does not timeout', () => {
      describe('and no data is cached', () => {
        const restHandlers = [
          rest.get(`${baseURL}${path}`, (req, res, ctx) => {
            if (matchHeaders(req, headers)) {
              return res(ctx.status(200), ctx.json(data));
            }
      
            return res(ctx.status(400));
          }),
        ];
      
        const server = setupServer(...restHandlers);
      
        beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
      
        afterAll(() => server.close());

        afterEach(() => server.resetHandlers());

        it('calls the get menu endpoint with the correct url and headers and logs the performance', async () => {
          const redisSpys = creatRedisMockSpys(vi);
          const performanceLoggerSpys = creatPerformanceLoggerMockSpys(vi);

          const findMenuResult = await contentServiceAPI.getMenu(menuId) as FetchResultOK<ContentServiceMenu>;

          expect(findMenuResult.status).to.eq(FetchResultStatus.OK);
          expect(findMenuResult.data).to.eql(data);

          assertRedisCalls(redisSpys, 'get_content_service_menu_menuId-1234', data, 3600);
          assertPerformanceLoggerCalls(performanceLoggerSpys, {
            name: 'content service',
            message: `Feached menu from the Content service API for menu: ${menuId}`
          });
        });
      });

      describe('and data is cached', () => {
        it('does not call the get menu endpoint but still returns the data and logs the performance', async () => {
          const redisSpys = creatRedisMockSpys(vi, data);
          const performanceLoggerSpys = creatPerformanceLoggerMockSpys(vi);

          const findMenuResult = await contentServiceAPI.getMenu(menuId) as FetchResultOK<ContentServiceMenu>;

          expect(findMenuResult.status).to.eq(FetchResultStatus.OK);
          expect(findMenuResult.data).to.eql(data);

          assertRedisCallsWithCache(redisSpys, 'get_content_service_menu_menuId-1234');
          assertPerformanceLoggerCalls(performanceLoggerSpys, {
            name: 'content service',
            message: `Feached menu from the Content service API for menu: ${menuId}`
          });
        });
      });
    });

    describe('when the request does timeout', () => {
      const restHandlers = [
        rest.get(`${baseURL}${path}`, (req, res, ctx) => {
          if (matchHeaders(req, headers)) {
            return req.passthrough();
          }
    
          return res(ctx.status(400));
        }),
      ];
    
      const server = setupServer(...restHandlers);
    
      beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
    
      afterAll(() => server.close());

      afterEach(() => server.resetHandlers());

      it('returns an error', async () => {
        const redisSpys = creatRedisMockSpys(vi);

        const findMenuResult = await contentServiceAPI.getMenu(menuId) as FetchResultError;

        expect(findMenuResult.status).to.eq(FetchResultStatus.ERROR);
        expect(findMenuResult.error).to.eql(new FetchTimeoutError(HTTPMethod.GET, baseURL + '/wp-json/wp-api-menus/v2/menus/:menuId', 15));

        // The behaviour of redis is the same as in the scenario where there is a cache,
        // i.e. it tries to retrieve the data from the cache but does not set any new data
        assertRedisCallsWithCache(redisSpys, 'get_content_service_menu_menuId-1234');
      });
    });
  });
});
