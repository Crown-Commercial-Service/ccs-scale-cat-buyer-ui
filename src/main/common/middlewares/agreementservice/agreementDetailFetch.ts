import * as express from 'express'
import {AgreementAPI} from '../../util/fetch/agreementservice/agreementsApiInstance'
import jsonToStringConvertor from '../../util/operators/jsonStringConvertor';
import {Query} from '../../util/operators/query'
import { HttpStatusCode } from '../../../errors/HttpStatusCode';


export class AgreementDetailsFetchMiddleware{



    static FetchAgreements = async (req: express.Request, res: express.Response, next: express.NextFunction) => {

        var {agreement_id} = req.query;
        if(Query.isEmpty(agreement_id)){
            res.render('error/404')
        }

        let BaseURL = `agreements/${agreement_id}`;
         let  retrieveAgreementDetails  = await AgreementAPI.Instance.get(BaseURL);  
         let requestStatusCodeCheck =retrieveAgreementDetails.status == HttpStatusCode.OK;

         if(requestStatusCodeCheck){
            let data : any = retrieveAgreementDetails.data;
            let convertdataToString = jsonToStringConvertor.convertor(data);
             res.cookie('rfi_information', convertdataToString);               
         }
         else{
            res.send('no working')
         }
         
        
       
         next();
    }
    
}