import { Application } from 'express';
import { EOI_PATHS } from './model/eoiconstant';
import { associatedViews } from './controller/index';
import * as apisource from '../../resources/content/eoi/template.json';
import { AgreementDetailsFetchMiddleware } from '../../common/middlewares/agreementservice/agreementDetailsFetch';
import { AUTH } from '../../common/middlewares/oauthservice/authstatecheck';
import { PreMarketEngagementMiddleware } from '../../common/middlewares/premarketservice/premarketengagement';

export default function (app: Application): void {
  /**
   *
   * @GET : Get Routes of EOI
   * @summary: provide all the respective associated view to the certain routes
   */
  // @GET '/eoi/eoi-task-list'
  app.get(
    EOI_PATHS.GET_TASKLIST,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements, PreMarketEngagementMiddleware.PutPremarket],
    associatedViews.GET_TASKLIST
  );

  //  @GET '/eoi/type'
  app.get(EOI_PATHS.GET_TYPE, [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements], associatedViews.GET_TYPE);

  //  @GET '/eoi/online-task-list'
  app.get(
    EOI_PATHS.GET_ONLINE_TASKLIST,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    associatedViews.GET_ONLINE_TASKLIST
  );

  //  @GET '/eoi/questions'
  app.get(
    EOI_PATHS.GET_QUESTIONS,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    associatedViews.GET_QUESTIONS
  );
  //@GET "/eoi/response-date"
  app.get(
    EOI_PATHS.GET_RESPONSE_DATE,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    associatedViews.GET_RESPONSE_DATE
  );

  //  @GET '/eoi/upload-doc'
  app.get(
    EOI_PATHS.GET_UPLOAD_DOC,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    associatedViews.GET_UPLOAD_DOC
  );

  //@GET name your projects

  app.get(
    EOI_PATHS.GET_NAME_YOUR_PROJECT,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    associatedViews.GET_NAME_PROJECT
  );

  //@GET '/eoi/add-collaborators'
  app.get(
    EOI_PATHS.GET_ADD_COLLABORATOR,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    associatedViews.GET_ADD_COLLABORATOR
  );

  //@GET '/eoi/procurement-lead'
  app.get(
    EOI_PATHS.GET_LEAD_PROCUEMENT,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    associatedViews.GET_LEAD_PROCUREMENT
  );

  app.get(EOI_PATHS.GET_USER_PROCUREMENT, [AUTH], associatedViews.GET_USER_PROCUREMENT);

  //@GET "/eoi/upload-doc/remove"
  app.get(EOI_PATHS.GET_REMOVE_FILE, AUTH, associatedViews.GET_REMOVE_FILES);

  // @GET "/eoi/suppliers"
  app.get(
    EOI_PATHS.GET_EOI_SUPPLIERS,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    associatedViews.GET_EOI_SUPPLIERS
  );

  //@GET '/eoi/review'
  app.get(
    EOI_PATHS.GET_EOI_REVIEW,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    associatedViews.GET_EOI_REVIEW
  );

  //@GET '/eoi/project-objective'
  app.get(
    EOI_PATHS.GET_EOI_PROJECT_OBJECTIVE,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    associatedViews.GET_EOI_PROJECT_OBJECTIVE
  );

  //@GET '/eoi/project-scope'
  app.get(
    EOI_PATHS.GET_EOI_PROJECT_SCOPE,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    associatedViews.GET_EOI_PROJECT_SCOPE
  );

  //@GET '/eoi/choose-type'
  app.get(
    EOI_PATHS.GET_EOI_CHOOSE_TYPE,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    associatedViews.GET_EOI_CHOOSE_TYPE
  );

  //@GET '/eoi/existing-supplier'
  app.get(
    EOI_PATHS.GET_EOI_EXISTING_SUPPLIER,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    associatedViews.GET_EOI_EXISTING_SUPPLIER
  );

  app.get(
    EOI_PATHS.GET_CONFIRMATION_REVIEW,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    associatedViews.GET_CONFIRMATION_REVIEW
  );

  //@GET '/eoi/special-terms'
  app.get(
    EOI_PATHS.GET_EOI_SPECIAL_TERMS,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    associatedViews.GET_EOI_SPECIAL_TERMS
  );

  //@GET '/eoi/project-duration'
  app.get(
    EOI_PATHS.GET_EOI_PROJECT_DURATION,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    associatedViews.GET_EOI_PROJECT_DURATION
  );

  //@GET '/eoi/project-budget'
  app.get(
    EOI_PATHS.GET_EOI_PROJECT_BUDGET,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    associatedViews.GET_EOI_PROJECT_BUDGET
  );

  /**
   *
   * @POST : POST Routes of EOI
   * @summary: provide all the respective associated view to the certain routes
   */

  // api
  app.get('/api/template', (req, res) => res.json(apisource));

  //@POST '/eoi/type
  app.post(EOI_PATHS.POST_TYPE_TYPE, AUTH, associatedViews.POST_TYPE);

  //@POST '/eoi/questionnaire'
  app.post(EOI_PATHS.POST_QUESTIONS_QUESTIONNAIRE, AUTH, associatedViews.POST_QUESTION);

  //@POST '/eoi/name'
  app.post(EOI_PATHS.POST_PROJECT_NAME, AUTH, associatedViews.POST_NAME_PROJECT);

  //@POST '/eoi/get-collaborator-detail'
  app.post(EOI_PATHS.POST_ADD_COLLABORATOR, AUTH, associatedViews.POST_ADD_COLLABORATOR);

  app.post(EOI_PATHS.PUT_LEAD_PROCUREMENT, AUTH, associatedViews.PUT_LEAD_PROCUREMENT);

  //@POST '/eoi/proceed-collaborators'
  app.post(EOI_PATHS.POST_PROCEED_COLLABORTORS, AUTH, associatedViews.POST_PROCEED_COLLABORATORS);

  //@POST '/eoi/get-collaborator-detail/js-enabled'
  app.post(EOI_PATHS.POST_ADD_COLLABORATOR_JSENABLED, AUTH, associatedViews.POST_ADD_COLLABORATOR_JSENABLED);

  //@POST '/eoi/add-collaborator-detail'
  app.post(EOI_PATHS.POST_ADD_COLLABORATOR_TO_JAGGER, AUTH, associatedViews.POST_ADD_COLLABORATOR_TO_JAGGER);

  //@DELETE '/eoi/delete-collaborator-detail'
  app.get(EOI_PATHS.GET_DELETE_COLLABORATOR_TO_JAGGER, AUTH, associatedViews.GET_DELETE_COLLABORATOR_TO_JAGGER);

  //@POST "/eoi/response-date"
  app.post(EOI_PATHS.POST_RESPONSE_DATE, AUTH, associatedViews.POST_RESPONSE_DATE);

  //@POST /eoi/add/response-date
  app.post(EOI_PATHS.POST_ADD_RESPONSE_DATA, AUTH, associatedViews.POST_ADD_RESPONSE_DATE);
  //@POST "eoi/upload-doc"
  app.post(EOI_PATHS.POST_UPLOAD_DOC, AUTH, associatedViews.POST_UPLOAD_DOC);

  //@POST '/eoi/review'
  app.post(EOI_PATHS.POST_EOI_REVIEW, AUTH, associatedViews.POST_EOI_REVIEW);

  app.post(EOI_PATHS.POST_UPLOAD_PROCEED, AUTH, associatedViews.POST_UPLOAD_PROCEED);

  //@POST "eoi/suppliers"
  app.post(EOI_PATHS.POST_EOI_SUPPLIER, AUTH, associatedViews.POST_EOI_SUPPLIERS);

  // Offline page
  app.get(EOI_PATHS.GET_OFFLINE, AUTH, associatedViews.OFFLINE_JOURNEY_PAGE);

  // Publish summary page
  app.get(EOI_PATHS.GET_EVENT_PUBLISHED, AUTH, associatedViews.GET_EVENT_PUBLISHED);

  //@POST '/eoi/project-objective'
  app.post(EOI_PATHS.POST_EOI_PROJECT_OBJECTIVE, AUTH, associatedViews.POST_EOI_PROJECT_OBJECTIVE);

  //@POST '/eoi/project-scopr'
  app.post(EOI_PATHS.POST_EOI_PROJECT_SCOPE, AUTH, associatedViews.POST_EOI_PROJECT_SCOPE);

  //@post '/eoi/choose-type'
  app.post(EOI_PATHS.POST_EOI_CHOOSE_TYPE, AUTH, associatedViews.POST_EOI_CHOOSE_TYPE);

  //@post '/eoi/special-terms'
  app.post(EOI_PATHS.POST_EOI_SPECIAL_TERMS, AUTH, associatedViews.POST_EOI_SPECIAL_TERMS);
  app.post(EOI_PATHS.POST_EOI_EXISTING_SUPPLIER, AUTH, associatedViews.POST_EOI_EXISTING_SUPPLIER);
}
