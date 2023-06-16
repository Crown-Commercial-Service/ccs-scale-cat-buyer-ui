import session, { SessionOptions } from 'express-session';
import config from 'config';
import RedisStore from 'connect-redis';
import { createRedisClient } from './client';

const redisSession = async () => {
  let environment = process.env.SESSIONS_MODE;

  if (!environment) {
    environment = process.env['NODE_ENV']?.replace(/\s+/g, '');
  }

  const sessionOptions: SessionOptions = {
    secret: process.env.SESSION_SECRET ?? '',
    resave: true,
    saveUninitialized: false,
    proxy: true,
    rolling: true,
    cookie: {
      secure: environment !== 'development', // if true only transmit cookie over https
      httpOnly: false, // if true prevent client side JS from reading the cookie
      maxAge: (Number(config.get('Session.time')) * 60 * 1000), // session max age in miliseconds
      sameSite: 'lax',
    },
  };

  const client = createRedisClient();
  
  await client.connect();

  const redisStore = new RedisStore({
    client: client
  });

  return session({
    store: redisStore,
    ...sessionOptions
  });
};

export { redisSession };
