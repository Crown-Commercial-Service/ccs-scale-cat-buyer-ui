import * as os from 'os';

import { infoRequestHandler, InfoContributor } from '@hmcts/info-provider';
import { Router } from 'express';

export default function(app: Router): void {
  app.get(
    '/info',
    infoRequestHandler({
      extraBuildInfo: {
        host: os.hostname(),
        name: 'expressjs-template',
        uptime: process.uptime(),
      },
      info: {
        'CAS-Buyer-UI': new InfoContributor(process.env.CAT_URL+'/info')
      },
    }),
  );

}
