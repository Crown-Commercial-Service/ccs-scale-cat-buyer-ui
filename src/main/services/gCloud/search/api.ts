import { genericFecthGet } from 'main/services/helpers/api';
import { EndPoints, GCloudServiceAggregations, GCloudServiceSearch } from 'main/services/types/gCloud/search/api';
import { FetchResult } from 'main/services/types/helpers/api';

const baseURL: string = process.env.GCLOUD_SEARCH_API_URL;
const searchAPIKey = process.env.GCLOUD_SEARCH_API_TOKEN;
const gCloudIndex = process.env.GCLOUD_INDEX;

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${searchAPIKey}`
};

const endPointWithIndex = (path: string) => {
  return `${gCloudIndex}${path}`;
};

// GET /:g-cloud-index/services/search
const getServicesSearch = async (queryParams?: { [key: string]: string }): Promise<FetchResult<GCloudServiceSearch>> => {
  return genericFecthGet<GCloudServiceSearch>(
    {
      baseURL: baseURL,
      path: endPointWithIndex(EndPoints.SERVICES_SEARCH),
      queryParams: queryParams
    },
    headers
  );
};

// GET /:g-cloud-index/services/aggregations
const getServicesAggregations = async (queryParams?: { [key: string]: string }): Promise<FetchResult<GCloudServiceAggregations>> => {
  return genericFecthGet<GCloudServiceAggregations>(
    {
      baseURL: baseURL,
      path: endPointWithIndex(EndPoints.SERVICES_AGGREGATIONS),
      queryParams: queryParams
    },
    headers
  );
};

const searchAPI = {
  getServicesSearch,
  getServicesAggregations
};

export { searchAPI };
