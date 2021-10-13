import * as express from 'express'
import { AuthorizationRedirect } from './AuthorizationRedirect'

//@ OAUTH call the redirect URL
export const OAUTH_LOGIN = (req : express.Request, res : express.Response)=> {
   let redirectURL = AuthorizationRedirect.Redirect_Oauth_URL();
   res.redirect(redirectURL)
}