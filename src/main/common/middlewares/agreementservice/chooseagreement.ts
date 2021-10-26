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
        let BaseURL = "/agreements/RM1043.6";
        let retrieveAgreementPromise = AgreementAPI.Instance.get(BaseURL)
        retrieveAgreementPromise.then( (data)=> {
            let containedData = data?.data;
            //console.log(':::::::::::::::::::::::::::::::::::::::::: ULYSSES 555 containedData :::::::::::::::::::::::::::::::::: ', containedData)
            res.locals.project_agreement = containedData;
            res.locals.project_agreement_htmlText = htmlToText.convertor(containedData.description);
            res.locals.sortedItems = sortObject.sort_by(containedData.lots, "number", true);
            console.log(':::::::::::::::::::::::::::::::::::::::::: ULYSSES 66666 res.locals.sortedItems :::::::::::::::::::::::::::::::::: ', res.locals.sortedItems)
            next(); 

        }).catch(
            (err) => res.render(ErrorView.notfound)
        )            
    }
}