import { LOGOUT } from './logout';
import { OAUTH_LOGOUT } from './oauthLogout';
import {OAUTH_LOGIN} from './oauthLogin'
import {Receiver} from './reciever';


/**
 * @BaseController
 * @Provider
 * 
 * @description Provides as Base for all Controller
 */
export const OAUTH_CONTROLLER = {
    OAUTH_LOGIN,
    OAUTH_LOGOUT,
    Receiver,
    LOGOUT
}