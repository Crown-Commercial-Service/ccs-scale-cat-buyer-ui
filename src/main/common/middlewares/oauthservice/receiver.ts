import { Oauth_Instance } from '../../util/fetch/OauthService/OauthInstance';
import * as express from 'express'
import qs from 'qs';
import { Query } from '../../util/operators/query';
import config from 'config'
import { cookies } from '../../cookies/cookies';
import { ErrorView } from '../../shared/error/errorView';


/**
 * 
 * @Middleware
 * @param req 
 * @param res 
 * @param next 
 */
export const CREDENTAILS_FETCH_RECEIVER =  (req : express.Request, res : express.Response, next: express.NextFunction)=> {
    let {
        code, state
    } = req.query;
    if(Query.isUndefined(code) || Query.isEmpty(state)) {
        res.redirect(ErrorView.notfound);
    } else {
        let Oauth_check_endpoint: string = config.get('authenticationService.token-endpoint')
            //@ Create the authentication credetial to to allow the re-direct
        var auth_credentails: any = {
            "code": code,
            "client_id": process.env.AUTH_SERVER_CLIENT_ID,
            "client_secret": process.env.AUTH_SERVER_CLIENT_SECRET,
            "grant_type": config.get('authenticationService.access_granttype'),
            "redirect_uri": process.env.CAT_URL+'/receiver',
        }
        auth_credentails = qs.stringify(auth_credentails)
            //@ Grant Authorization with the token to re-direct to the callback page
        let PostAuthCrendetails = Oauth_Instance.Instance.post(Oauth_check_endpoint, auth_credentails);
        //@ set the cookies for SESSION_ID and state with an expiration time
        PostAuthCrendetails.then((data) => {
            let containedData = data?.data;
            let {
                access_token, expires_in
            } = containedData;

            
            let AuthCheck_Instance = Oauth_Instance.TokenCheckInstance(access_token);
            let check_token_validation = AuthCheck_Instance.post('');
            check_token_validation.then(data => {
                let auth_status_check = data?.data;
                console.log(auth_status_check)
                if(auth_status_check) {
                    let timeforcookies = Number(expires_in) * 1000;
                    res.cookie(cookies.sessionID, access_token, {
                        maxAge: Number(timeforcookies),
                        httpOnly: true
                    })
                    res.cookie(cookies.state, state, {
                        maxAge: Number(timeforcookies),
                        httpOnly: true
                    })
                    next();
                } else {
                    res.redirect('/oauth/login')
                }
            }).catch(err => res.redirect(ErrorView.notfound));
        }).catch(err => res.redirect(ErrorView.notfound))
    }


}
