import { AUTH } from '../../common/middlewares/oauthservice/authstatecheck';
import { NO_AUTH } from '../../common/middlewares/oauthservice/openroutecheck'
import { CHOOSE_AGREEMENT_CONTROLLER } from './controller/index';
import { CHOOSE_AGREEMENT_PATHS } from './model/agreementConstants';
import { ChooseAgreementMiddleware } from '../../common/middlewares/agreementservice/chooseagreement'
import { Application } from 'express';
import { ContentFetchMiddleware } from '../../common/middlewares/menu-contentservice/contentservice'

export default function (app: Application): void {
   // agreement page
   app.get(CHOOSE_AGREEMENT_PATHS.CHOOSE_AGREEMENT,
      [ContentFetchMiddleware.FetchContents, AUTH, ChooseAgreementMiddleware.FetchAgreements],
      CHOOSE_AGREEMENT_CONTROLLER.CHOOSE_AGREEMENT);
   // Before start page - Lot details - No Auth required.
   app.get(CHOOSE_AGREEMENT_PATHS.LOT_BEFORE_START_PAGE,
      [ContentFetchMiddleware.FetchContents, NO_AUTH, ChooseAgreementMiddleware.FetchAgreements],
      CHOOSE_AGREEMENT_CONTROLLER.LOT_BEFORE_START_PAGE);
}
