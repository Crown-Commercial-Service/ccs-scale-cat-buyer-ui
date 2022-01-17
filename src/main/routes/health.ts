import { Application } from 'express';

const healthcheck = require('@hmcts/nodejs-healthcheck');

export default function(app: Application): void {
  const healthCheckConfig = {
    checks: {
      CaTBuyerUi: healthcheck.raw(() => healthcheck.up()),
      agreementService: healthcheck.web(process.env.AGREEMENTS_SERVICE_API_URL+"/agreements", {
      callback: (err: any, res: { statusCode: any }) => {
        return res.statusCode == 200 ? healthcheck.up() : healthcheck.down()
      },
      timeout: 5000,
      deadline: 10000,
    }),
    tendersApi: healthcheck.web(process.env.TENDERS_SERVICE_API_URL, {
    callback: (err: any, res: { serverError: any }) => {
      return res.serverError == false ? healthcheck.up() : healthcheck.down()
    },
    timeout: 5000,
    deadline: 10000,
  })
    },
  };
  healthcheck.addTo(app, healthCheckConfig);
}
