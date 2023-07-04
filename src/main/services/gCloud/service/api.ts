import { genericFecthGet } from 'main/services/helpers/api';
import { EndPoints, GCloudService, GCloudSupplier, GCloudSupplierFramework } from 'main/services/types/gCloud/service/api';
import { FetchResult } from 'main/services/types/helpers/api';

const baseURL: string = process.env.GCLOUD_SERVICES_API_URL;
const dmpAPIKey = process.env.GCLOUD_TOKEN;

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${dmpAPIKey}`
};

// GET /services/:service-id
const getService = async (serviceId: string): Promise<FetchResult<GCloudService>> => {
  return genericFecthGet<GCloudService>(
    {
      baseURL: baseURL,
      path: EndPoints.SERVICE,
      params: { serviceId }
    },
    headers
  );
};

// GET /services/:service-id
const getSupplier = async (supplierId: string): Promise<FetchResult<GCloudSupplier>> => {
  return genericFecthGet<GCloudSupplier>(
    {
      baseURL: baseURL,
      path: EndPoints.SUPPLIER,
      params: { supplierId }
    },
    headers
  );
};

// GET /suppliers/:supplier-id/frameworks/g-cloud-13
const getSupplierFramework = async (supplierId: string): Promise<FetchResult<GCloudSupplierFramework>> => {
  return genericFecthGet<GCloudSupplierFramework>(
    {
      baseURL: baseURL,
      path: EndPoints.SUPPLIER_FRAMEWORK,
      params: { supplierId }
    },
    headers
  );
};

const serviceAPI = {
  getService,
  getSupplier,
  getSupplierFramework
};

export { serviceAPI };
