import * as express from 'express'
import { Oauth_Instance } from './../../../common/util/fetch/OauthService/OauthInstance';

/**
 * 
 * @Rediect 
 * @endpoint '/oauth/logout
 * @param req 
 * @param res 
 */
export const OAUTH_LOGOUT = async (req : express.Request, res : express.Response)=> {
    const access_token = req.cookies['SESSION_ID'];
    res.clearCookie('state'); 
    res.cookie('SESSION_ID', {expires: Date.now()});
    try {
        let redirectURL: any = await Oauth_Instance.tokenRemove(access_token);
        res.redirect(redirectURL.request.res.responseUrl)
    } 
    catch (err){
         console.log(err);
     }
}