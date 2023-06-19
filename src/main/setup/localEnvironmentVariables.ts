import { join as pathJoin } from 'path';
import { existsSync } from 'fs';
import { config } from 'dotenv';

const setLocalEnvVariables = () => {
  if (!existsSync(pathJoin(__dirname, '..', '..', '..', '.env'))) return;

  const localEnvVariables = config().parsed;
  const localRedisConfig = {
    redis: [
      {
        credentials: {
          host: '127.0.0.1',
          password: '',
          port: 6379,
        }
      }
    ]
  };

  process.env['AUTH_SERVER_CLIENT_ID'] = localEnvVariables.AUTH_SERVER_CLIENT_ID;
  process.env['AUTH_SERVER_CLIENT_SECRET'] = localEnvVariables.AUTH_SERVER_CLIENT_SECRET;
  process.env['AUTH_SERVER_BASE_URL'] = localEnvVariables.AUTH_SERVER_BASE_URL;
  process.env['CAT_URL'] = localEnvVariables.CAT_URL;
  process.env['TENDERS_SERVICE_API_URL'] = localEnvVariables.TENDERS_SERVICE_API_URL;
  process.env['LOGIT_API_KEY'] = localEnvVariables.LOGIT_API_KEY;
  process.env['VCAP_SERVICES'] = JSON.stringify(localRedisConfig);
  process.env['SESSION_SECRET'] = localEnvVariables.SESSION_SECRET;
  process.env['CONCLAVE_WRAPPER_API_KEY'] = localEnvVariables.CONCLAVE_WRAPPER_API_KEY;
  process.env['CONCLAVE_WRAPPER_API_BASE_URL'] = localEnvVariables.CONCLAVE_WRAPPER_API_BASE_URL;
};

export { setLocalEnvVariables };
