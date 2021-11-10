import { TokenDecoder } from './../../tokendecoder/tokendecoder';
import { LogMessageFormatter } from './../../logtracer/logmessageformatter';
import { ErrorView } from '../../shared/error/errorView';
import * as express from 'express'
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { LoggTracer } from '../../logtracer/tracer'


/**
 * 
 * @Middleware
 * @param req 
 * @param res 
 * @param next 
 */
export class PreMarketEngagementMiddleware {
    static PutPremarket = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const lotid = req.session?.lotId;
        const project_name = req.session.project_name;
        //const eventType = req.session.eventType;
        if (project_name && lotid) {
            var { SESSION_ID, state } = req.cookies;
            const baseURL = `tenders/projects/1/events/ocds-b5fd17-1`;
            let _body = {
                "name": "ocds-b5fd17-1",
                "eventType": "EOI"
            }
            let retrievePreMarketPromise = TenderApi.Instance(SESSION_ID).put(baseURL, _body)
            retrievePreMarketPromise.then((data) => {
                let containedData = data?.data;
                console.log(" containedData", containedData)
                next();

            }).catch(
                (err) => {
                    console.log("BIG ERROR ", err)
                    delete err?.config?.['headers'];
                    let Logmessage = {
                        "Person_email": TokenDecoder.decoder(SESSION_ID),
                        "error_location": `${req.headers.host}${req.originalUrl}`,
                        "sessionId": state,
                        "error_reason": "Pre market engagement Service Api cannot be connected",
                        "exception": err
                    }
                    let Log = new LogMessageFormatter(
                        Logmessage.Person_email,
                        Logmessage.error_location,
                        Logmessage.sessionId,
                        Logmessage.error_reason,
                        Logmessage.exception
                    )
                    LoggTracer.errorTracer(Log, res);
                    res.render(ErrorView.notfound)
                }
            )
        } else {
            next()
        }
    }
}