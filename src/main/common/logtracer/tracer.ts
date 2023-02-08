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
   * @param errorLog
   * @param res
   */
  static infoLogger = async (dataSet: any, message: any, req: express.Request): Promise<void> => {
    let body = null;
    if(dataSet?.config?.data!=undefined && dataSet?.config?.data!=null && dataSet?.config?.data!='') {
      body = dataSet?.config?.data;//JSON.parse(dataSet?.config?.data)
    }



    const LogMessage = {
      "environment": "null",
      "logType": "CAS_INFO",
      "level": "info",
      "pageUrl": req.protocol + '://' + req.get('host') + req.originalUrl,
      "statusCode":(dataSet?.status !=undefined) ? dataSet?.status : null,
      "message": message,
      "baseUrl":dataSet?.config?.baseURL,
      "api": dataSet?.config?.url,
      "method":dataSet?.config?.method,
      "body": body,
      "startTime": (dataSet?.config?.metadata?.startTime !=undefined) ? dataSet?.config?.metadata?.startTime : null,
      "endTime": (dataSet?.config?.metadata?.endTime !=undefined) ? dataSet?.config?.metadata?.endTime : null,
      "duration":(dataSet?.duration !=undefined) ? dataSet?.duration : null,
      "time": new Date()
    }    
    
    await LoggerInstance.Instance.post('', LogMessage);
  }
  
  static errorTracer = async (errorLog: LogMessageFormatter, res: express.Response): Promise<void> => {
  //  const LogMessage = { AppName: 'Contract Award Service (CAS) frontend', type: 'error', errordetails: errorLog };
 
  let body=null;
  if(errorLog?.exception?.config?.data!=undefined && errorLog?.exception?.config?.data!=null && errorLog?.exception?.config?.data!=''){
    body = JSON.parse(errorLog?.exception?.config?.data)
  }
  // let req = express.request;

  const LogMessage = { 
    "environment": "null",
    "logType": "CAS_ERROR",
    "level": "error",
    "statusCode":(errorLog?.statusCode !=undefined) ? errorLog?.statusCode : null,
    "message": errorLog?.errorRoot,
    "baseUrl":errorLog?.exception?.config?.baseURL,
    "api": errorLog?.exception?.config?.url,
    "method":errorLog?.exception?.config?.method,
    "body": body,
    "startTime": (errorLog?.exception?.config?.metadata?.startTime !=undefined) ? errorLog?.exception?.config?.metadata?.startTime : null,
    "endTime": (errorLog?.exception?.config?.metadata?.endTime !=undefined) ? errorLog?.exception?.config?.metadata?.endTime : null,
    "duration":(errorLog?.exception?.duration !=undefined) ? errorLog?.exception?.duration : null,
    "time": new Date()
    // "others":{
    //   AppName: 'Contract Award Service (CAS) frontend', type: 'error', errordetails: errorLog 
    // }
      
    };
   
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
    // const LogMessage = { 
    //   AppName: 'Contract Award Service (CAS) frontend', type: 'error', errordetails: errorLog
    //  };
    let body = null;
    if(errorLog?.exception?.config?.data!=undefined && errorLog?.exception?.config?.data!=null && errorLog?.exception?.config?.data!=''){
      body = JSON.parse(errorLog?.exception?.config?.data)
    }
    

    const LogMessage = { 
      "environment": "null",
      "logType": "CAS_ERROR",
      "level": "error",
      "statusCode":(errorLog?.statusCode !=undefined) ? errorLog?.statusCode : null,
      "message": errorLog?.errorRoot,
      "baseUrl":errorLog?.exception?.config?.baseURL,
      "api": errorLog?.exception?.config?.url,
      "method":errorLog?.exception?.config?.method,
      "body": body,
      "startTime": (errorLog?.exception?.config?.metadata?.startTime !=undefined) ? errorLog?.exception?.config?.metadata?.startTime : null,
      "endTime": (errorLog?.exception?.config?.metadata?.endTime !=undefined) ? errorLog?.exception?.config?.metadata?.endTime : null,
      "duration":(errorLog?.exception?.duration !=undefined) ? errorLog?.exception?.duration : null,
      "time": new Date()
      // "others":{
      //   AppName: 'Contract Award Service (CAS) frontend', type: 'error', errordetails: errorLog 
      // }
      
    };
    
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
      AppName: 'Contract Award Service (CAS) frontend',
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
