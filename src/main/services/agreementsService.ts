import { agreementsServiceAPI } from './agreementsService/v1/api';
import { agreementsServiceURL } from './agreementsService/v1/url';

// if process.env.AGREEMENTS_SERVICE_VERSION ==
const agreementsService = {
  api: agreementsServiceAPI,
  url: agreementsServiceURL
};

export { agreementsService };
