//@ts-nocheck
import * as express from 'express'
import { AgreementAPI } from '../../util/fetch/agreementservice/agreementsApiInstance'
import { LoggTracer } from '../../logtracer/tracer'
import { TokenDecoder } from '../../tokendecoder/tokendecoder';
import { Logger } from '@hmcts/nodejs-logging';
const logger = Logger.getLogger('agreementdetailsfetch');
/**
 * 
 * @Middleware
 * @param req 
 * @param res 
 * @param next 
 */
export class AgreementDetailsFetchMiddleware {

    static FetchAgreements: express.Handler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const { SESSION_ID, state } = req.cookies;
        const agreementId_session = req.session.agreement_id;
        if (agreementId_session) {
            const agreementLotName = req.session.agreementLotName;
            const lotid = req.session?.lotId;
            const BaseURL = `agreements/${agreementId_session}`;
            const retrieveAgreementPromise = AgreementAPI.Instance.get(BaseURL);
            retrieveAgreementPromise.then((data) => {
                const containedData = data?.data;
                logger.info("Feached agreement details from Agreement service API")
                const project_name = req.session.project_name;
                req.session.agreementName = containedData['name'];
                res.locals.selectedAgreement = containedData
                const agreementName = req.session?.agreementName;
                res.locals.agreement_header = { project_name, agreementName, agreementId_session, agreementLotName, lotid }
                next();
            }).catch(
                (error) => {
                    LoggTracer.errorLogger(res, error, `${req.headers.host}${req.originalUrl}`, state,
                        TokenDecoder.decoder(SESSION_ID), "Agreement Service Api cannot be connected", true)
                }
            )
        } else {
            next();
        }
    }
}