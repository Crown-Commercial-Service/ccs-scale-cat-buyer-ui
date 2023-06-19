import { LoggerInstance } from '../../common/util/fetch/logger/loggerInstance';
import * as express from 'express';
import { cookies } from '../cookies/cookies';
import { ErrorView } from '../../common/shared/error/errorView';
import { rollbarLogger } from '@common/logger/rollbarLogger';

/**
 * @LogTracer for distribution tracing
 * @class
 *
 */
export class LoggTracer {
  /**
   * @param errorLog
   * @param res
   */
  static infoLogger = async (dataSet: any, message: any, req: express.Request): Promise<void> => {
    let body = null;
    if (dataSet?.config?.data != undefined && dataSet?.config?.data != null && dataSet?.config?.data != '') {
      body = dataSet?.config?.data; //JSON.parse(dataSet?.config?.data)
    }

    const LogMessage = {
      environment: process.env.LOGIT_ENVIRONMENT,
      logType: 'CAS_INFO',
      level: 'info',
      pageUrl: req.protocol + '://' + req.get('host') + req.originalUrl,
      statusCode: dataSet?.status != undefined ? dataSet?.status : null,
      message: message,
      baseUrl: dataSet?.config?.baseURL,
      api: dataSet?.config?.url,
      method: dataSet?.config?.method,
      body: body,
      startTime: dataSet?.config?.metadata?.startTime != undefined ? dataSet?.config?.metadata?.startTime : null,
      endTime: dataSet?.config?.metadata?.endTime != undefined ? dataSet?.config?.metadata?.endTime : null,
      duration: dataSet?.duration != undefined ? dataSet?.duration : null,
      time: new Date(),
    };
    if (process.env.LOGIT_API_KEY != '') {
      await LoggerInstance.Instance.post('', LogMessage);
    }
  };

  static errorLogger = async (
    res: express.Response,
    error: any,
    _location: string,
    _sessionId: string,
    _userId: string,
    _error_reason: string,
    redirect?: boolean
  ): Promise<void> => {
    rollbarLogger(error);

    if (redirect) {
      if (!isNaN(error?.response?.status) && error?.response?.status === 401) {
        res.clearCookie(cookies.sessionID);
        res.clearCookie(cookies.state);
        res.redirect('/oauth/login');
      } else {
        res.render(ErrorView.internalServer);
      };
    }
  };
}
