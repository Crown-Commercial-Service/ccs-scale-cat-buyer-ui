import { initRollbar } from 'main/setup/rollbar';
import { Logger } from '@hmcts/nodejs-logging';

const defaultLogger = Logger.getLogger('app');

const rollbarLogger = (error: any, logger: any = defaultLogger): void => {
  const rollbar = initRollbar();

  logger.error(`${error.stack || error}`);

  if (rollbar) rollbar.error(error);
};

export { rollbarLogger };
