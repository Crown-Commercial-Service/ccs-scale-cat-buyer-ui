//@ts-nocheck
import * as express from 'express'

const dotenv = require('dotenv');
const result = dotenv.config();
if (result.error) throw result.error;
const { parsed: envs } = result;
// TODO check calls back
export class AuthorizationMiddleware {
    static FetchOauth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        // redirect the user to the resource owner for authorization
        try {
            res.redirect(
                envs.AUTH_SERVER_BASE_URL + '/security/authorize'+
                '?client_id=' + envs.CLIENT_ID +
                '&redirect_uri=' +
                    encodeURIComponent('https://127.0.0.1/login_callback') +
                '&response_type=code'+
                '&scope=email%20profile'
            ); 
        } catch(error) {
            if (error.response.status === 401) {

            } else if (error.response.status === 401) {
                res.status(401).json("Unauthorized to access data");
                
            } else if (error.response.status === 403) {
                res.status(401).json("Permission denied");
            } else {
                res.status(500).json("Whoops, something went wrong")
            }
        }
    }
    async login_callback(req: express.Request, res: express.Response, next: express.NextFunction) {
        // the code that comes back from the resource owner during authorization
        let code = req.query.code;

        // trade the code in for an access token
        let auth = await request
            ({
                method: 'post',
                url: envs.AUTH_SERVER_BASE_URL + '/security/token',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                form: {
                    code,
                    client_id: envs.CLIENT_ID,
                    client_secret: envs.CLIENT_SECRET,
                    grant_type: 'authorization_code',
                    redirect_uri: 'https://127.0.0.1/login_callback',
                    scope: 'email profile openid'
                },
                json: true,
                simple: true
            });

        // use that token to get the data of the user
        let user = await request
            ({
                method: 'get',
                url: envs.AUTH_SERVER_BASE_URL + '/login',
                headers: {
                    Authorization: 'Bearer ' + auth.access_token
                },
                json: true,
                simple: true
            });
console.log('user ',user)
        // do something with the user data
       next();
    }
};