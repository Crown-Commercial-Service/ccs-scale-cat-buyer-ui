//@ts-nocheck
import * as express from 'express'
import * as dotenv from 'dotenv'
const result = dotenv.config();
if (result.error) throw result.error;
const { parsed: envs } = result;

/**
 * @Controller
 * @Path AuthVariable
 * @description created Auth Paramaters
 */
class Auth_Variable {
    AuthBaseURL : string = envs.AUTH_SERVER_BASE_URL;
    ClientID : string  = envs.CLIENT_ID;
    CallBackURL : string =  envs.CALLBACK_URL;
}

/**
 * @Controller
 * @Path Authorization Redirect
 * @description Authorization redirecting and constucting the baseURL to conclave
 */
export class AuthorizationRedirect {

     Auth_var = new Auth_Variable;
      
     Redirect_Oauth_URL = () => {
        let redirectral_url =  `${this.Auth_var.AuthBaseURL}/security/authorize?response_type=code&scope=openid%20profile%20email&client_id=${this.Auth_var.ClientID}&redirect_uri=${this.Auth_var.CallBackURL}`;
        return  redirectral_url;
    }
};