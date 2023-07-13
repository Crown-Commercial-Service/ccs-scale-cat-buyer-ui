import { NextFunction, Request, Response } from 'express';
import { Query } from '../../util/operators/query';
import config from 'config';
import { cookies } from '../../cookies/cookies';
import { ErrorView } from '../../shared/error/errorView';
import { LoggTracer } from '../../logtracer/tracer';
import { Logger } from '@hmcts/nodejs-logging';
import { ppg } from 'main/services/publicProcurementGateway';
import { AuthCredentials, GrantType } from 'main/services/types/publicProcurementGateway/oAuth/api';
import { FetchError } from 'main/services/helpers/errors';
import { TokenDecoder } from '@common/tokendecoder/tokendecoder';

const logger = Logger.getLogger('receiver-middleware');

/**
 *
 * @Middleware
 * @param req
 * @param res
 * @param next
 */
export const CREDENTAILS_FETCH_RECEIVER = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { code, state } = req.query;
  if (Query.isUndefined(code)) {
    res.redirect(ErrorView.notfound);
  } else {
    //@ Grant Authorization with the token to re-direct to the callback page
    const authCredentails: AuthCredentials = {
      grant_type: GrantType.AUTHORIZATION_CODE,
      code: code as string,
      redirect_uri: process.env.CAT_URL + '/receiver',
    };

    try {
      const containedData = (await ppg.api.oAuth.postRefreshToken(authCredentails)).unwrap();
      const { access_token, session_state, refresh_token } = containedData;

      const authStatusCheck = (await ppg.api.oAuth.postValidateToken(access_token)).unwrap();

      if (authStatusCheck) {
        let cookieExpiryTime = Number(config.get('Session.time'));
        cookieExpiryTime = cookieExpiryTime * 60 * 1000; //milliseconds
        const timeforcookies = cookieExpiryTime;
        res.cookie(cookies.sessionID, access_token, {
          maxAge: Number(timeforcookies),
          httpOnly: true,
        });
        res.cookie(cookies.state, state, {
          maxAge: Number(timeforcookies),
          httpOnly: true,
        });
        const userSessionInformation = TokenDecoder.getJwtPayload(access_token);
        req.session['isAuthenticated'] = true;
        req.session['refresh_token'] = refresh_token;
        req.session['access_token'] = access_token;
        req.session['user'] = userSessionInformation;
        req.session['userServerSessionID'] = session_state;
        req.session['agreement_id'] = '';
        req.session['agreementName'] = '';
        req.session['lotNum'] = '';
        req.session['releatedContent'] = '';
        req.session['journey_status'] = '';
        req.session['procurements'] = [];
        req.session['searched_user'] = [];
        req.session['agreementEndDate'] = '';
        req.session['agreementDescription'] = '';
        req.session['nonOCDSList'] = '';
        req.session['selectedRoute'] = '';
        req.session['caSelectedRoute'] = '';
        req.session['fcSelectedRoute'] = '';
        req.session['designations'] = [];
        req.session['designationsLevel2'] = [];
        req.session['tableItems'] = [];
        req.session['dimensions'] = [];
        req.session['weightingRange'] = {};
        req.session['errorTextSumary'] = [];
        req.session['CapAss'] = {};
        req.session['isTcUploaded'] = true;
        req.session['isTimelineRevert'] = false;
        req.session['publishclickevents'] = [];
        next();
      } else {
        logger.info('User redirected to logout');
        res.redirect('/oauth/logout');
      }
    } catch (error) {
      if (error instanceof FetchError && error.status === 401) {
        LoggTracer.errorLogger(
          res,
          error,
          `${req.headers.host}${req.originalUrl}`,
          null,
          null,
          'Conclave authentication flow error',
          false
        );
        res.redirect('/401');
      } else {
        LoggTracer.errorLogger(
          res,
          error,
          `${req.headers.host}${req.originalUrl}`,
          null,
          null,
          'Conclave authentication flow error',
          true
        );
      }
    }
  }
};
