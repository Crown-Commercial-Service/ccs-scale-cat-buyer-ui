import { organisationAPI } from './publicProcurementGateway/organisation/api';
import { oAuthAPI } from './publicProcurementGateway/oAuth/api';
import { oAuthURL } from './publicProcurementGateway/oAuth/url';

const ppg = {
  api: {
    oAuth: oAuthAPI,
    organisation: organisationAPI
  },
  url: {
    oAuth: oAuthURL
  }
};

export { ppg };
