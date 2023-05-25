import { hostname } from 'os';
import { Router } from 'express';
import { infoRequestHandler } from '@hmcts/info-provider';

export default (app: Router): void => {
  app.get(
    '/info',
    infoRequestHandler({
      extraBuildInfo: {
        host: hostname(),
        name: 'expressjs-template',
        uptime: process.uptime(),
      },
      info: {
        // TODO: add downstream info endpoints if app has any
      },
    }),
  );
};
