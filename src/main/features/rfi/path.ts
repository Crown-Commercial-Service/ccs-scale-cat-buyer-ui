import { Application } from 'express';
import { RFI_PATHS } from './model/rficonstant';
import { associatedViews } from './controller/index';
import { AgreementDetailsFetchMiddleware } from '../../common/middlewares/agreementservice/agreementdetailsfetch';
import { AUTH } from '../../common/middlewares/oauthservice/authstatecheck';
import { PreMarketEngagementMiddleware } from '../../common/middlewares/premarketservice/premarketengagement';

export default function (app: Application): void {
  /**
   *
   * @GET : Get Routes of RFI
   * @summary: provide all the respective associated view to the certain routes
   */
  // @GET '/rfi/rfi-tasklist'
  app.get(
    RFI_PATHS.GET_TASKLIST,
    [
      AUTH,
      AgreementDetailsFetchMiddleware.FetchAgreements,
      PreMarketEngagementMiddleware.PutPremarket,
    ],
    associatedViews.GET_TASKLIST,
  );

  //  @GET '/rfi/type'
  app.get(
    RFI_PATHS.GET_TYPE,
    [ AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    associatedViews.GET_TYPE,
  );

  //  @GET '/rfi/online-task-list'
  app.get(
    RFI_PATHS.GET_ONLINE_TASKLIST,
    [ AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    associatedViews.GET_ONLINE_TASKLIST,
  );

  //  @GET '/rfi/questions'
  app.get(
    RFI_PATHS.GET_QUESTIONS,
    [ AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    associatedViews.GET_QUESTIONS,
  );

  //  @GET '/rfi/upload-doc'
  app.get(
    RFI_PATHS.GET_UPLOAD_DOC,
    [ AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    associatedViews.GET_UPLOAD_DOC,
  );

  //@GET name your projects

  app.get(
    RFI_PATHS.GET_NAME_YOUR_PROJECT,
    [ AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    associatedViews.GET_NAME_PROJECT,
  );

  //@GET '/rfi/add-collaborators'
  app.get(
    RFI_PATHS.GET_ADD_COLLABORATOR,
    [ AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    associatedViews.GET_ADD_COLLABORATOR,
  );

  //@GET '/rfi/procurement-lead'
  app.get(
    RFI_PATHS.GET_LEAD_PROCUEMENT,
    [ AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    associatedViews.GET_LEAD_PROCUREMENT,
  );

  app.get(RFI_PATHS.GET_USER_PROCUREMENT, [AUTH], associatedViews.GET_USER_PROCUREMENT);

  //@GET "/rfi/upload-doc/remove"
  app.get(RFI_PATHS.GET_REMOVE_FILE, AUTH, associatedViews.GET_REMOVE_FILES);

  // @GET "/rfi/suppliers"
  app.get(
    RFI_PATHS.GET_RFI_SUPPLIERS,
    [ AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    associatedViews.GET_RFI_SUPPLIERS,
  );

  //@GET "/rfi/response-date"
  app.get(
    RFI_PATHS.GET_RESPONSE_DATE,
    [ AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    associatedViews.GET_RESPONSE_DATE,
  );

  //@GET = "/rfi/review"
  app.get(
    RFI_PATHS.GET_RFI_REVIEW,
    [ AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    associatedViews.GET_RFI_REVIEW,
  );

  //@GET ="/rfi/event-sent"
  app.get(
    RFI_PATHS.GET_EVENT_PUBLISHED,
    [ AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    associatedViews.GET_EVENT_PUBLISHED,
  );

  app.get(
    RFI_PATHS.RFI_GET_NEXT_STEPS,
    [ AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    associatedViews.RFI_GET_NEXT_STEPS,
  );

  app.get(
    RFI_PATHS.RFI_GET_CLOSE,
    [ AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    associatedViews.RFI_GET_CLOSE,
  );

  //@GET Offline page
  app.get(RFI_PATHS.GET_OFFLINE, AUTH, associatedViews.OFFLINE_JOURNEY_PAGE);

  //@GET /rfi/choose-how-to/build-your-rfi
  app.get(RFI_PATHS.GET_BUILD_RFI,
    [ AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    associatedViews.BUILD_RFI
  );
    
  app.get(RFI_PATHS.RFI_CHOOSE_YOUR_ROUTE_MARKET, AUTH, associatedViews.CHOOSE_YOUR_ROUTE_MARKET);

  //@GET /rfi/confirmation-review
  app.get(RFI_PATHS.GET_CONFIRMATION_REVIEW,
      [ AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
      associatedViews.CONFIRMATION_REVIEW
  );


//@GET '/eoi/project-budget'
app.get(
  RFI_PATHS.GET_RFI_CLOSE_EVENT,
  [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
  associatedViews.GET_RFI_CLOSE_EVENT,
);
  
  
  //@GET /rfi/choose-how-to/build-your-rfi
  app.get(RFI_PATHS.GET_BUILD_RFI, [ AUTH, AgreementDetailsFetchMiddleware.FetchAgreements], associatedViews.BUILD_RFI);

  /**
   *
   * @POST : POST Routes of RFI
   * @summary: provide all the respective associated view to the certain routes
   */

  //@POST '/rfi/choose-how-to/build-your-rfi
  app.post(RFI_PATHS.GET_BUILD_RFI, [ AUTH, AgreementDetailsFetchMiddleware.FetchAgreements], associatedViews.POST_BUILD_RFI);
  //@POST '/rfi/type
  app.post(RFI_PATHS.POST_TYPE_TYPE, AUTH, associatedViews.POST_TYPE);

  app.post(RFI_PATHS.RFI_POST_NEXT_STEPS, AUTH, associatedViews.RFI_POST_NEXT_STEPS);

  //@POST '/rfi/questionnaire'
  app.post(RFI_PATHS.POST_QUESTIONS_QUESTIONNAIRE, AUTH, associatedViews.POST_QUESTION);

  //@POST '/rfi/name'
  app.post(RFI_PATHS.POST_PROJECT_NAME, AUTH, associatedViews.POST_NAME_PROJECT);

  //@POST '/rfi/get-collaborator-detail'
  app.post(RFI_PATHS.POST_ADD_COLLABORATOR, AUTH, associatedViews.POST_ADD_COLLABORATOR);

  app.post(RFI_PATHS.PUT_LEAD_PROCUREMENT, AUTH, associatedViews.PUT_LEAD_PROCUREMENT);

  //@POST '/rfi/proceed-collaborators'
  app.post(RFI_PATHS.POST_PROCEED_COLLABORTORS, AUTH, associatedViews.POST_PROCEED_COLLABORATORS);

  //@POST '/rfi/get-collaborator-detail/js-enabled'
  app.post(RFI_PATHS.POST_ADD_COLLABORATOR_JSENABLED, AUTH, associatedViews.POST_ADD_COLLABORATOR_JSENABLED);

  //@POST '/rfi/add-collaborator-detail'
  app.post(RFI_PATHS.POST_ADD_COLLABORATOR_TO_JAGGER, AUTH, associatedViews.POST_ADD_COLLABORATOR_TO_JAGGER);

  app.get(RFI_PATHS.POST_DELETE_COLLABORATOR_TO_JAGGER, AUTH, associatedViews.POST_DELETE_COLLABORATOR_TO_JAGGER);

  //@POST "rfi/upload-doc"
  app.post(
    RFI_PATHS.POST_UPLOAD_DOC,
    [ AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    associatedViews.POST_UPLOAD_DOC,
  );

  //@POST "rfi/suppliers"
  app.post(RFI_PATHS.POST_RFI_SUPPLIER, AUTH, associatedViews.POST_RFI_SUPPLIER);

  //@POST "/rfi/response-date"
  app.post(RFI_PATHS.POST_RESPONSE_DATE, AUTH, associatedViews.POST_RESPONSE_DATE);

  //@POST /rfi/add/response-date
  app.post(
    RFI_PATHS.POST_ADD_RESPONSE_DATA,
    [ AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    associatedViews.POST_ADD_RESPONSE_DATE,
  );

  //@POST rfi/review
  app.post(RFI_PATHS.POST_RFI_REVIEW, AUTH, associatedViews.POST_RFI_REVIEW);

  //@POST /rfi/upload-doc/procceed
  app.post(RFI_PATHS.POST_UPLOAD_PROCEED, AUTH, associatedViews.POST_UPLOAD_PROCEED);
}

