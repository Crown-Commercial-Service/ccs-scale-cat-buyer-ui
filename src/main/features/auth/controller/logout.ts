import * as express from 'express'
import { AuthorizationRedirect } from './authRedirect';
const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('logout');

/**
 * 
 * @Rediect 
 * @endpoint '/logout
 * @param req 
 * @param res 
 */
export const LOGOUT = (req : express.Request, res : express.Response)=> {
  req.session.destroy(function(err) {
    logger.info(err);
  })
  //BALWINDER REDIRECT TO CCS PUBLIC PROCUREMENT GATEWAY PPG LOGIN PAGE
  let redirectURL: string | any = new AuthorizationRedirect();
  redirectURL = redirectURL.Redirect_Oauth_URL();
  res.redirect(redirectURL)
  //res.redirect('/');
}