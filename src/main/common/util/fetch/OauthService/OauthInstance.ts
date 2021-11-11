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
    static userProfile_AuthService_BaseURL = process.env.AUTH_SERVER_BASE_URL+ config.get('authenticationService.user_profile_endpoint');
    static Client_id = process.env.AUTH_SERVER_CLIENT_ID;
    static Instance = axios.default.create({
        baseURL: Oauth_Instance.AuthService_BaseURl,
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    
    static TokenCheckInstance =  (secret_token: string) : axios.AxiosInstance  => {
        let BaseURL : string = `${Oauth_Instance.tokenCheck_AuthService_BaseURL}?client-id=${Oauth_Instance.Client_id}`;
        return  axios.default.create({
            baseURL: BaseURL,
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${secret_token}`   
            }
        })
    } 
   
    // Added this instence to get the user-profile from concalve
    static TokenWithApiKeyInstance =  (api_key: string, emailid: string) : axios.AxiosInstance  => {
        let BaseURL : string = `${Oauth_Instance.userProfile_AuthService_BaseURL}?user-id=${emailid}`;
        return  axios.default.create({
            baseURL: BaseURL,
            headers: {
            'Content-Type': 'application/json',
            'x-api-key': `${api_key}`   
            }
        })
    } 
}