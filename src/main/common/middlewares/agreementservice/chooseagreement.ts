import { TokenDecoder } from './../../tokendecoder/tokendecoder';
import * as express from 'express'
import { AgreementAPI } from '../../util/fetch/agreementservice/agreementsApiInstance';
import { sortObject } from '../../util/operators/sortObject';
import { LoggTracer } from '../../logtracer/tracer'


/**
 * 
 * @Middleware
 * @param req 
 * @param res 
 * @param next 
 */
export class ChooseAgreementMiddleware {
    static FetchAgreements = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let BaseURL = "/agreements/RM6263/lots";
        let retrieveAgreementPromise = AgreementAPI.Instance.get(BaseURL)
        const { state, SESSION_ID } = req.cookies;
        retrieveAgreementPromise.then((data) => {
            let containedData = data?.data;
            res.locals.project_agreement = containedData;
            res.locals.sortedItems = sortObject.sort_by(containedData, "number", true);
            next();

        }).catch(
            (err) => {
                LoggTracer.errorLogger(err, `${req.headers.host}${req.originalUrl}`, state,
                    TokenDecoder.decoder(SESSION_ID), "Agreement Service Api cannot be connected", true)
                // res.render(ErrorView.notfound)
            }
        )
    }
}