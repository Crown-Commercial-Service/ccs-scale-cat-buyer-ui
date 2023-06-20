import { expect } from 'chai';
import { Interceptable, MockAgent, setGlobalDispatcher } from 'undici';
import { FetchResultOK, FetchResultStatus } from 'main/services/types/helpers/api';
import { supplierAPI } from 'main/services/gCloud/supplier/api';
import { GCloudFilters } from 'main/services/types/gCloud/supplier/api';

describe('G-Cloud Supplier API helpers', () => {
  const baseURL = process.env.GCLOUD_SUPPLIER_API_URL;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.GCLOUD_TOKEN}`
  };
  let mockPool: Interceptable;

  beforeEach(() => {
    const mockAgent = new MockAgent();
    mockPool = mockAgent.get(baseURL);
    setGlobalDispatcher(mockAgent);
  });

  describe('getGCloudFilters', () => {
    const path = '/g-cloud-filters';

    it('calls the get g cloud endpoint with the correct url (with no query params) and headers', async () => {
      mockPool.intercept({
        method: 'GET',
        path: path,
        headers: headers
      }).reply(200, {
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
            slug: 'Slug'
          }
        }
      });

      const gCloudFiltersResult = await supplierAPI.getGCloudFilters(undefined, undefined, undefined) as FetchResultOK<GCloudFilters>;

      expect(gCloudFiltersResult.status).to.eq(FetchResultStatus.OK);
      expect(gCloudFiltersResult.data).to.eql({
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
            slug: 'Slug'
          }
        }
      });
    });

    it('calls the get g cloud endpoint with the correct url (with some query params) and headers', async () => {
      mockPool.intercept({
        method: 'GET',
        path: `${path}?lot=lotParams&parentCategory=parentCategoryParams`,
        headers: headers
      }).reply(200, {
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
            slug: 'Slug'
          }
        }
      });

      const gCloudFiltersResult = await supplierAPI.getGCloudFilters('lotParams', undefined, 'parentCategoryParams') as FetchResultOK<GCloudFilters>;

      expect(gCloudFiltersResult.status).to.eq(FetchResultStatus.OK);
      expect(gCloudFiltersResult.data).to.eql({
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
            slug: 'Slug'
          }
        }
      });
    });

    it('calls the get g cloud endpoint with the correct url (with all query params) and headers', async () => {
      mockPool.intercept({
        method: 'GET',
        path: `${path}?lot=lotParams&serviceCategories=serviceCategoriesParams&parentCategory=parentCategoryParams`,
        headers: headers
      }).reply(200, {
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
            slug: 'Slug'
          }
        }
      });

      const gCloudFiltersResult = await supplierAPI.getGCloudFilters('lotParams', 'serviceCategoriesParams', 'parentCategoryParams') as FetchResultOK<GCloudFilters>;

      expect(gCloudFiltersResult.status).to.eq(FetchResultStatus.OK);
      expect(gCloudFiltersResult.data).to.eql({
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
            slug: 'Slug'
          }
        }
      });
    });
  });
});
