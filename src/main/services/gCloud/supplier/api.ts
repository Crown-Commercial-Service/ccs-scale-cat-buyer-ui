import { genericFecthGet } from 'main/services/helpers/api';
import { EndPoints, GCloudFilters, GCloudFilterQueryParams } from 'main/services/types/gCloud/supplier/api';
import { FetchResult } from 'main/services/types/helpers/api';

const baseURL: string = process.env.GCLOUD_SUPPLIER_API_URL;
const supplierAPIKey = process.env.GCLOUD_TOKEN;

const endPoints: EndPoints = {
  filters: '/g-cloud-filters'
};

// GET /g-cloud-filters
const getGCloudFilters = async (lot: string, serviceCategories: string, parentCategory: string): Promise<FetchResult<GCloudFilters>> => {
  const queryParams: GCloudFilterQueryParams = {
    lot: lot,
    serviceCategories: serviceCategories,
    parentCategory: parentCategory
  };

  Object.keys(queryParams).forEach((key: keyof GCloudFilterQueryParams) => queryParams[key] === undefined && delete queryParams[key]);

  return genericFecthGet<GCloudFilters>(
    {
      baseURL: baseURL,
      path: endPoints.filters,
      queryParams: queryParams
    },
    {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${supplierAPIKey}`
    }
  );
};

const supplierAPI = {
  getGCloudFilters
};

export { supplierAPI };
