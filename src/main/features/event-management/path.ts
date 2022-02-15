import { Application } from 'express';
import { AUTH } from '../../common/middlewares/oauthservice/authstatecheck';
import {EVENT_MANAGEMENT_CONTROLLER} from './controller/index';
import {EVENT_MANAGEMENT_PATHS} from './model/eventManagementConstants';
import {ContentFetchMiddleware} from '../../common/middlewares/menu-contentservice/contentservice';
import {AgreementDetailsFetchMiddleware} from '../../common/middlewares/agreementservice/agreementdetailsfetch'

export default function(app: Application): void {
 // This is the reciever callback after getting the token
 app.get(EVENT_MANAGEMENT_PATHS.EVENT_MANAGEMENT, [
    ContentFetchMiddleware.FetchContents, AUTH, AgreementDetailsFetchMiddleware.FetchAgreements], EVENT_MANAGEMENT_CONTROLLER.EVENT_MANAGEMENT);
}