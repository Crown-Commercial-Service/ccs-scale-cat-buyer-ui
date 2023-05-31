import { Application } from 'express';
import healthCheck from '@hmcts/nodejs-healthcheck';

export default (app: Application): void => {
  const healthCheckConfig = {
    checks: {
      CaTBuyerUi: healthCheck.raw(() => healthCheck.up()),
      agreementService: healthCheck.web(process.env.AGREEMENTS_SERVICE_API_URL + '/agreements', {
        callback: (err: any, res: { statusCode: any }) => {
          return res.statusCode == 200 ? healthCheck.up() : healthCheck.down();
        },
        timeout: 5000,
        deadline: 10000,
      }),
      tendersApi: healthCheck.web(process.env.TENDERS_SERVICE_API_URL, {
        callback: (err: any, res: { serverError: any }) => {
          return res.serverError == false ? healthCheck.up() : healthCheck.down();
        },
        timeout: 5000,
        deadline: 10000,
      }),
    },
  };
  healthCheck.addTo(app, healthCheckConfig);
};
