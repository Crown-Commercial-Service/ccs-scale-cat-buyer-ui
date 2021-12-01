import { AUTH } from '../../common/middlewares/oauthservice/authstatecheck';
import {DASHBOARD_CONTROLLER} from './controller/index';
import {DASHBOARD_PATHS} from './model/dashboardConstants';
import { Application } from 'express';
import {ContentFetchMiddleware} from '../../common/middlewares/menu-contentservice/contentservice';
import {AgreementDetailsFetchMiddleware} from '../../common/middlewares/agreementservice/agreementdetailsfetch'
import {BookMarkMiddleware} from '../../common/middlewares/bookmarked/bookmark-redirect'

export default function(app: Application): void {
    const {BookMarkRedirect} = BookMarkMiddleware
 // This is the reciever callback after getting the token
 app.get(DASHBOARD_PATHS.DASHBOARD, [
    ContentFetchMiddleware.FetchContents, AUTH, BookMarkRedirect, AgreementDetailsFetchMiddleware.FetchAgreements], DASHBOARD_CONTROLLER.DASHBOARD);
}