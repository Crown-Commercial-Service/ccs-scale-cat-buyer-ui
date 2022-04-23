import * as express from 'express'
import { Oauth_Instance } from '../../util/fetch/OauthService/OauthInstance'

/**
 * 
 * @Middleware
 * @param req 
 * @param res 
 * @param next 
 */
export const NO_AUTH = (req: express.Request, res: express.Response, next: express.NextFunction) => {

    const { SESSION_ID } = req.cookies;
    if (SESSION_ID === undefined) {
        next();
    } else {
        const access_token = SESSION_ID;
        const AuthCheck_Instance = Oauth_Instance.TokenCheckInstance(access_token);
        const check_token_validation = AuthCheck_Instance.post('');
        check_token_validation.then((data): any => {
            const auth_status_check = data?.data;
            if (auth_status_check) {
                const isAuthicated = {
                    session: true
                }
                res.locals.Session = isAuthicated;
                next()
            } else {
                next()
            }
        }).catch(err => next())
    }
}