import { Application } from 'express';
import healthCheck from '@hmcts/nodejs-healthcheck';
import { GenericReponse, DigitalMarketplaceResponse, TendersServiceReponse } from './health.types';
import { agreementsService } from 'main/services/agreementsService';
import { bankHolidays } from 'main/services/bankHolidays';
import { contentService } from 'main/services/contentService';
import { gCloud } from 'main/services/gCloud';
import { tendersService } from 'main/services/tendersService';

const genericResponse = (_err: any, res: GenericReponse) => {
  if (res !== undefined) {
    return res.statusCode === 200 ? healthCheck.up() : healthCheck.down();
  }

  return healthCheck.down();
};

const digitalMarketplaceResponse = (_err: any, res: DigitalMarketplaceResponse) => {
  if (res !== undefined) {
    return res.body.status === 'ok' ? healthCheck.up() : healthCheck.down();
  }

  return healthCheck.down();
};

const genericConfig = {
  callback: genericResponse,
  timeout: 5000,
  deadline: 10000,
};

const digitalMarketplaceConfig = {
  callback: digitalMarketplaceResponse,
  timeout: 5000,
  deadline: 10000,
};

export default (app: Application): void => {
  const healthCheckConfig = {
    checks: {
      casBuyerUi: healthCheck.raw(() => healthCheck.up()),
      agreementService: healthCheck.web(agreementsService.url.statusURL(), genericConfig),
      bankHolidays: healthCheck.web(bankHolidays.url.statusURL(), genericConfig),
      contentService: healthCheck.web(contentService.url.statusURL(), genericConfig),
      gCloudSearch: healthCheck.web(gCloud.url.search.statusURL(), digitalMarketplaceConfig),
      gCloudService: healthCheck.web(gCloud.url.service.statusURL(), digitalMarketplaceConfig),
      gCloudSupplier: healthCheck.web(gCloud.url.supplier.statusURL(), digitalMarketplaceConfig),
      tendersApi: healthCheck.web(tendersService.url.statusURL(), {
        callback: (_err: any, res: TendersServiceReponse) => {
          if (res !== undefined) {
            return res.serverError ? healthCheck.down() : healthCheck.up();
          }

          return healthCheck.down();
        },
        timeout: 5000,
        deadline: 10000,
      }),
    },
  };
  healthCheck.addTo(app, healthCheckConfig);
};
