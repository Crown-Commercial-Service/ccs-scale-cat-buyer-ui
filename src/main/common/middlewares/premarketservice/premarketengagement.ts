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
        const { eventId, projectId } = req.session.eventId;
        if (projectId && eventId) {
            const { SESSION_ID, state } = req.cookies;
            const baseURL = `tenders/projects/${projectId}/events/${eventId}`;
            const _body = {
                "eventType": 'RFI' //scat-964 for the time being this is hardcoded
            }
            const retrievePreMarketPromise = TenderApi.Instance(SESSION_ID).put(baseURL, _body)
            retrievePreMarketPromise.then((data) => {
                next();
            }).catch(
                (err) => {
                    console.log("BIG ERROR ", err)
                    delete err?.config?.['headers'];
                    let Logmessage = {
                        "Person_id": TokenDecoder.decoder(SESSION_ID),
                        "error_location": `${req.headers.host}${req.originalUrl}`,
                        "sessionId": state,
                        "error_reason": "Pre market engagement Service Api cannot be connected",
                        "exception": err
                    }
                    let Log = new LogMessageFormatter(
                        Logmessage.Person_id,
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