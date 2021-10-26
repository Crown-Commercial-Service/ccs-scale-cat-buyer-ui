import { ErrorView } from '../../shared/error/errorView';
import * as express from 'express'
import {AgreementAPI} from '../../util/fetch/agreementservice/agreementsApiInstance'
import {Query} from '../../util/operators/query'
import {LogMessageFormatter} from '../../logtracer/logmessageformatter'
import {LoggTracer} from '../../logtracer/tracer'
import {TokenDecoder} from '../../tokendecoder/tokendecoder'
/**
 * 
 * @Middleware
 * @param req 
 * @param res 
 * @param next 
 */
export class AgreementDetailsFetchMiddleware {

    static FetchAgreements : express.Handler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        var {agreement_id} = req.query;
        var {SESSION_ID, state} = req.cookies
        if(Query.isUndefined(agreement_id) || Query.isEmpty(agreement_id)){
            res.render(ErrorView.notfound)
        }else{
            let BaseURL = `agreements/${agreement_id}`;
            let retrieveAgreementPromise = AgreementAPI.Instance.get(BaseURL);
            retrieveAgreementPromise.then( (data)=> {
                let containedData = data?.data;
                res.locals.project_header = containedData;
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
}