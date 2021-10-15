import { ErrorView } from '../../shared/error/errorView';
import * as express from 'express'
import {AgreementAPI} from '../../util/fetch/agreementservice/agreementsApiInstance'
import {Query} from '../../util/operators/query'

/**
 * 
 * @Middleware
 * @param req 
 * @param res 
 * @param next 
 */
export class AgreementDetailsFetchMiddleware {
    static FetchAgreements = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        var {agreement_id} = req.query;
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
                (err) => res.render(ErrorView.notfound)
            )            
        }
    }
}