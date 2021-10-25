import { LoggerInstance } from "../../common/util/fetch/logger/loggerInstance"
import * as express from 'express'
import { ErrorView } from "../../common/shared/error/errorView";
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
    static errorTracer = async (errorLog: any, res: express.Response): Promise<void>  => {
        let LogMessage ={"AppName": "CaT frontend","type":"error","errordetails": errorLog }
        await LoggerInstance.Instance.post('', LogMessage);
        res.render(ErrorView.internalServer)
    }


}
