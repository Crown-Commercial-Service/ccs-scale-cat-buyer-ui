import { ErrorView } from '../../shared/error/errorView';
import * as express from 'express'
import {AgreementAPI} from '../../util/fetch/agreementservice/agreementsApiInstance';
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
        let BaseURL = "/agreements/RM1043.6/lots";
        let retrieveAgreementPromise = AgreementAPI.Instance.get(BaseURL)
        retrieveAgreementPromise.then( (data)=> {
            let containedData = data?.data;
            res.locals.project_agreement = containedData;
            res.locals.sortedItems = sortObject.sort_by(containedData, "number", true);
            next(); 

        }).catch(
            (err) => {
                res.render(ErrorView.notfound)
            }
        )            
    }
}