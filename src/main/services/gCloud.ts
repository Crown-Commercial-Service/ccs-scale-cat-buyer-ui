import { searchAPI } from './gCloud/search/api';
import { searchURL } from './gCloud/search/url';
import { serviceAPI } from './gCloud/service/api';
import { serviceURL } from './gCloud/service/url';
import { supplierAPI } from './gCloud/supplier/api';
import { supplierURL } from './gCloud/supplier/url';

const gCloud = {
  api: {
    search: searchAPI,
    service: serviceAPI,
    supplier: supplierAPI
  },
  url: {
    search: searchURL,
    service: serviceURL,
    supplier: supplierURL
  }
};

export { gCloud };
