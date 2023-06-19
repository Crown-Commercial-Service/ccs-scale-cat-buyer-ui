import { searchAPI } from './gCloud/search/api';
import { serviceAPI } from './gCloud/service/api';
import { supplierAPI } from './gCloud/supplier/api';

const gCloud = {
  api: {
    search: searchAPI,
    service: serviceAPI,
    supplier: supplierAPI
  }
};

export { gCloud };
