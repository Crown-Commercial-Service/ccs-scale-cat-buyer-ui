//@ts-nocheck
import * as express from 'express'
import { AgreementAPI } from '../../util/fetch/agreementservice/agreementsApiInstance'
import { LoggTracer } from '../../logtracer/tracer'
import { TokenDecoder } from '../../tokendecoder/tokendecoder';
const { Logger } = require('@hmcts/nodejs-logging');
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
        var { SESSION_ID, state } = req.cookies;
        const aggrementId = "RM6263";
        req.session.agreement_id = aggrementId;
        const agreementId_session = req.session.agreement_id;
        var agreementLotName = req.session.agreementLotName;
        var lotid = req.session?.lotId;
        let BaseURL = `agreements/${agreementId_session}`;
        let retrieveAgreementPromise = AgreementAPI.Instance.get(BaseURL);
        retrieveAgreementPromise.then((data) => {
            let containedData = data?.data;
            logger.info("THE AGREEMENT NAME ", containedData)
            var project_name = req.session.project_name;
            req.session.agreementName = containedData['name'];
            let agreementName = req.session?.agreementName;
            res.locals.agreement_header = { project_name, agreementName, agreementId_session, agreementLotName, lotid }
            next();
        }).catch(
            (error) => {
                LoggTracer.errorLogger(res, error, `${req.headers.host}${req.originalUrl}`, state,
                    TokenDecoder.decoder(SESSION_ID), "Agreement Service Api cannot be connected", true)
            }
        )
    }
}