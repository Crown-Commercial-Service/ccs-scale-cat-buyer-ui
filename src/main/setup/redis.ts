import * as express from 'express';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import config from 'config';
import { operations } from '../utils/operations/operations';

import { Logger } from '@hmcts/nodejs-logging';
const logger = Logger.getLogger('redis');

const RedisInstanceSetup = (app: express.Express): void => {
  const RedisStore = connectRedis(session);

  let redis_localenv_access: string | any = process.env['VCAP_SERVICES'];
  redis_localenv_access = JSON.parse(redis_localenv_access);
  const redisHost = redis_localenv_access?.redis?.[0]?.['credentials']?.['host'];
  const redisPort = Number(redis_localenv_access?.redis?.[0]?.['credentials']?.['port']) || 6379;
  const redisPassword = redis_localenv_access?.redis?.[0]?.['credentials']?.['password'];

  let redisProperties: Object = {
    host: redisHost,
    port: redisPort,
    password: redisPassword,
  };

  let runner_env_string = process.env['SESSIONS_MODE'];

  if (runner_env_string == '' || runner_env_string == undefined) {
    runner_env_string = process.env['NODE_ENV']?.replace(/\s+/g, '');
  }

  const runner_environment = runner_env_string;

  if (operations.notEquals(runner_environment, 'development')) {
    redisProperties = Object.assign(
      {},
      {
        ...redisProperties,
        tls: {},
      }
    );
  }
  const redisClient = redis.createClient(redisProperties);
  redisClient.on('error', function (err) {
    logger.error({ msg: 'error establishing connection' });
  });
  redisClient.on('connect', function () {
    logger.info({ msg: 'successfully connected to the redis' });
  });
  let sessionExpiryTime = Number(config.get('Session.time'));
  sessionExpiryTime = sessionExpiryTime * 60 * 1000;

  let Session = {
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    proxy: true,
    rolling: true,
    cookie: {
      secure: false, // if true only transmit cookie over https
      httpOnly: false, // if true prevent client side JS from reading the cookie
      maxAge: sessionExpiryTime, // session max age in miliseconds
      sameSite: 'lax' as const,
    },
  };

  if (operations.notEquals(runner_environment, 'development')) {
    Session = Object.assign(
      {},
      {
        ...Session,
        cookie: {
          secure: true, // if true only transmit cookie over https
          httpOnly: false, // if true prevent client side JS from reading the cookie
          maxAge: sessionExpiryTime, // session max age in miliseconds
          sameSite: 'lax' as const,
        },
      }
    );
  }

  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      ...Session,
    })
  );
};

export { RedisInstanceSetup };
