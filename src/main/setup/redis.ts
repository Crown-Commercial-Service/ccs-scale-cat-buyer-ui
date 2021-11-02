import * as express from 'express';
import  redis from 'redis'
import session from 'express-session'
import connectRedis from 'connect-redis'
import config from 'config'
const RedisInstanceSetup = (app: express.Express): void => {

const RedisStore = connectRedis(session);

let redis_localenv_access : string | any = process.env['VCAP_SERVICES'];
redis_localenv_access = JSON.parse(redis_localenv_access);
let redisHost = redis_localenv_access?.redis?.[0]?.['credentials']?.['host']
let redisPort= Number(redis_localenv_access?.redis?.[0]?.['credentials']?.['port']) || 6379;
let redisPassword = redis_localenv_access?.redis?.[0]?.['credentials']?.['password'];

const redisClient = redis.createClient({
    host: redisHost,
    port: redisPort,
    password: redisPassword,
    tls: {}
})
redisClient.on('error', function (err) {
    console.log({msg: `error establishing connection`});
});
redisClient.on('connect', function () {
    console.log({msg: 'successfully connected to the redis'});
});

let sessionExpiryTime = Number(config.get('Session.time'));
sessionExpiryTime = sessionExpiryTime * 60 * 1000;  //milliseconds

app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
        secure: false, // if true only transmit cookie over https
        httpOnly: false, // if true prevent client side JS from reading the cookie 
        maxAge: sessionExpiryTime // session max age in miliseconds
    }
}))
};

export {RedisInstanceSetup}
