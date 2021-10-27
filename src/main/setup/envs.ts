import * as express from 'express';


const localEnvariables = (app: express.Express): void => {
    const environentVar =  require('dotenv').config()
    const { parsed: envs } = environentVar;
    process.env['AUTH_SERVER_CLIENT_ID'] = envs.AUTH_SERVER_CLIENT_ID;
    process.env['AUTH_SERVER_CLIENT_SECRET'] = envs.AUTH_SERVER_CLIENT_SECRET;
    process.env['AUTH_SERVER_BASE_URL'] = envs.AUTH_SERVER_BASE_URL;
    process.env['CAT_URL'] = envs.CAT_URL;
    process.env['TENDERS_SERVICE_API_URL'] = envs.TENDERS_SERVICE_API_URL;
    process.env['LOGIT_API_KEY'] = envs.LOGIT_API_KEY;
    process.env['REDIS_HOST'] = envs.REDIS_HOST;
    process.env['REDIS_PORT'] = envs.REDIS_PORT;
    process.env['REDIS_PASSWORD'] = envs.REDIS_PASSWORD;
};

export {localEnvariables}
