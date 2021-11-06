import * as express from 'express';


const localEnvariables = (app: express.Express): void => {
    const environentVar =  require('dotenv').config()
    const { parsed: envs } = environentVar;

    const LocalredisCluster : any =  {
        "redis": [
         {
          "credentials": {
           "host": "127.0.0.1",
           "password": "",
           "port": 6379,
           "uri": ""
          }
         }
        ]
       }
    process.env['AUTH_SERVER_CLIENT_ID'] = envs.AUTH_SERVER_CLIENT_ID;
    process.env['AUTH_SERVER_CLIENT_SECRET'] = envs.AUTH_SERVER_CLIENT_SECRET;
    process.env['AUTH_SERVER_BASE_URL'] = envs.AUTH_SERVER_BASE_URL;
    process.env['CAT_URL'] = envs.CAT_URL;
    process.env['TENDERS_SERVICE_API_URL'] = envs.TENDERS_SERVICE_API_URL;
    process.env['LOGIT_API_KEY'] = envs.LOGIT_API_KEY;
    process.env['VCAP_SERVICES'] = JSON.stringify(LocalredisCluster); 
    process.env['SESSION_SECRET'] = envs.SESSION_SECRET
    process.env['CONCLAVE_KEY'] = envs.CONCLAVE_KEY
};

export {localEnvariables}
