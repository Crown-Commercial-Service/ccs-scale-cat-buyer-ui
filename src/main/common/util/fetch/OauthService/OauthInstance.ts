import * as axios from 'axios'
import config from 'config'
/**
 * Oauth_Instance 
 * 
 * @API_Instance
 * @
 */

export class Oauth_Instance {

    static AuthService_BaseURl = process.env.AUTH_SERVER_BASE_URL;
    static tokenCheck_AuthService_BaseURL = process.env.AUTH_SERVER_BASE_URL+ config.get('authenticationService.token_validation_endpoint');
    static Client_id = process.env.AUTH_SERVER_CLIENT_ID;
    static Instance = axios.default.create({
        baseURL: Oauth_Instance.AuthService_BaseURl,
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    static TokenCheckInstance =  (secret_token: string)  => {
        let BaseURL = `${Oauth_Instance.tokenCheck_AuthService_BaseURL}?clientId=${Oauth_Instance.Client_id}`;
       return  axios.default.create({
            baseURL: BaseURL,
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${secret_token}`   
            }
        })
    } 
   
}