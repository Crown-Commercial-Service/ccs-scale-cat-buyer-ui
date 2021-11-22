//@ts-nocheck
import { TokenDecoder } from '../../tokendecoder/tokendecoder';
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
        const BaseUrlAgreement = `/agreements/${agreement_id}`;
        const BaseUrlAgreementLotNum = `/agreements/${agreement_id}/lots/${lotNum}`;
        try {
            const { data: retrieveAgreement } = await AgreementAPI.Instance.get(BaseUrlAgreement);
            const { data: retrieveAgreementLotNum } = await AgreementAPI.Instance.get(BaseUrlAgreementLotNum);
            const endDate = retrieveAgreement.endDate;
            const agreementDescription = retrieveAgreementLotNum.description;
            const agreementName = retrieveAgreement.name;
            res.locals.agreement_lot = { ...retrieveAgreementLotNum };
            req.session.agreementEndDate = endDate;
            req.session.agreementName = agreementName;
            req.session.agreementDescription = agreementDescription;
            console.log("retrieveAgreementLotNum ", retrieveAgreementLotNum)
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
            LoggTracer.errorLogger(res, err, `${req.headers.host}${req.originalUrl}`, state,
                TokenDecoder.decoder(SESSION_ID), "Agreement Service Api cannot be connected", true)
        }
    }
}