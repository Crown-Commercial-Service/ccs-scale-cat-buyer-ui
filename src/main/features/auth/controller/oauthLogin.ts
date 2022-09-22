import * as express from 'express'
import { AuthorizationRedirect } from './authRedirect'

/**
 * 
 * @Rediect 
 * @endpoint '/oauth/login
 * @param req 
 * @param res 
 */
export const OAUTH_LOGIN = (req: express.Request, res: express.Response) => {
   let redirectURL: string | any = new AuthorizationRedirect();
   redirectURL = redirectURL.Redirect_Oauth_URL(req);
   res.redirect(redirectURL)
}