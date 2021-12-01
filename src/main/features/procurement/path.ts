import { AUTH } from '../../common/middlewares/oauthservice/authstatecheck';
import { associatedViews } from './controller/index';
import { PROCUREMENT_PATHS } from './model/procurement';
import { Application } from 'express';
import { ContentFetchMiddleware } from '../../common/middlewares/menu-contentservice/contentservice'
import { AgreementDetailsFetchMiddleware } from '../../common/middlewares/agreementservice/agreementdetailsfetch'
import {BookMarkMiddleware} from '../../common/middlewares/bookmarked/bookmark-redirect'

export default function (app: Application): void {
    const {BookMarkStorer} = BookMarkMiddleware;
    // This is the reciever callback after getting the token
    app.get(PROCUREMENT_PATHS.PROCUREMENT, [
        ContentFetchMiddleware.FetchContents,
        BookMarkStorer,
        AUTH, AgreementDetailsFetchMiddleware.FetchAgreements], associatedViews.PROCUREMENT);
}
