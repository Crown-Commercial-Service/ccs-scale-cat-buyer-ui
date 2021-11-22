//@ts-nocheck
import { Oauth_Instance } from '../../util/fetch/OauthService/OauthInstance';
import * as express from 'express'
import qs from 'qs';
import { Query } from '../../util/operators/query';
import config from 'config'
import { cookies } from '../../cookies/cookies';
import { ErrorView } from '../../shared/error/errorView';
import { LoggTracer } from '../../logtracer/tracer'
import * as jwtDecoder from 'jsonwebtoken';

const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('receiver-middleware');


/**
 * 
 * @Middleware
 * @param req 
 * @param res 
 * @param next 
 */
export const CREDENTAILS_FETCH_RECEIVER = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let {
        code, state
    } = req.query;
    if (Query.isUndefined(code)) {

        res.redirect(ErrorView.notfound);
    } else {
        let Oauth_check_endpoint: string = config.get('authenticationService.token-endpoint')
        //@ Create the authentication credetial to to allow the re-direct
        var auth_credentails: any = {
            "code": code,
            "client_id": process.env.AUTH_SERVER_CLIENT_ID,
            "client_secret": process.env.AUTH_SERVER_CLIENT_SECRET,
            "grant_type": config.get('authenticationService.access_granttype'),
            "redirect_uri": process.env.CAT_URL + '/receiver',
        }
        auth_credentails = qs.stringify(auth_credentails)
        //@ Grant Authorization with the token to re-direct to the callback page     

        try {
            let PostAuthCrendetails = await Oauth_Instance.Instance.post(Oauth_check_endpoint, auth_credentails);
            let data = PostAuthCrendetails?.data
            let containedData = data;
            let { access_token, session_state } = containedData;

            let AuthCheck_Instance = Oauth_Instance.TokenCheckInstance(access_token);
            let check_token_validation = await AuthCheck_Instance.post('');
            let auth_status_check = check_token_validation?.['data'];
            if (auth_status_check) {
                let cookieExpiryTime = Number(config.get('Session.time'));
                cookieExpiryTime = cookieExpiryTime * 60 * 1000;  //milliseconds
                let timeforcookies = cookieExpiryTime
                res.cookie(cookies.sessionID, access_token, {
                    maxAge: Number(timeforcookies),
                    httpOnly: true
                })
                res.cookie(cookies.state, state, {
                    maxAge: Number(timeforcookies),
                    httpOnly: true
                })
                let userSessionInformation = jwtDecoder.decode(access_token, { complete: true });
                req.session['isAuthenticated'] = true;
                req.session['access_token'] = access_token;
                req.session['user'] = userSessionInformation;
                req.session['userServerSessionID'] = session_state;
                req.session['procurements'] = [];
                req.session['agreement_id'] = "";
                req.session['agreementName'] = "";
                req.session['searched_user'] = [];
                req.session['agreementEndDate'] = "";
                req.session['agreementDescription'] = "";
                next();
            } else {
                logger.info("User redirected to logout")
                res.redirect('/oauth/logout')
            }

        } catch (error) {
            if (error.response.status === 401) {
                LoggTracer.errorLogger(res, error, `${req.headers.host}${req.originalUrl}`, null, null, "Conclave authentication flow error", false)
                res.redirect('/401')
            } else {
                LoggTracer.errorLogger(res, error, `${req.headers.host}${req.originalUrl}`, null, null, "Conclave authentication flow error", true)
            }
        }

    }
}