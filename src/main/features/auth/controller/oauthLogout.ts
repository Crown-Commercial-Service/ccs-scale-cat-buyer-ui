import * as express from 'express'
//import { Oauth_Instance } from './../../../common/util/fetch/OauthService/OauthInstance';

/**
 * 
 * @Rediect 
 * @endpoint '/oauth/logout
 * @param req 
 * @param res 
 */
export const OAUTH_LOGOUT = async (req : express.Request, res : express.Response)=> {
    //const access_token = req.cookies['SESSION_ID'];
    res.clearCookie('SESSION_ID'); 
    res.clearCookie('state'); 
    res.redirect('/')
    // try {
    //     let redirectURL: string = await Oauth_Instance.tokenRemove(access_token);
    //     res.redirect(redirectURL)
    // } 
    // catch (err){
    //     console.log(err);
    // }
}