//@ts-nocheck
import * as express from 'express';
import { Oauth_Instance } from '../../util/fetch/OauthService/OauthInstance';
import * as jwt from 'jsonwebtoken';
import { TokenDecoder } from '../../tokendecoder/tokendecoder';
import { LoggTracer } from '../../logtracer/tracer';
import config from 'config';
import { cookies } from '../../cookies/cookies';
import qs from 'qs';
import session from 'express-session';

/**
 *
 * @Middleware
 * @param req
 * @param res
 * @param next123
 *
 */
export const AUTH: express.Handler = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { SESSION_ID, state } = req.cookies;
  let requestURL = req.url;
  if (requestURL.indexOf('event/qa-supplier') ==1) {
    req.session["supplier_qa_url"] = requestURL;
  }
  /// requestURL.indexOf('event/qa-supplier') replace with requestURL.indexOf('event/management')
  if (SESSION_ID === undefined && requestURL != null && requestURL.indexOf('event/qa-supplier') == 1) {
    req.session["supplier_qa_url"] = requestURL;
    res.redirect('/oauth/login');
  }
  else if (SESSION_ID === undefined) {
    res.redirect('/oauth/login');
  }
  else {
    const decoded: any = jwt.decode(req.session['access_token'], { complete: true });
    await PERFORM_REFRESH_TOKEN(req, res, decoded);
    const access_token = req.session['access_token'];
    const AuthCheck_Instance = Oauth_Instance.TokenCheckInstance(access_token);
    const check_token_validation = AuthCheck_Instance.post('');
    check_token_validation
      .then(async data => {
        const auth_status_check = data?.data;
        if (auth_status_check) {
          const isAuthicated = {
            session: req.session['isAuthenticated'],
          };
          res.locals.Session = isAuthicated;
          // get the decoded payload ignoring signature, no secretOrPrivateKey needed

          const rolesOfUser = decoded?.payload?.roles;
          const isAuthorized = rolesOfUser?.includes('CAT_USER');
          if (!isAuthorized) {
            res.redirect('/401');
          } else {
            const user_email = decoded.payload.sub;
            const UserProfile_Instance = Oauth_Instance.TokenWithApiKeyInstance(
              process.env.CONCLAVE_WRAPPER_API_KEY,
              user_email,
            );
            const userProfile = await UserProfile_Instance.get('');
            res.locals.user_firstName = userProfile.data['firstName'];
            res.locals.user_email = user_email;
            const redis_access_token = req.session['access_token'];
            if (redis_access_token === access_token) {
              const sessionExtendedTime: Date = new Date();
              sessionExtendedTime.setMinutes(sessionExtendedTime.getMinutes() + Number(config.get('Session.time')));
              res.cookie(cookies.sessionID, access_token, {
                maxAge: Number(config.get('Session.time')) * 60 * 1000,
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
              });
              res.cookie(cookies.state, state, {
                maxAge: Number(config.get('Session.time')) * 60 * 1000,
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
              });
              req.session.cookie.expires = sessionExtendedTime;
              next();
            } else {
              res.clearCookie(cookies.sessionID);
              res.clearCookie(cookies.state);
              res.redirect('/oauth/logout');
            }
          }
        } else {
          res.clearCookie(cookies.sessionID);
          res.clearCookie(cookies.state);
          res.redirect('/oauth/logout');
        }
      })
      .catch(error => {
        LoggTracer.errorLogger(
          res,
          error,
          `${req.headers.host}${req.originalUrl}`,
          state,
          TokenDecoder.decoder(SESSION_ID),
          'Conclave authentication flow error',
          true,
        );
      });
  }
};

const PERFORM_REFRESH_TOKEN: any = async (req: express.Request, res: express.Response, decodedToken: any) => {
  const expiryTimestamp = decodedToken?.payload?.exp;
  const today = new Date();
  const endDate = new Date(expiryTimestamp * 1000);
  const minutes = parseInt((Math.abs(endDate.getTime() - today.getTime()) / (1000 * 60)) % 60);
  if (minutes <= 2) {
    const Oauth_check_endpoint: string = config.get('authenticationService.token-endpoint');
    //@ Create the authentication credetial to to allow the re-direct
    let auth_credentails: any = {
      refresh_token: req.session.refresh_token,
      client_id: process.env.AUTH_SERVER_CLIENT_ID,
      client_secret: process.env.AUTH_SERVER_CLIENT_SECRET,
      grant_type: config.get('authenticationService.refresh_token'),
    };
    auth_credentails = qs.stringify(auth_credentails);
    //@ Grant Authorization with the token to re-direct to the callback page

    try {
      const PostAuthCrendetails = await Oauth_Instance.Instance.post(Oauth_check_endpoint, auth_credentails);
      const data = PostAuthCrendetails?.data;
      const containedData = data;
      const { access_token, refresh_token } = containedData;
      req.session['access_token'] = access_token;
      req.session['refresh_token'] = refresh_token;
    } catch (error) {
      LoggTracer.errorLogger(
        res,
        error,
        `${req.headers.host}${req.originalUrl}`,
        null,
        'Conclave refresh token flow error',
        true,
      );
    }
  }
};
