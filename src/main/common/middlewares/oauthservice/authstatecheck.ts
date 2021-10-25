import { ErrorView } from '../../shared/error/errorView';
import * as express from 'express'
import {Oauth_Instance} from '../../util/fetch/OauthService/OauthInstance'
import {cookies} from '../../cookies/cookies'
import * as jwt from 'jsonwebtoken';
import {TokenDecoder} from '../../tokendecoder/tokendecoder'
import {LogMessageFormatter} from '../../logtracer/logmessageformatter'
import {LoggTracer} from '../../logtracer/tracer'
/**
 * 
 * @Middleware
 * @param req 
 * @param res 
 * @param next 
 */
export const AUTH : express.Handler  =  (req : express.Request, res : express.Response, next: express.NextFunction) => {
    var {SESSION_ID } = req.cookies;
    if(SESSION_ID === undefined){
        res.redirect('/oauth/login');
    }
    let access_token = SESSION_ID;
    let AuthCheck_Instance = Oauth_Instance.TokenCheckInstance(access_token);
    let check_token_validation  = AuthCheck_Instance.post('');
     check_token_validation.then( (data): any => {
        let auth_status_check = data?.data;
         if(auth_status_check){
            var isAuthicated = {
                session : true
            }
            res.locals.Session = isAuthicated ;
            // get the decoded payload ignoring signature, no secretOrPrivateKey needed
            let decoded = jwt.decode(access_token, {complete: true});
            let user_email = decoded.payload.sub;
            res.locals.user_email = user_email;
                 next()
         }else{
            res.clearCookie(cookies.sessionID);
            res.clearCookie(cookies.state);
            res.redirect(ErrorView.notfound)
         }
     }).catch( error => {
        delete error?.config?.['headers'];
        let message = {
            "Person_email": TokenDecoder.decoder(SESSION_ID),
             "error_location": `${req.headers.host}${req.originalUrl}`,
             "error_reason": "Tender api cannot be connected",
             "exception": error
         }
         let Log = new LogMessageFormatter(
             message.Person_email, 
             message.error_location, 
             message.error_reason, 
             message.exception
             )
        LoggTracer.errorTracer(Log, res);
    })
}