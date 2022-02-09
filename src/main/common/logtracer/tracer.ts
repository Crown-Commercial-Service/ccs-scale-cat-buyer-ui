import { LoggerInstance } from '../../common/util/fetch/logger/loggerInstance';
import { LogMessageFormatter } from '../logtracer/logmessageformatter';
import * as express from 'express';
import { cookies } from '../cookies/cookies';
import { ErrorView } from '../../common/shared/error/errorView';
import Rollbar from 'rollbar';
const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('logit helper');
const rollbar_access_token = process.env.ROLLBAR_ACCESS_TOKEN

/**
 * @LogTracer for distribution tracing
 * @class
 *
 */
export class LoggTracer {
  /**
   *
   * @param errorLog
   * @param res
   */
  static errorTracer = async (errorLog: LogMessageFormatter, res: express.Response): Promise<void> => {
    const LogMessage = { AppName: 'CaT frontend', type: 'error', errordetails: errorLog };
    await LoggerInstance.Instance.post('', LogMessage);
    if (!isNaN(errorLog.statusCode) && errorLog.statusCode == 401) {
      res.clearCookie(cookies.sessionID);
      res.clearCookie(cookies.state);
      res.redirect('/oauth/login');
    } else res.render(ErrorView.internalServer);
  };

  /**
   *
   * @param errorLog
   */
  static errorTracerWithoutRedirect = async (errorLog: any): Promise<void> => {
    const LogMessage = { AppName: 'CaT frontend', type: 'error', errordetails: errorLog };
    await LoggerInstance.Instance.post('', LogMessage);
  };

  static errorLogger = async (
    res: express.Response,
    errorLog: any,
    location: string,
    sessionId: string,
    userId: string,
    error_reason: string,
    redirect?: boolean,
  ): Promise<void> => {
    delete errorLog?.config?.['headers'];
    let Logmessage = {
      Person_id: userId,
      error_location: location,
      sessionId: sessionId,
      error_reason: error_reason,
      exception: errorLog,
    };
    let Log = new LogMessageFormatter(
      Logmessage.Person_id,
      Logmessage.error_location,
      Logmessage.sessionId,
      Logmessage.error_reason,
      Logmessage.exception,
      errorLog?.response?.status,
    );
    logger.error('Exception logged in Logit: ' + error_reason);
    const LogMessage = {
      AppName: 'CaT frontend',
      type: 'error',
      errordetails: Log,
      browser: res.req.headers["sec-ch-ua"],
      mobile: res.req.headers["sec-ch-ua-mobile"],
      platform: res.req.headers["sec-ch-ua-platform"],
      userAgent: res.req.headers["user-agent"]
    };
    if (rollbar_access_token) {
      const rollbar = new Rollbar({
        accessToken: rollbar_access_token,
        captureUncaught: true,
        captureUnhandledRejections: true,
        environment: process.env.ROLLBAR_ENVIRONMENT,
      })
      rollbar.error(LogMessage, LogMessage.type + " : " + LogMessage.errordetails.errorRoot, res.req)
    }
    if (redirect) {
      LoggTracer.errorTracer(Log, res);
    } else {
      LoggTracer.errorTracerWithoutRedirect(Log);
    }
  };
}
