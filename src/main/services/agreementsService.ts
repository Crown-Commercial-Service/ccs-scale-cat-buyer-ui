import { agreementsServiceAPI as agreementsServiceV1API } from './agreementsService/v1/api';
import { agreementsServiceURL as agreementsServiceV1URL } from './agreementsService/v1/url';
import { agreementsServiceAPI as agreementsServiceV2API } from './agreementsService/v2/api';
import { agreementsServiceURL as agreementsServiceV2URL } from './agreementsService/v2/url';
import { AgreementsServiceAPI } from './types/agreementsService/agreementServiceApi';
import { AgreementsServiceURL } from './types/agreementsService/agreementServiceUrl';

let agreementsService: {
  api: AgreementsServiceAPI,
  url: AgreementsServiceURL
};

if (process.env.AGREEMENTS_SERVICE_VERSION == 'V2') {
  agreementsService = {
    api: agreementsServiceV2API,
    url: agreementsServiceV2URL
  };
} else {
  agreementsService = {
    api: agreementsServiceV1API,
    url: agreementsServiceV1URL
  };
}

export { agreementsService };
