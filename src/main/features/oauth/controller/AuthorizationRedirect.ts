//@ts-nocheck
import * as express from 'express'

const dotenv = require('dotenv');
const result = dotenv.config();
if (result.error) throw result.error;
const { parsed: envs } = result;

export class AuthorizationRedirect {
//@ redirect the user to the resource owner for authorization
    static Redirect_Oauth_URL = () => {
        return `${envs.AUTH_SERVER_BASE_URL}/security/authorize?response_type=code&scope=openid%20profile%20email&client_id=${envs.CLIENT_ID}&redirect_uri=${envs.CALLBACK_URL}`    
    }
};