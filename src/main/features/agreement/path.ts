import { AUTH } from '../../common/middlewares/oauthservice/authstatecheck';
import {CHOOSE_AGREEMENT_CONTROLLER} from './controller/index';
import {CHOOSE_AGREEMENT_PATHS} from './model/agreementConstants';
import {ChooseAgreementMiddleware} from '../../common/middlewares/agreementservice/chooseagreement'
import { Application } from 'express';
import {ContentFetchMiddleware} from '../../common/middlewares/menu-contentservice/contentservice'


export default function(app: Application): void {
 // 
 app.get(CHOOSE_AGREEMENT_PATHS.CHOOSE_AGREEMENT, 
    [ContentFetchMiddleware.FetchContents,ChooseAgreementMiddleware.FetchAgreements, AUTH],
     CHOOSE_AGREEMENT_CONTROLLER.CHOOSE_AGREEMENT);

}