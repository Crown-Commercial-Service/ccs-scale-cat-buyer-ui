import { initRollbar } from 'main/setup/rollbar';
import { Logger } from '@hmcts/nodejs-logging';
import { Request } from 'express';

const defaultLogger = Logger.getLogger('app');

const rollbarLogger = (req: Request, error: any, logger: any = defaultLogger): void => {
  const rollbar = initRollbar();

  logger.error(error.stack || error);

  if (rollbar) rollbar.error(req, error);
};

export { rollbarLogger };
