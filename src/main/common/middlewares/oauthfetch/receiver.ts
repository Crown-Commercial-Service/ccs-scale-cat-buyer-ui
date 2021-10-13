import { Oauth_Instance } from '../../util/fetch/OauthService/OauthInstance';
import * as express from 'express'
import config from 'config'
import qs from 'qs';
import Cookies from 'cookies';

const dotenv = require('dotenv');
const result = dotenv.config();
if (result.error) throw result.error;
const { parsed: envs } = result;

// Optionally define keys to sign cookie values
// to prevent client tampering
var keys = ['keyboard cat']

//@ OAUTH reciever callback
export const CREDENTAILS_FETCH_RECEIVER =  (req : express.Request, res : express.Response)=> {
   
    let {code, state} = req.query;
    let Oauth_check_endpoint : any = config.get('AuthService.Oauth_token_endpoint')
    //@ Create the authentication credetial to to allow the re-direct
    var auth_credentails : any =  {
        "code" : code,
        client_id: envs.CLIENT_ID,
        client_secret: envs.CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:3000/receiver',
    }

    auth_credentails = qs.stringify(auth_credentails)
    //@ Grant Authorization with the token to re-direct to the callback page
    let PostAuthCrendetails =   Oauth_Instance.Instance.post(Oauth_check_endpoint, auth_credentails);
    //@ set the cookies for SESSION_ID and state with an expiration time
    PostAuthCrendetails.then( (data)=> {
        let containedData = data?.data;
        let {access_token, expires_in} = containedData;
        var cookies = new Cookies(req, res, { keys: keys })

        // Set the cookie to a value
        cookies.set('state', state.toString(), { maxAge: parseInt(expires_in), httpOnly: true });
        cookies.set('SESSION_ID', access_token, { maxAge: parseInt(expires_in), httpOnly: true });
        const tokenKey = config.get<string>('secrets.cat.tenders-service-api-url')
        console.log(process.env.TENDERS_SERVICE_API_URL)
        console.log(tokenKey)
        res.redirect('/');

    }).catch(
        (err) => console.log(err)
    )          

}
