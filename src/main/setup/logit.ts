const logitEnvironmentMapping = {
  local: 'LOCAL',
  dev: 'DEV',
  int: 'SIT',
  uat: 'UAT',
  nft: 'NFT',
  pre: 'PRE-PROD',
  prd: 'PROD',
};

const defaultEnvironemnt = 'SANDBOX';

const setLogitEnvVariables = () => {
  const logitEnv = logitEnvironmentMapping[process.env.ROLLBAR_HOST as keyof typeof logitEnvironmentMapping] || defaultEnvironemnt;

  process.env.LOGIT_ENVIRONMENT = logitEnv;
};

export { setLogitEnvVariables };
