import { expect } from 'chai';
import { FetchResultOK, FetchResultStatus } from 'main/services/types/helpers/api';
import { searchAPI } from 'main/services/gCloud/search/api';
import { GCloudServiceAggregations, GCloudServiceSearch } from 'main/services/types/gCloud/search/api';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { matchHeaders, matchQueryParams } from 'spec/support/mswMatchers';

describe('G-Cloud Search API helpers', () => {
  const baseURL = process.env.GCLOUD_SEARCH_API_URL;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.GCLOUD_SEARCH_API_TOKEN}`
  };

  const getServicesSearchData = {
    documents: [{}],
    links: {
      next: 'nextLinkNoParams'
    },
    meta: {
      query: {},
      results_per_page: 123,
      took: 234,
      total: 345
    }
  };
  const getServicesSearchWithParamsData = { ...getServicesSearchData, links: { next: 'nextLink' } };

  const gCloudServicesAggregationsData = {
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
  };
  const gCloudServicesAggregationsWithParamsData = { ...gCloudServicesAggregationsData, links: { next: 'nextLink' } };

  const restHandlers = [
    rest.get(`${baseURL}/g-cloud-42/services/search`, (req, res, ctx) => {
      if (matchHeaders(req, headers)) {
        if (matchQueryParams(req, '')) {
          return res(ctx.status(200), ctx.json(getServicesSearchData));
        }
        if (matchQueryParams(req, '?my_param=myParam')) {
          return res(ctx.status(200), ctx.json(getServicesSearchWithParamsData));
        }
      }

      return res(ctx.status(400));
    }),
    rest.get(`${baseURL}/g-cloud-42/services/aggregations`, (req, res, ctx) => {
      if (matchHeaders(req, headers)) {
        if (matchQueryParams(req, '')) {
          return res(ctx.status(200), ctx.json(gCloudServicesAggregationsData));
        }
        if (matchQueryParams(req, '?my_param=myParam')) {
          return res(ctx.status(200), ctx.json(gCloudServicesAggregationsWithParamsData));
        }
      }

      return res(ctx.status(400));
    })
  ];

  const server = setupServer(...restHandlers);

  before(() => server.listen({ onUnhandledRequest: 'error' }));

  after(() => server.close());

  afterEach(() => server.resetHandlers());

  describe('getServicesSearch', () => {
    it('calls the get g-cloud services search endpoint with the correct url and headers', async () => {
      const servicesSearchResult = await searchAPI.getServicesSearch() as FetchResultOK<GCloudServiceSearch>;

      expect(servicesSearchResult.status).to.eq(FetchResultStatus.OK);
      expect(servicesSearchResult.data).to.eql(getServicesSearchData);
    });

    it('calls the get g-cloud services search endpoint with the correct url, headers and query params', async () => {
      const servicesSearchResult = await searchAPI.getServicesSearch({ my_param: 'myParam' }) as FetchResultOK<GCloudServiceSearch>;

      expect(servicesSearchResult.status).to.eq(FetchResultStatus.OK);
      expect(servicesSearchResult.data).to.eql(getServicesSearchWithParamsData);
    });
  });

  describe('gCloudServicesAggregations', () => {
    it('calls the get g-cloud services aggregations endpoint with the correct url and headers', async () => {
      const servicesAggregationsResult = await searchAPI.getServicesAggregations() as FetchResultOK<GCloudServiceAggregations>;

      expect(servicesAggregationsResult.status).to.eq(FetchResultStatus.OK);
      expect(servicesAggregationsResult.data).to.eql(gCloudServicesAggregationsData);
    });

    it('calls the get g-cloud services aggregations endpoint with the correct url, headers and query params', async () => {
      const servicesAggregationsResult = await searchAPI.getServicesAggregations({ my_param: 'myParam' }) as FetchResultOK<GCloudServiceAggregations>;

      expect(servicesAggregationsResult.status).to.eq(FetchResultStatus.OK);
      expect(servicesAggregationsResult.data).to.eql(gCloudServicesAggregationsWithParamsData);
    });
  });
});
