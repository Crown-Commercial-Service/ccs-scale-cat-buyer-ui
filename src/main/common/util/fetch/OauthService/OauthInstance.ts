import * as axios from 'axios'
import * as dotenv from 'dotenv'
const result = dotenv.config();
if (result.error) throw result.error;
const { parsed: envs } = result;



/**
 * Oauth_Instance 
 * 
 * @Instance
 * @
 */

export class Oauth_Instance {

    static AuthService_BaseURl = envs.AUTH_SERVER_BASE_URL;
    static tokenCheck_AuthService_BaseURL = envs.AUTH_SERVER_BASE_URL+ envs.TOKEN_VALIDATION_ENDPOINT;
    static Client_id = envs.CLIENT_ID;



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