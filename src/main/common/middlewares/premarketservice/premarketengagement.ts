//@ts-nocheck
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
        const { eventId, projectId, procurements } = req.session;
        const isAlreadyStarted = procurements.some((proc: any) => proc.eventId === eventId && proc.procurementID === projectId && proc.started); 
        if (projectId && eventId && !isAlreadyStarted) {
            const { SESSION_ID, state } = req.cookies;
            const baseURL = `tenders/projects/${projectId}/events/${eventId}`;
            const _body = {
                "eventType": 'RFI' //scat-964 for the time being this is hardcoded
            }

            logger.warn("request body is hardcoded");
            const retrievePreMarketPromise = TenderApi.Instance(SESSION_ID).put(baseURL, _body)
            retrievePreMarketPromise.then((data) => {
                const currentProcNum = procurements.findIndex((proc: any) => proc.eventId === eventId && proc.procurementID === projectId); 
                req.session.procurements[currentProcNum].started = true;
                next();
            }).catch(
                (err) => {
                    LoggTracer.errorLogger(res, err, `${req.headers.host}${req.originalUrl}`, state,
                        TokenDecoder.decoder(SESSION_ID), "Pre market engagement Service Api cannot be connected", true)
                    // res.render(ErrorView.notfound)
                }
            )
        } else {
            next()
        }
    }
}