import { Application } from 'express';
import { FCA_PATHS } from './model/fca';
import { fcaController } from './controller/index';
import { AUTH } from '../../common/middlewares/oauthservice/authstatecheck';
import { AgreementDetailsFetchMiddleware } from '../../common/middlewares/agreementservice/agreementdetailsfetch';
import { PreMarketEngagementMiddleware } from '../../common/middlewares/premarketservice/premarketengagement';

export default function (app: Application): void {
  //T4.2 (3a)
  app.get(FCA_PATHS.SUPPLIERS, fcaController.SUPPLIERS);
  app.get(
    FCA_PATHS.SELECTED_SERVICES,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    fcaController.SELECTED_SERVICES
  );
  app.post(
    FCA_PATHS.POST_SELECT_SERVICES,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    fcaController.POST_SELECT_SERVICES
  );
  app.post(
    FCA_PATHS.POST_SHORTLISTED_SUPPLIERS,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    fcaController.POST_SHORTLIST_SERVICE
  );
  app.get(
    FCA_PATHS.SHORTLISTED_SUPPLIERS,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    fcaController.SHORTLIST_SERVICE
  );

  app.get(FCA_PATHS.SUPPLIERS_LIST, [AgreementDetailsFetchMiddleware.FetchAgreements], fcaController.SUPPLIER_LIST);
  app.get(
    FCA_PATHS.SUPPLIER_RATECARD,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    fcaController.SUPPLIER_RATECARD
  );

  app.get(FCA_PATHS.GET_USER_PROCUREMENT, [AUTH], fcaController.GET_USER_PROCUREMENT);

  app.get(FCA_PATHS.FCA_PROCUREMENT, [AUTH], fcaController.FCA_PROCUREMENT);
  app.get(FCA_PATHS.SHORTLISTED_SUPPLIERS_NEXTSTEP, [AUTH], fcaController.SHORTLIST_SUPPLIER_NEXTSTEP);
  //TCCS8.1 (3B)

  //Fca Paths
  app.get(FCA_PATHS.ROUTE_TO_CREATE_SUPPLIER, [AUTH], fcaController.ROUTE_TO_CREATE_SUPPLIER);
  app.get(
    FCA_PATHS.CREATE_SUPPLIER_SHORTLIST,
    [AUTH, PreMarketEngagementMiddleware.PutPremarket],
    fcaController.CREATE_SUPPLIER_SHORTLIST
  ); //FCA evet type register --> Middleware -> sample(premarketengagement.ts)
  app.get(FCA_PATHS.SELECT_SERVICES, [AUTH, PreMarketEngagementMiddleware.PutPremarket], fcaController.SELECT_SERVICES);
  app.get(
    FCA_PATHS.NEXT_STEP,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    fcaController.FCA_GET_NEXTSTEPS
  );
  app.post(
    FCA_PATHS.NEXT_STEP,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    fcaController.FCA_POST_NEXTSTEPS
  );
  app.get(FCA_PATHS.EXPORT_SUPPLIER_FILTERING, [AUTH], fcaController.EXPORT_SUPPLIER_FILTERING);
  //@GET name your projects

  app.get(
    FCA_PATHS.GET_NAME_YOUR_PROJECT,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    fcaController.GET_NAME_PROJECT
  );

  //@GET '/fca/add-collaborators'
  app.get(
    FCA_PATHS.GET_ADD_COLLABORATOR,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    fcaController.GET_ADD_COLLABORATOR
  );

  //@GET '/fca/procurement-lead'
  app.get(
    FCA_PATHS.GET_LEAD_PROCUEMENT,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    fcaController.GET_LEAD_PROCUREMENT
  );

  //@POST '/fca/name'
  app.post(FCA_PATHS.POST_PROJECT_NAME, AUTH, fcaController.POST_NAME_PROJECT);

  //@POST '/fca/get-collaborator-detail'
  app.post(FCA_PATHS.POST_ADD_COLLABORATOR, AUTH, fcaController.POST_ADD_COLLABORATOR);

  app.post(FCA_PATHS.PUT_LEAD_PROCUREMENT, AUTH, fcaController.PUT_LEAD_PROCUREMENT);

  //@POST '/fca/proceed-collaborators'
  app.post(FCA_PATHS.POST_PROCEED_COLLABORTORS, AUTH, fcaController.POST_PROCEED_COLLABORATORS);

  //@POST '/fca/get-collaborator-detail/js-enabled'
  app.post(FCA_PATHS.POST_ADD_COLLABORATOR_JSENABLED, AUTH, fcaController.POST_ADD_COLLABORATOR_JSENABLED);

  //@POST '/fca/add-collaborator-detail'
  app.post(FCA_PATHS.POST_ADD_COLLABORATOR_TO_JAGGER, AUTH, fcaController.POST_ADD_COLLABORATOR_TO_JAGGER);

  app.get(FCA_PATHS.POST_DELETE_COLLABORATOR_TO_JAGGER, AUTH, fcaController.POST_DELETE_COLLABORATOR_TO_JAGGER);
}
