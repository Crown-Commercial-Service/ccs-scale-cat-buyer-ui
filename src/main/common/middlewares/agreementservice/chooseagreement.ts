import { TokenDecoder } from './../../tokendecoder/tokendecoder';
import * as express from 'express'
import { AgreementAPI } from '../../util/fetch/agreementservice/agreementsApiInstance';
import { sortObject } from '../../util/operators/sortObject';
import { LoggTracer } from '../../logtracer/tracer'
import { LotDetail } from '../models/lot-detail'


/**
 * 
 * @Middleware
 * @param req 
 * @param res 
 * @param next 
 */
export class ChooseAgreementMiddleware {
    static FetchAgreements = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (req.session.agreement_id) {
            const BaseURL = "/agreements/" + req.session.agreement_id + "/lots";
            const retrieveAgreementPromise = AgreementAPI.Instance.get(BaseURL)
            const { state, SESSION_ID } = req.cookies;
            retrieveAgreementPromise.then(async (data) => {
                const containedData = data?.data;
                res.locals.project_agreement = containedData;
                const draft: LotDetail[] = containedData
                // getting supplier count for the lot
                for (const lot of draft) {
                    const BaseUrlAgreementSuppliers = `/agreements/${req.session.agreement_id}/lots/${lot.number}/suppliers`;
                    const { data: retrieveAgreementSuppliers } = await AgreementAPI.Instance.get(BaseUrlAgreementSuppliers);
                    lot.suppliers = retrieveAgreementSuppliers.length + " suppliers";
                }

                res.locals.sortedItems = sortObject.sort_by(draft, "number", true);
                next();

            }).catch(
                (err) => {
                    LoggTracer.errorLogger(res, err, `${req.headers.host}${req.originalUrl}`, state,
                        TokenDecoder.decoder(SESSION_ID), "Agreement Service Api cannot be connected", true)
                }
            )
        } else {
            next();
        }
    }
}