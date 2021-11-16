import { TokenDecoder } from './../../tokendecoder/tokendecoder';
import * as express from 'express'
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { LoggTracer } from '../../logtracer/tracer'
const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('PreMarketEngagementMiddleware');

/**
 * 
 * @Middleware
 * @param req 
 * @param res 
 * @param next 
 */
export class PreMarketEngagementMiddleware {
    static PutPremarket = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const { eventId, projectId } = req.session;
        if (projectId && eventId) {
            const { SESSION_ID, state } = req.cookies;
            const baseURL = `tenders/projects/${projectId}/events/${eventId}`;
            const _body = {
                "eventType": 'RFI' //scat-964 for the time being this is hardcoded
            }

            console.log(_body)
            logger.warn("request body is hardcoded");
            const retrievePreMarketPromise = TenderApi.Instance(SESSION_ID).put(baseURL, _body)
            retrievePreMarketPromise.then((data) => {
            next();
            }).catch(
                (err) => {
                    LoggTracer.errorLogger(err, `${req.headers.host}${req.originalUrl}`, state,
                    TokenDecoder.decoder(SESSION_ID), "Pre market engagement Service Api cannot be connected", true)
                    // res.render(ErrorView.notfound)
                }
            )
        } else {
            next()
        }
    }
}