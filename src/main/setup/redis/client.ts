import { RedisClientOptions, createClient } from 'redis';
import { Logger } from '@hmcts/nodejs-logging';

const logger = Logger.getLogger('redis');

type RedisConfig = {
  credentials: {
    host?: string
    port: string
    password?: string
  }
}

const redisDefaults: RedisConfig[] = [
  {
    credentials: {
      host: undefined,
      port: '6379',
      password: undefined
    }
  }
];

const createRedisClient = () => {
  const redisLocalEnvAccess: RedisConfig[] = JSON.parse(process.env['VCAP_SERVICES'] ?? '{}')?.redis ?? redisDefaults;
  const { host: redisHost, port: redisPort, password: redisPassword } = redisLocalEnvAccess[0].credentials;

  const redisClientOpts: RedisClientOptions = {
    socket: {
      host: redisHost,
      port: Number(redisPort)
    },
    password: redisPassword,
  };

  let environment = process.env.SESSIONS_MODE;

  if (!environment) {
    environment = process.env['NODE_ENV']?.replace(/\s+/g, '');
  }

  if (environment !== 'development') {
    redisClientOpts.socket.tls = true;
  }

  const client = createClient(redisClientOpts);

  client.on('error', err => logger.error('Redis Client Error', err));
  client.on('connect', () => logger.info('Successfully connected to redis'));

  return client;
};

export { createRedisClient };
