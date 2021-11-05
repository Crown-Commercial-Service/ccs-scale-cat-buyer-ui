import * as express from 'express'
import {AgreementAPI} from '../../util/fetch/agreementservice/agreementsApiInstance'
import {LogMessageFormatter} from '../../logtracer/logmessageformatter'
import {LoggTracer} from '../../logtracer/tracer'
import {TokenDecoder} from '../../tokendecoder/tokendecoder';
import * as headerData from '../../../resources/content/top-header/header.json';
/**
 * 
 * @Middleware
 * @param req 
 * @param res 
 * @param next 
 */
export class AgreementDetailsFetchMiddleware {

    static FetchAgreements : express.Handler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        var {SESSION_ID, state} = req.cookies;

            req.session.header = headerData;
            const aggrementId =  "RM3741";
            req.session.agreement_id = aggrementId;
            const agreementId_session = req.session.agreement_id
            let BaseURL = `agreements/${agreementId_session}`;
            let retrieveAgreementPromise = AgreementAPI.Instance.get(BaseURL);
            retrieveAgreementPromise.then( (data)=> {
                let containedData = data?.data;
                const {topHeader} = req.session.header;
                res.locals.project_header = {...containedData, topHeader};
                next(); 
            }).catch(
                (error) => {
                    delete error?.config?.['headers'];
                    let Logmessage = {
                        "Person_email": TokenDecoder.decoder(SESSION_ID), 
                         "error_location": `${req.headers.host}${req.originalUrl}`,
                         "sessionId": state,
                         "error_reason": "Agreement Service Api cannot be connected",
                         "exception": error
                     }
                     let Log = new LogMessageFormatter(
                         Logmessage.Person_email, 
                         Logmessage.error_location, 
                         Logmessage.sessionId,
                         Logmessage.error_reason, 
                         Logmessage.exception
                         )
                    LoggTracer.errorTracer(Log, res);
                }
            )            
    }
}