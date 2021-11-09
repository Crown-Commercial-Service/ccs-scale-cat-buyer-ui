import * as express from 'express'
import { Oauth_Instance } from '../../util/fetch/OauthService/OauthInstance'
import * as jwt from 'jsonwebtoken';
import { TokenDecoder } from '../../tokendecoder/tokendecoder'
import { LogMessageFormatter } from '../../logtracer/logmessageformatter'
import { LoggTracer } from '../../logtracer/tracer'
import config from 'config';
import { cookies } from '../../cookies/cookies'

/**
 * 
 * @Middleware
 * @param req 
 * @param res 
 * @param next 
 */
export const AUTH: express.Handler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    var { SESSION_ID, state } = req.cookies;
    if (SESSION_ID === undefined) {
        res.redirect('/oauth/login');
    }
    else {
        let access_token = SESSION_ID;
        let AuthCheck_Instance = Oauth_Instance.TokenCheckInstance(access_token);
        let check_token_validation = AuthCheck_Instance.post('');
        check_token_validation.then(async (data) => {
            let auth_status_check = data?.data;
            if (auth_status_check) {

                var isAuthicated = {
                    session: req.session['isAuthenticated']
                }
                res.locals.Session = isAuthicated
                // get the decoded payload ignoring signature, no secretOrPrivateKey needed
                let decoded: any = jwt.decode(access_token, { complete: true });
                let rolesOfUser = decoded?.payload?.roles
                let isAuthorized = rolesOfUser?.includes('CAT_USER');

                if (req.session?.user === undefined) {
                    res.clearCookie(cookies.sessionID);
                    res.clearCookie(cookies.state);
                    res.redirect('/oauth/logout')
                }
                else {
                    if (!isAuthorized) {
                        res.redirect('/401')
                    }
                    else {
                        let user_email = decoded.payload.sub;
                        let UserProfile_Instance = Oauth_Instance.TokenWithApiKeyInstance(process.env.CONCLAVE_WRAPPER_API_KEY,user_email);
                        let userProfile = await UserProfile_Instance.get('');
                        res.locals.user_firstName = userProfile.data['firstName']
                        res.locals.user_email = user_email;
                        let redis_access_token = req.session['access_token'];
                        if (redis_access_token === access_token) {
                            var sessionExtendedTime: Date = new Date();
                            sessionExtendedTime.setMinutes(sessionExtendedTime.getMinutes() + Number(config.get('Session.time')));
                            req.session.cookie.expires = sessionExtendedTime;
                            next();
                        }
                        else {
                            res.clearCookie(cookies.sessionID);
                            res.clearCookie(cookies.state);
                            res.redirect('/oauth/logout')
                        }
                    }
                }
            } else {
                res.clearCookie(cookies.sessionID);
                res.clearCookie(cookies.state);
                res.redirect('/oauth/logout')
            }
        }).catch(error => {
            delete error?.config?.['headers'];
            let Logmessage = {
                "Person_email": TokenDecoder.decoder(SESSION_ID),
                "error_location": `${req.headers.host}${req.originalUrl}`,
                "sessionId": state,
                "error_reason": "Agreement Service Api cannot be connected",
                "exception": error
            }
            let Log = new LogMessageFormatter(
                Logmessage.Person_email,
                Logmessage.error_location,
                Logmessage.sessionId,
                Logmessage.error_reason,
                Logmessage.exception
            )
            LoggTracer.errorTracer(Log, res);
        })

    }
}