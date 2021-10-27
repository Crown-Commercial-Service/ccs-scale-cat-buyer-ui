import { ErrorView } from '../../shared/error/errorView';
import * as express from 'express'
import {AgreementAPI} from '../../util/fetch/agreementservice/agreementsApiInstance';
import { htmlToText } from '../../util/operators/htmlToText';
import { sortObject } from '../../util/operators/sortObject';


/**
 * 
 * @Middleware
 * @param req 
 * @param res 
 * @param next 
 */
export class ChooseAgreementMiddleware {
    static FetchAgreements = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        var {agreement_id} = req.cookies;
        let BaseURL = `/agreements/${agreement_id}`;
        let retrieveAgreementPromise = AgreementAPI.Instance.get(BaseURL)
        retrieveAgreementPromise.then( (data)=> {
            let containedData = data?.data;
            res.locals.project_agreement = containedData;
            res.locals.project_agreement_htmlText = htmlToText.convertor(containedData.description);
            res.locals.sortedItems = sortObject.sort_by(containedData.lots, "number", true);
            next(); 

        }).catch(
            (err) => {
                res.render(ErrorView.notfound)
            }
        )            
    }
}
