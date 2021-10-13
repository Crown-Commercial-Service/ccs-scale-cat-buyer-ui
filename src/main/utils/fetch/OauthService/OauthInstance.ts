import * as axios from 'axios'
import config from 'config'

export class Oauth_Instance {

    static Instance = axios.default.create({
        baseURL: config.get('AuthService.BaseURL'),
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}