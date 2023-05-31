import { rollbar } from 'main/app';
import { Logger } from '@hmcts/nodejs-logging';

const logger = Logger.getLogger('app');

const rollbarLogger = (error: any): void => {
  logger.error(`${error.stack || error}`);

  if (rollbar) rollbar.error(error);
};

export { rollbarLogger };
