import config from 'config';
import { expect } from 'chai';
import { FetchResultError, FetchResultOK, FetchResultStatus, HTTPMethod } from 'main/services/types/helpers/api';
import { Interceptable, MockAgent, setGlobalDispatcher } from 'undici';
import { contentServiceAPI } from 'main/services/contentService/api';
import { FetchTimeoutError } from 'main/services/helpers/errors';
import { ContentServiceMenu } from 'main/services/types/contentService/api';

describe('Content service API helpers', () => {
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

  describe('getMenu', () => {
    const menuId = 'menuId-1234';
    const path = `/wp-json/wp-api-menus/v2/menus/${menuId}`;

    it('calls the get menu endpoint with the correct url and headers', async () => {
      mockPool.intercept({
        method: 'GET',
        path: path,
        headers: headers
      }).reply(200, {
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
      });

      const findMenuResult = await contentServiceAPI.getMenu(menuId) as FetchResultOK<ContentServiceMenu>;

      expect(findMenuResult.status).to.eq(FetchResultStatus.OK);
      expect(findMenuResult.data).to.eql({
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
      });
    });

    it('returns an error if the delay is too long', async () => {
      mockPool.intercept({
        method: 'GET',
        path: path,
        headers: headers
      }).reply(200, {
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
      }).delay(160);

      const findMenuResult = await contentServiceAPI.getMenu(menuId) as FetchResultError;

      expect(findMenuResult.status).to.eq(FetchResultStatus.ERROR);
      expect(findMenuResult.error).to.eql(new FetchTimeoutError(HTTPMethod.GET, baseURL + '/wp-json/wp-api-menus/v2/menus/:menuId', 15));
    });
  });
});
