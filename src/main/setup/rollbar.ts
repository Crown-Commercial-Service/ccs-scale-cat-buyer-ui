import Rollbar from 'rollbar';

const rollbarEnvironmentMapping = {
  local: 'local',
  dev: 'development',
  int: 'integration',
  uat: 'integration',
  nft: 'sandbox',
  pre: 'pre-production',
  prd: 'production'
};

const defaultEnvironemnt = 'sandbox';

const setRollbarEnvVariables = () => {
  const rollbarEnv = rollbarEnvironmentMapping[process.env.ROLLBAR_HOST as keyof typeof rollbarEnvironmentMapping] || defaultEnvironemnt;

  process.env.ROLLBAR_ENVIRONMENT = rollbarEnv;
};

const initRollbar = (): Rollbar | undefined => {
  if (!process.env.ROLLBAR_ACCESS_TOKEN) return;

  return new Rollbar({
    accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
    environment: process.env.ROLLBAR_ENVIRONMENT,
  });
};

export { setRollbarEnvVariables, initRollbar };
