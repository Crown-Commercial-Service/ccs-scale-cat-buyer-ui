import { expect } from 'chai';
import { Interceptable, MockAgent, setGlobalDispatcher } from 'undici';
import { FetchResultOK, FetchResultStatus } from 'main/services/types/helpers/api';
import { searchAPI } from 'main/services/gCloud/search/api';
import { GCloudServiceAggregations, GCloudServiceSearch } from 'main/services/types/gCloud/search/api';

describe('G-Cloud Search API helpers', () => {
  const baseURL = process.env.GCLOUD_SEARCH_API_URL;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.GCLOUD_SEARCH_API_TOKEN}`
  };
  let mockPool: Interceptable;

  beforeEach(() => {
    const mockAgent = new MockAgent();
    mockPool = mockAgent.get(baseURL);
    setGlobalDispatcher(mockAgent);
  });

  describe('getServicesSearch', () => {
    const path = '/g-cloud-42/services/search';

    it('calls the get g-cloud services search endpoint with the correct url and headers', async () => {
      mockPool.intercept({
        method: 'GET',
        path: path,
        headers: headers
      }).reply(200, {
        documents: [{}],
        links: {
          next: 'nextLink'
        },
        meta: {
          query: {},
          results_per_page: 123,
          took: 234,
          total: 345
        }
      });

      const servicesSearchResult = await searchAPI.getServicesSearch() as FetchResultOK<GCloudServiceSearch>;

      expect(servicesSearchResult.status).to.eq(FetchResultStatus.OK);
      expect(servicesSearchResult.data).to.eql({
        documents: [{}],
        links: {
          next: 'nextLink'
        },
        meta: {
          query: {},
          results_per_page: 123,
          took: 234,
          total: 345
        }
      });
    });

    it('calls the get g-cloud services search endpoint with the correct url, headers and query params', async () => {
      mockPool.intercept({
        method: 'GET',
        path: `${path}?my_param=myParam`,
        headers: headers
      }).reply(200, {
        documents: [{}],
        links: {
          next: 'nextLink'
        },
        meta: {
          query: {},
          results_per_page: 123,
          took: 234,
          total: 345
        }
      });

      const servicesSearchResult = await searchAPI.getServicesSearch({ my_param: 'myParam' }) as FetchResultOK<GCloudServiceSearch>;

      expect(servicesSearchResult.status).to.eq(FetchResultStatus.OK);
      expect(servicesSearchResult.data).to.eql({
        documents: [{}],
        links: {
          next: 'nextLink'
        },
        meta: {
          query: {},
          results_per_page: 123,
          took: 234,
          total: 345
        }
      });
    });
  });

  describe('gCloudServicesAggregations', () => {
    const path = '/g-cloud-42/services/aggregations';

    it('calls the get g-cloud services aggregations endpoint with the correct url and headers', async () => {
      mockPool.intercept({
        method: 'GET',
        path: path,
        headers: headers
      }).reply(200, {
        aggregations: {
          lot: {
            'myLot': 456
          }
        },
        links: {
          next: 'nextLink'
        },
        meta: {
          query: {},
          results_per_page: 123,
          took: 234,
          total: 345
        }
      });

      const servicesAggregationsResult = await searchAPI.getServicesAggregations() as FetchResultOK<GCloudServiceAggregations>;

      expect(servicesAggregationsResult.status).to.eq(FetchResultStatus.OK);
      expect(servicesAggregationsResult.data).to.eql({
        aggregations: {
          lot: {
            'myLot': 456
          }
        },
        links: {
          next: 'nextLink'
        },
        meta: {
          query: {},
          results_per_page: 123,
          took: 234,
          total: 345
        }
      });
    });

    it('calls the get g-cloud services aggregations endpoint with the correct url, headers and query params', async () => {
      mockPool.intercept({
        method: 'GET',
        path: `${path}?my_param=myParam`,
        headers: headers
      }).reply(200, {
        aggregations: {
          lot: {
            'myLot': 456
          }
        },
        links: {
          next: 'nextLink'
        },
        meta: {
          query: {},
          results_per_page: 123,
          took: 234,
          total: 345
        }
      });

      const servicesAggregationsResult = await searchAPI.getServicesAggregations({ my_param: 'myParam' }) as FetchResultOK<GCloudServiceAggregations>;

      expect(servicesAggregationsResult.status).to.eq(FetchResultStatus.OK);
      expect(servicesAggregationsResult.data).to.eql({
        aggregations: {
          lot: {
            'myLot': 456
          }
        },
        links: {
          next: 'nextLink'
        },
        meta: {
          query: {},
          results_per_page: 123,
          took: 234,
          total: 345
        }
      });
    });
  });
});
