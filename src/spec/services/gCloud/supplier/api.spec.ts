import { expect } from 'chai';
import { FetchResultOK, FetchResultStatus } from 'main/services/helpers/api.types';
import { supplierAPI } from 'main/services/gCloud/supplier/api';
import { GCloudFilters } from 'main/services/gCloud/supplier/api.types';
import { setupServer } from 'msw/node';
import { http } from 'msw';
import { matchHeaders, matchQueryParams, mswEmptyResponseWithStatus, mswJSONResponse } from 'spec/support/mswHelpers';

describe('G-Cloud Supplier API helpers', () => {
  const baseURL = process.env.GCLOUD_SUPPLIER_API_URL;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.GCLOUD_TOKEN}`
  };

  const getGCloudFiltersData: GCloudFilters = {
    lot: {
      column: {
        filters: [
          {
            id: 'myId',
            label: 'myLabel',
            name: 'myName',
            value: 'myValue'
          }
        ],
        label: 'Column',
        slug: 'SlugNoParams'
      }
    }
  };
  const getGCloudFiltersSomeParamsData: GCloudFilters = {
    lot: {
      column: {
        filters: [
          {
            id: 'myId',
            label: 'myLabel',
            name: 'myName',
            value: 'myValue'
          }
        ],
        label: 'Column',
        slug: 'SlugSomeParams'
      }
    }
  };
  const getGCloudFiltersAllParamsData: GCloudFilters = {
    lot: {
      column: {
        filters: [
          {
            id: 'myId',
            label: 'myLabel',
            name: 'myName',
            value: 'myValue'
          }
        ],
        label: 'Column',
        slug: 'SlugAllParams'
      }
    }
  };

  const restHandlers = [
    http.get(`${baseURL}/g-cloud-filters`, ({ request }) => {
      if (matchHeaders(request, headers)) {
        if (matchQueryParams(request, '')) {
          return mswJSONResponse(getGCloudFiltersData);
        }
        if (matchQueryParams(request, '?lot=lotParams&parentCategory=parentCategoryParams')) {
          return mswJSONResponse(getGCloudFiltersSomeParamsData);
        }
        if (matchQueryParams(request, '?lot=lotParams&serviceCategories=serviceCategoriesParams&parentCategory=parentCategoryParams')) {
          return mswJSONResponse(getGCloudFiltersAllParamsData);
        }
      }

      return mswEmptyResponseWithStatus(400);
    }),
  ];

  const server = setupServer(...restHandlers);

  before(() => server.listen({ onUnhandledRequest: 'error' }));

  after(() => server.close());

  afterEach(() => server.resetHandlers());

  describe('getGCloudFilters', () => {
    it('calls the get g cloud endpoint with the correct url (with no query params) and headers', async () => {
      const gCloudFiltersResult = await supplierAPI.getGCloudFilters(undefined, undefined, undefined) as FetchResultOK<GCloudFilters>;

      expect(gCloudFiltersResult.status).to.eq(FetchResultStatus.OK);
      expect(gCloudFiltersResult.data).to.eql(getGCloudFiltersData);
    });

    it('calls the get g cloud endpoint with the correct url (with some query params) and headers', async () => {
      const gCloudFiltersResult = await supplierAPI.getGCloudFilters('lotParams', undefined, 'parentCategoryParams') as FetchResultOK<GCloudFilters>;

      expect(gCloudFiltersResult.status).to.eq(FetchResultStatus.OK);
      expect(gCloudFiltersResult.data).to.eql(getGCloudFiltersSomeParamsData);
    });

    it('calls the get g cloud endpoint with the correct url (with all query params) and headers', async () => {
      const gCloudFiltersResult = await supplierAPI.getGCloudFilters('lotParams', 'serviceCategoriesParams', 'parentCategoryParams') as FetchResultOK<GCloudFilters>;

      expect(gCloudFiltersResult.status).to.eq(FetchResultStatus.OK);
      expect(gCloudFiltersResult.data).to.eql(getGCloudFiltersAllParamsData);
    });
  });
});
