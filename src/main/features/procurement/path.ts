import { AUTH } from '../../common/middlewares/oauthservice/authstatecheck';
import { associatedViews } from './controller/index';
import { PROCUREMENT_PATHS } from './model/procurement';
import { Application } from 'express';
import { AgreementDetailsFetchMiddleware } from '../../common/middlewares/agreementservice/agreementDetailsFetch';

export default function (app: Application): void {
  // This is the reciever callback after getting the token
  app.get(
    PROCUREMENT_PATHS.PROCUREMENT,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    associatedViews.PROCUREMENT
  );

  app.get(
    PROCUREMENT_PATHS.ROUTE_TO_MARKET,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    associatedViews.ROUTE_TO_MARKET
  );

  app.get(
    PROCUREMENT_PATHS.CHOOSE_ROUTE,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    associatedViews.GET_CHOOSE_ROUTE
  );

  app.post(
    PROCUREMENT_PATHS.POST_CHOOSE_ROUTE,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    associatedViews.POST_CHOOSE_ROUTE
  );
}
