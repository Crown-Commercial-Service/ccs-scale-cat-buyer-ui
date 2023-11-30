import { genericFecthGet } from 'main/services/helpers/api';
import { EndPoints, GCloudServiceAggregations, GCloudServiceSearch } from 'main/services/types/gCloud/search/api';
import { FetchResult } from 'main/services/types/helpers/api';
import { baseURL } from './helpers';
import { QueryParams } from 'main/services/types/helpers/url';

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${process.env.GCLOUD_SEARCH_API_TOKEN}`
});

const endPointWithIndex = (path: string) => {
  return `${process.env.GCLOUD_INDEX}${path}`;
};

// GET /:g-cloud-index/services/search
const getServicesSearch = async (queryParams?: QueryParams): Promise<FetchResult<GCloudServiceSearch>> => {
  return genericFecthGet<GCloudServiceSearch>(
    {
      baseURL: baseURL(),
      path: endPointWithIndex(EndPoints.SERVICES_SEARCH),
      queryParams: queryParams
    },
    headers()
  );
};

// GET /:g-cloud-index/services/aggregations
const getServicesAggregations = async (queryParams?: QueryParams): Promise<FetchResult<GCloudServiceAggregations>> => {
  return genericFecthGet<GCloudServiceAggregations>(
    {
      baseURL: baseURL(),
      path: endPointWithIndex(EndPoints.SERVICES_AGGREGATIONS),
      queryParams: queryParams
    },
    headers()
  );
};

const searchAPI = {
  getServicesSearch,
  getServicesAggregations
};

export { searchAPI };
