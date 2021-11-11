import * as express from 'express';
import redis from 'redis'
import session from 'express-session'
import connectRedis from 'connect-redis'
import config from 'config'
import { operations } from '../utils/operations/operations'

const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('redis');


const RedisInstanceSetup = (app: express.Express): void => {

    const RedisStore = connectRedis(session);

    let redis_localenv_access: string | any = process.env['VCAP_SERVICES'];
    redis_localenv_access = JSON.parse(redis_localenv_access);
    let redisHost = redis_localenv_access?.redis?.[0]?.['credentials']?.['host']
    let redisPort = Number(redis_localenv_access?.redis?.[0]?.['credentials']?.['port']) || 6379;
    let redisPassword = redis_localenv_access?.redis?.[0]?.['credentials']?.['password'];

    var redisProperties: Object = {
        host: redisHost,
        port: redisPort,
        password: redisPassword
    }

    let runner_environment = process.env['NODE_ENV']?.replace(/\s+/g, "");
    if (operations.notEquals(runner_environment, 'development')) {
        redisProperties = Object.assign(
            {},
            {
                ...redisProperties,
                tls: {}
            })
    }
    const redisClient = redis.createClient(redisProperties);
    redisClient.on('error', function (err) {
        logger.error({ msg: `error establishing connection` });
    });
    redisClient.on('connect', function () {
        logger.info({ msg: 'successfully connected to the redis' });
    });
    let sessionExpiryTime = Number(config.get('Session.time'));
    sessionExpiryTime = sessionExpiryTime * 60 * 1000;  //milliseconds
   // let expiryDateandTime =  new Date(Date.now() + sessionExpiryTime);

    app.use(session({
        store: new RedisStore({ client: redisClient }),
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: false,
        proxy: true,
        rolling: true,
        cookie: {
            secure: false, // if true only transmit cookie over https
            httpOnly: false, // if true prevent client side JS from reading the cookie 
            maxAge: sessionExpiryTime // session max age in miliseconds
        }
    }))
};

export { RedisInstanceSetup }
