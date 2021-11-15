import { TokenDecoder } from '../../tokendecoder/tokendecoder';
import { LogMessageFormatter } from '../../logtracer/logmessageformatter';
import * as express from 'express'
import { AgreementAPI } from '../../util/fetch/agreementservice/agreementsApiInstance';
import { LoggTracer } from '../../logtracer/tracer'
import { cookies } from '../../cookies/cookies';
import config from 'config';

/**
 * 
 * @Middleware
 * @param req 
 * @param res 
 * @param next 
 */
export class AgreementLotMiddleware {
    static FetchAgreements = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const { lotNum, agreement_id } = req.query;
        const { state, SESSION_ID } = req.cookies;
        const BaseUrlAgreement = "/agreements/RM6263";
        const BaseUrlAgreementLotNum = `/agreements/RM6263/lots/${lotNum}`;

        try {
            const { data: retrieveAgreement } = await AgreementAPI.Instance.get(BaseUrlAgreement);
            const { data: retrieveAgreementLotNum } = await AgreementAPI.Instance.get(BaseUrlAgreementLotNum);
            const endDate = retrieveAgreement.endDate;
            res.locals.agreement_lot = { ...retrieveAgreementLotNum };
            req.session.agreementEndDate = endDate;
            let redis_access_token = req.session['access_token'];
            let access_token = SESSION_ID;
            if (redis_access_token === access_token) {
                res.cookie(cookies.lotNum, lotNum, {
                    maxAge: Number(config.get('Session.time')) * 60 * 1000,
                    httpOnly: true
                });
                res.cookie(cookies.agreement_id, agreement_id, {
                    maxAge: Number(config.get('Session.time')) * 60 * 1000,
                    httpOnly: true
                });
            }
            next();

        } catch (err) {
            delete err?.config?.['headers'];
            let Logmessage = {
                "Person_id": TokenDecoder.decoder(SESSION_ID),
                "error_location": `${req.headers.host}${req.originalUrl}`,
                "sessionId": state,
                "error_reason": "Agreement Service Api cannot be connected",
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
        }
    }
}