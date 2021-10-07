//@ts-nocheck
import * as express from 'express'

const CLIENT_ID = process.env.AUTH_SERVER_CLIENT_ID || 'zyicrDa0oJsH4hULIWTNdadxQV477w45';
const CLIENT_SECRET = process.env.AUTH_SERVER_CLIENT_SECRET || 'qW5Fl8VeJfF8JANFTFB8D4k_atevoBXVs3as5O-mDI2cG56eLqGiZtV0oMPgdt3T';
const AUTH_SERVER_BASE_URL = process.env.AUTH_SERVER_BASE_URL || 'https://test.identify.crowncommercial.gov.uk'

export class AuthorizationMiddleware {
    static FetchOauth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        // redirect the user to the resource owner for authorization
        res.redirect(
            AUTH_SERVER_BASE_URL + '/security/authorize'+
            '?client_id=' + CLIENT_ID +
            '&redirect_uri=' +
                encodeURIComponent('http://127.0.0.1/fetch_oauth_callback') +
            '&response_type=code'+
            '&scope=email%20profile%20openid%20offline_access'
        );
        next(); 
    }
    async fetch_oauth_callback(req, res) {
        // the code that comes back from the resource owner during authorization
        let code = req.query.code;

        // trade the code in for an access token
        let auth = await request
            ({
                method: 'post',
                url: AUTH_SERVER_BASE_URL + '/security/token',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                form: {
                    code,
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                    grant_type: 'authorization_code',
                    redirect_uri: 'http://127.0.0.1/login_callback',
                    scope: 'email profile openid offline_access'
                },
                json: true,
                simple: true
            });

        // use that token to get the data of the user
        let user = await request
            ({
                method: 'get',
                url: AUTH_SERVER_BASE_URL + '/login',
                headers: {
                    Authorization: 'Bearer ' + auth.access_token
                },
                json: true,
                simple: true
            });

        // do something with the user data
       
    }
};