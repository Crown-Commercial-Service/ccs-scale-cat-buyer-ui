import { initRollbar } from 'main/setup/rollbar';
import { Logger } from '@hmcts/nodejs-logging';

const defaultLogger = Logger.getLogger('app');

const rollbarLogger = (error: any, type = 'error', logger: any = defaultLogger, ): void => {
  const rollbar = initRollbar();

  if (type === 'error') {
    logger.error(error.stack || error);

    if (rollbar) rollbar.error(error);
  } else if (type === 'info') {
    if (rollbar) rollbar.info(error.message, error);
  }
};


export { rollbarLogger };
