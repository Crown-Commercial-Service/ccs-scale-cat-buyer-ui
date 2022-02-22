import { Application } from 'express';
import { AUTH } from '../../common/middlewares/oauthservice/authstatecheck';
import { EVENT_MANAGEMENT_CONTROLLER } from './controller/index';
import { EVENT_MANAGEMENT_PATHS } from './model/eventManagementConstants';
import { AgreementDetailsFetchMiddleware } from '../../common/middlewares/agreementservice/agreementdetailsfetch'

export default function (app: Application): void {
    // This is the reciever callback after getting the token
    app.get(EVENT_MANAGEMENT_PATHS.EVENT_MANAGEMENT, [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements], EVENT_MANAGEMENT_CONTROLLER.EVENT_MANAGEMENT);

    app.get(EVENT_MANAGEMENT_PATHS.EVENT_MANAGEMENT_MESSAGING, [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements], EVENT_MANAGEMENT_CONTROLLER.EVENT_MANAGEMENT_MESSAGING);

    app.get(EVENT_MANAGEMENT_PATHS.EVENT_MANAGEMENT_MESSAGING_CREATE, [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements], EVENT_MANAGEMENT_CONTROLLER.EVENT_MANAGEMENT_MESSAGING_CREATE);

    app.get(EVENT_MANAGEMENT_PATHS.EVENT_MANAGEMENT_MESSAGING_SENT, [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements], EVENT_MANAGEMENT_CONTROLLER.EVENT_MANAGEMENT_MESSAGING_SENT);
}