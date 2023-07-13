import { Handler, Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { TokenDecoder } from '../../tokendecoder/tokendecoder';
import { LoggTracer } from '../../logtracer/tracer';
import config from 'config';
import { cookies } from '../../cookies/cookies';
import { ppg } from 'main/services/publicProcurementGateway';
import { AuthCredentials, GrantType } from 'main/services/types/publicProcurementGateway/oAuth/api';

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
    if (requestURL != null && requestURL.indexOf('event/qa') == 1) {
      req.session['supplier_qa_url'] = requestURL;
    }
    res.redirect('/oauth/login');
  } else {
    //Session ID
    const decodedPayload = TokenDecoder.getJwtPayload(req.session['access_token']);
    await PERFORM_REFRESH_TOKEN(req, res, decodedPayload);

    const access_token = req.session['access_token'];
    const authStatusCheck = (await ppg.api.oAuth.postValidateToken(access_token)).unwrap();

    try {
      if (authStatusCheck) {
        const isAuthicated = {
          session: req.session['isAuthenticated'],
        };
        res.locals.Session = isAuthicated;
        res.locals.accountUrl = process.env['AUTH_IDENTITY_BASE_URL'];
        // get the decoded payload ignoring signature, no secretOrPrivateKey needed

        const rolesOfUser = decodedPayload.roles;
        const isAuthorized = rolesOfUser?.includes('CAT_USER');
        if (!isAuthorized) {
          res.redirect('/401');
        } else {
          const userEmail = decodedPayload.sub;
          const userProfile = (await ppg.api.organisation.getUserProfiles(userEmail)).unwrap();

          res.locals.user_firstName = userProfile['firstName'];
          res.locals.user_email = userEmail;
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
    } catch (error) {
      LoggTracer.errorLogger(
        res,
        error,
        `${req.headers.host}${req.originalUrl}`,
        state,
        TokenDecoder.decoder(SESSION_ID),
        'Conclave authentication flow error',
        true
      );
    }
  }
};

const PERFORM_REFRESH_TOKEN = async (req: Request, res: Response, decodedPayload: JwtPayload) => {
  const expiryTimestamp = decodedPayload.exp;
  const today = new Date();
  const endDate = new Date(expiryTimestamp * 1000);
  const minutes = Math.floor((Math.abs(endDate.getTime() - today.getTime()) / (1000 * 60)) % 60);
  if (minutes <= 14) {
    //@ Grant Authorization with the token to re-direct to the callback page
    const authCredentails: AuthCredentials = {
      grant_type: GrantType.REFRESH_TOKEN,
      refresh_token: req.session.refresh_token
    };

    try {
      const containedData = (await ppg.api.oAuth.postRefreshToken(authCredentails)).unwrap();
      const { access_token, refresh_token } = containedData;

      req.session['access_token'] = access_token;
      req.session['refresh_token'] = refresh_token;
    } catch (error) {
      LoggTracer.errorLogger(
        res,
        error,
        `${req.headers.host}${req.originalUrl}`,
        null,
        null,
        'Conclave refresh token flow error',
        false
      );
    }
  }
};
