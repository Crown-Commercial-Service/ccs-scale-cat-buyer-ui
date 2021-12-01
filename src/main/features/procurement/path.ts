import { AUTH } from '../../common/middlewares/oauthservice/authstatecheck';
import { associatedViews } from './controller/index';
import { PROCUREMENT_PATHS } from './model/procurement';
import { Application } from 'express';
import { ContentFetchMiddleware } from '../../common/middlewares/menu-contentservice/contentservice'
import { AgreementDetailsFetchMiddleware } from '../../common/middlewares/agreementservice/agreementdetailsfetch'


export default function (app: Application): void {
    // This is the reciever callback after getting the token
    app.get(PROCUREMENT_PATHS.PROCUREMENT, [
        ContentFetchMiddleware.FetchContents,
        AUTH, AgreementDetailsFetchMiddleware.FetchAgreements], associatedViews.PROCUREMENT);
}
