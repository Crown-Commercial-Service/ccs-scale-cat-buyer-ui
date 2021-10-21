import * as express from 'express';
import config from 'config';

/**
 * 
 * @Rediect 
 * @endpoint '/oauth/logout
 * @param req 
 * @param res 
 */
export const OAUTH_LOGOUT = async (req : express.Request, res : express.Response)=> {
    res.clearCookie('state'); 
    res.clearCookie('SESSION_ID');
    const paramsUrl = `redirect-uri=${config.get('authenticationService.logout_callback')}&client-id=${process.env.AUTH_SERVER_CLIENT_ID}`;
    const logoutUrl = `${process.env.AUTH_SERVER_BASE_URL}${config.get('authenticationService.logout')}?${paramsUrl}`;
    res.redirect(logoutUrl);
}