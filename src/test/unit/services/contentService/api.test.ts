import config from 'config';
import { expect } from 'chai';
import { FetchResultError, FetchResultOK, FetchResultStatus, HTTPMethod } from 'main/services/types/helpers/api';
import { Interceptable, MockAgent, setGlobalDispatcher } from 'undici';
import { contentServiceAPI } from 'main/services/contentService/api';
import { FetchTimeoutError } from 'main/services/helpers/errors';
import { ContentServiceMenu } from 'main/services/types/contentService/api';
import { assertRedisCalls, assertRedisCallsWithCache, creatRedisMockSpy } from 'test/utils/mocks/redis';
import Sinon from 'sinon';
import { assertPerformanceLoggerCalls, creatPerformanceLoggerMockSpy } from 'test/utils/mocks/performanceLogger';

describe('Content service API helpers', () => {
  const mock = Sinon.createSandbox();
  const baseURL = config.get('contentService.BASEURL') as string;
  const headers = {
    'Content-Type': 'application/json',
  };
  let mockPool: Interceptable;

  beforeEach(() => {
    const mockAgent = new MockAgent();
    mockPool = mockAgent.get(baseURL);
    setGlobalDispatcher(mockAgent);
  });

  afterEach(() => {
    mock.restore();
  });

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

    describe('when no data is cached', () => {
      it('calls the get menu endpoint with the correct url and headers and logs the performance', async () => {
        const mockRedisClientSpy = creatRedisMockSpy(mock);
        const mockedPerformanceLoggerSpy = creatPerformanceLoggerMockSpy(mock, {
          name: 'content service',
          message: `Feached menu from the Content service API for menu: ${menuId}`
        });

        mockPool.intercept({
          method: 'GET',
          path: path,
          headers: headers
        }).reply(200, data);
  
        const findMenuResult = await contentServiceAPI.getMenu(menuId) as FetchResultOK<ContentServiceMenu>;

        expect(findMenuResult.status).to.eq(FetchResultStatus.OK);
        expect(findMenuResult.data).to.eql(data);

        assertRedisCalls(mockRedisClientSpy, 'get_content_service_menu_menuId-1234', data, 3600);
        assertPerformanceLoggerCalls(mockedPerformanceLoggerSpy);
      });
    });

    describe('when data is cached', () => {
      it('does not call the get menu endpoint but still returns the data and logs the performance', async () => {
        const mockRedisClientSpy = creatRedisMockSpy(mock, data);
        const mockedPerformanceLoggerSpy = creatPerformanceLoggerMockSpy(mock, {
          name: 'content service',
          message: `Feached menu from the Content service API for menu: ${menuId}`
        });

        const findMenuResult = await contentServiceAPI.getMenu(menuId) as FetchResultOK<ContentServiceMenu>;

        expect(findMenuResult.status).to.eq(FetchResultStatus.OK);
        expect(findMenuResult.data).to.eql(data);

        assertRedisCallsWithCache(mockRedisClientSpy, 'get_content_service_menu_menuId-1234');
        assertPerformanceLoggerCalls(mockedPerformanceLoggerSpy);
      });
    });

    it('returns an error if the delay is too long', async () => {
      const mockRedisClientSpy = creatRedisMockSpy(mock);

      mockPool.intercept({
        method: 'GET',
        path: path,
        headers: headers
      }).reply(200, data).delay(160);

      const findMenuResult = await contentServiceAPI.getMenu(menuId) as FetchResultError;

      expect(findMenuResult.status).to.eq(FetchResultStatus.ERROR);
      expect(findMenuResult.error).to.eql(new FetchTimeoutError(HTTPMethod.GET, baseURL + '/wp-json/wp-api-menus/v2/menus/:menuId', 15));

      // The behaviour of redis is the same as in the scenario where there is a cache,
      // i.e. it tries to retrieve the data from the cache but does not set any new data
      assertRedisCallsWithCache(mockRedisClientSpy, 'get_content_service_menu_menuId-1234');
    });
  });
});
