import { Oauth_Instance } from '../../util/fetch/OauthService/OauthInstance';
import config from 'config';
import { cookies } from '../../cookies/cookies';
import { Handler, Request, Response, NextFunction } from 'express';
import { rollbarLogger } from '@common/logger/rollbarLogger';
import { Jwt, decode } from 'jsonwebtoken';
/**
 *
 * @Middleware
 * @param req
 * @param res
 * @param next123
 *
 */
export const AUTH: Handler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { SESSION_ID, state } = req.cookies;
  const requestURL = req.url;

  if (requestURL.indexOf('event/qa') == 1) {
    req.session['supplier_qa_url'] = requestURL;
  }

  if (SESSION_ID === undefined) {
    if (requestURL !== null && requestURL.indexOf('event/qa') === 1) {
      req.session['supplier_qa_url'] = requestURL;
      res.redirect('/oauth/login');
    } else {
      res.redirect('/oauth/login');
    }
  } else {
    //Session ID
    const decoded: Jwt = decode(req.session['access_token'], { complete: true });
    await PERFORM_REFRESH_TOKEN(req, res, decoded);
    const accessToken = req.session['access_token'];
    const authCheckTokenInstance = Oauth_Instance.TokenCheckInstance(accessToken);
    authCheckTokenInstance.post('').then(async (data) => {
      const authStatusCheck = data?.data;
      if (authStatusCheck) {
        res.locals.Session = {
          session: req.session['isAuthenticated'],
        };
        res.locals.accountUrl = process.env['AUTH_IDENTITY_BASE_URL'];

        // get the decoded payload ignoring signature, no secretOrPrivateKey needed
        // get the decoded payload ignoring signature, no secretOrPrivateKey needed

        // get the decoded payload ignoring signature, no secretOrPrivateKey needed

        const rolesOfUser = decoded?.payload?.roles;
        const isAuthorized = rolesOfUser?.includes('CAT_USER');
        if (!isAuthorized) {
          res.redirect('/401');
        } else {
          const userEmail = decoded.payload.sub;
          const authCheckTokenWithAPIInstance = Oauth_Instance.TokenWithApiKeyInstance(
            process.env.CONCLAVE_WRAPPER_API_KEY,
            userEmail
          );
          const userProfile = await authCheckTokenWithAPIInstance.get('');
          res.locals.user_firstName = userProfile.data['firstName'];
          res.locals.user_email = userEmail;
          const redisAccessToken = req.session['access_token'];
          if (redisAccessToken === accessToken) {
            const sessionExtendedTime: Date = new Date();
            sessionExtendedTime.setMinutes(sessionExtendedTime.getMinutes() + Number(config.get('Session.time')));
            res.cookie(cookies.sessionID, accessToken, {
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
      .catch((error) => {
        next(error);
      });
  }
};

const MAX_REFRESH_TOKEN_TIME_MINUTES = 14;

const PERFORM_REFRESH_TOKEN = async (req: Request, _res: Response, decodedToken: Jwt): Promise<void> => {
  const expiryTimestamp = decodedToken?.payload?.exp;
  const today = new Date();
  const endDate = new Date(expiryTimestamp * 1000);
  const minutes = Math.floor((Math.abs(endDate.getTime() - today.getTime()) / (1000 * 60)) % 60);

  if (minutes <= MAX_REFRESH_TOKEN_TIME_MINUTES) {
    const oauthCheckEndpoint: string = config.get('authenticationService.token-endpoint');

    //@ Create the authentication credetial to to allow the re-direct
    const auth_credentails = {
      refresh_token: req.session.refresh_token,
      client_id: process.env.AUTH_SERVER_CLIENT_ID,
      client_secret: process.env.AUTH_SERVER_CLIENT_SECRET,
      grant_type: config.get('authenticationService.refresh_token'),
    };

    //@ Grant Authorization with the token to re-direct to the callback page
    try {
      const postAuthCrendetails = await Oauth_Instance.Instance.post(oauthCheckEndpoint, auth_credentails);
      const { access_token, refresh_token } = postAuthCrendetails?.data ?? {};

      req.session['access_token'] = access_token;
      req.session['refresh_token'] = refresh_token;
    } catch (error) {
      rollbarLogger(error);
    }
  }
};
