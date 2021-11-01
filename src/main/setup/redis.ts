import * as express from 'express';
import  redis from 'redis'

const setupRedisInstance = (app: express.Express): void => {

let redisHost = process.env.REDIS_HOST || "";
let redisPort= Number(process.env.REDIS_PORT) || 0;
let redisPassword = process.env.REDIS_PASSWORD || "";

const redisClient = redis.createClient({
    host: redisHost,
    port: redisPort,
    password: redisPassword
})
redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
});
};

export {setupRedisInstance}
