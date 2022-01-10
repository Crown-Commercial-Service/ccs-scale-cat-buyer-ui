import { LoggerInstance } from "../../common/util/fetch/logger/loggerInstance"
import { LogMessageFormatter } from '../logtracer/logmessageformatter'
import * as express from 'express'
import { ErrorView } from "../../common/shared/error/errorView";
const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('logit helper');

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
    static errorTracer = async (errorLog: any, res: express.Response): Promise<void> => {
        let LogMessage = { "AppName": "CaT frontend", "type": "error", "errordetails": errorLog }
        await LoggerInstance.Instance.post('', LogMessage);
        res.render(ErrorView.internalServer)
    }

    /**
     * 
     * @param errorLog
     */
         static errorTracerWithoutRedirect = async (errorLog: any): Promise<void> => {
            let LogMessage = { "AppName": "CaT frontend", "type": "error", "errordetails": errorLog }
            await LoggerInstance.Instance.post('', LogMessage);
        }

    static errorLogger = async (res: express.Response, errorLog: any, location: string, sessionId: string, userId: string, error_reason: string, redirect?: boolean): Promise<void> => {
        delete errorLog?.config?.['headers'];
        let Logmessage = {
            "Person_id": userId,
            "error_location": location,
            "sessionId": sessionId,
            "error_reason": error_reason,
            "exception": errorLog
        }
        let Log = new LogMessageFormatter(
            Logmessage.Person_id,
            Logmessage.error_location,
            Logmessage.sessionId,
            Logmessage.error_reason,
            Logmessage.exception
        )
        logger.error("Exception logged in Logit: "+error_reason);
        if(redirect){
            LoggTracer.errorTracer(Log, res);
        } else {
            LoggTracer.errorTracerWithoutRedirect(Log);
        }
    }
}
