import { TokenDecoder } from '../../tokendecoder/tokendecoder';
import { LogMessageFormatter } from '../../logtracer/logmessageformatter';
import { ErrorView } from '../../shared/error/errorView';
import * as express from 'express'
import { AgreementAPI } from '../../util/fetch/agreementservice/agreementsApiInstance';
import { LoggTracer } from '../../logtracer/tracer'


/**
 * 
 * @Middleware
 * @param req 
 * @param res 
 * @param next 
 */
export class AgreementLotMiddleware {
    static FetchAgreements = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const lotNum = req.query.lotNum;
        let BaseUrlAgreement = "/agreements/RM6263";
        let BaseUrlAgreementLotNum = `/agreements/RM6263/lots/${lotNum}`;
        let retrieveAgreementPromise = AgreementAPI.Instance.get(BaseUrlAgreement);
        let retrieveAgreementPromiseLotNum = AgreementAPI.Instance.get(BaseUrlAgreementLotNum);
        const { state, SESSION_ID } = req.cookies;
        retrieveAgreementPromise.then((data) => {
            let containedData = data?.data;
            req.session.agreementName = containedData.name;
            req.session.agreementEndDate = containedData.endDate;
            next();
        }).catch(
            (err) => {
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
                res.render(ErrorView.notfound)
            }
        );
        retrieveAgreementPromiseLotNum.then((data) => {
            let containedData = data?.data;
            res.locals.agreement_lot = { ...containedData };
            next();

        }).catch(
            (err) => {
                delete err?.config?.['headers'];
                let Logmessage = {
                    "Person_email": TokenDecoder.decoder(SESSION_ID),
                    "error_location": `${req.headers.host}${req.originalUrl}`,
                    "sessionId": state,
                    "error_reason": "Agreement lot Service Api cannot be connected",
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
    }
}