import { AUTH } from '../../common/middlewares/oauthservice/authstatecheck';
import { REQUIREMENT_CONTROLLER } from './controller/index';
import { REQUIREMENT_PATHS } from './model/requirementConstants';
import { Application } from 'express';
import { ContentFetchMiddleware } from '../../common/middlewares/menu-contentservice/contentservice';
import { PreMarketEngagementMiddleware } from '../../common/middlewares/premarketservice/premarketengagement';
import { AgreementDetailsFetchMiddleware } from '../../common/middlewares/agreementservice/agreementdetailsfetch';

export default function (app: Application): void {
  // This is the reciever callback after getting the token
  app.get(
    REQUIREMENT_PATHS.CHOOSE_ROUTE,
    [ContentFetchMiddleware.FetchContents, AUTH],
    REQUIREMENT_CONTROLLER.REQUIREMENT_CHOOSE_ROUTE,
  );

  app.get(
    REQUIREMENT_PATHS.RFP_TYPE,
    [ContentFetchMiddleware.FetchContents, AUTH],
    REQUIREMENT_CONTROLLER.RFP_REQUIREMENT_TYPE,
  );

  app.get(
    REQUIREMENT_PATHS.RFP_REQUIREMENT_TASK_LIST,
    [
      ContentFetchMiddleware.FetchContents,
      AUTH,
      AgreementDetailsFetchMiddleware.FetchAgreements,
      PreMarketEngagementMiddleware.PutPremarket,
    ],
    REQUIREMENT_CONTROLLER.RFP_REQUIREMENT_TASK_LIST,
  );

  //@GET '/ca/task-list'
  app.get(
    REQUIREMENT_PATHS.CA_REQUIREMENT_TASK_LIST,
    [
      ContentFetchMiddleware.FetchContents,
      AUTH,
      PreMarketEngagementMiddleware.PutPremarket,
      AgreementDetailsFetchMiddleware.FetchAgreements,
    ],
    REQUIREMENT_CONTROLLER.CA_REQUIREMENT_TASK_LIST,
  );

  //@get '/ca/offline'
  app.get(
    REQUIREMENT_PATHS.CA_OFFLINE_JOURNEY_PAGE,
    [
      ContentFetchMiddleware.FetchContents,
      AUTH,
      AgreementDetailsFetchMiddleware.FetchAgreements,
      PreMarketEngagementMiddleware.PutPremarket,
    ],
    REQUIREMENT_CONTROLLER.CA_OFFLINE_JOURNEY_PAGE,
  );

  // @GET '/ca/learn-about-capability-assessment'
  app.get(
    REQUIREMENT_PATHS.CA_GET_LEARN,
    [
      ContentFetchMiddleware.FetchContents,
      AUTH,
      PreMarketEngagementMiddleware.PutPremarket,
      AgreementDetailsFetchMiddleware.FetchAgreements,
    ],
    REQUIREMENT_CONTROLLER.CA_GET_LEARN,
  );

  // @GET '/ca/learnabout-capability-assessment'
  app.get(
    REQUIREMENT_PATHS.GET_LEARN,
    [
      ContentFetchMiddleware.FetchContents,
      AUTH,
      PreMarketEngagementMiddleware.PutPremarket,
      AgreementDetailsFetchMiddleware.FetchAgreements,
    ],
    REQUIREMENT_CONTROLLER.GET_LEARN,
  );

  // @GET '/ca/enter-your-weightings'
  app.get(
    REQUIREMENT_PATHS.CA_GET_WEIGHTINGS,
    [
      ContentFetchMiddleware.FetchContents,
      AUTH,
      PreMarketEngagementMiddleware.PutPremarket,
      AgreementDetailsFetchMiddleware.FetchAgreements,
    ],
    REQUIREMENT_CONTROLLER.CA_GET_WEIGHTINGS,
  );

  // @GET '/ca/suppliers-to-forward
  app.get(
    REQUIREMENT_PATHS.CA_GET_SUPPLIERS_FORWARD,
    [
      ContentFetchMiddleware.FetchContents,
      AUTH,
      PreMarketEngagementMiddleware.PutPremarket,
      AgreementDetailsFetchMiddleware.FetchAgreements,
    ],
    REQUIREMENT_CONTROLLER.CA_GET_SUPPLIERS_FORWARD,
  );

  // @GET '/ca/next-steps'
  app.get(
    REQUIREMENT_PATHS.CA_GET_NEXTSTEPS,
    [
      ContentFetchMiddleware.FetchContents,
      AUTH,
      PreMarketEngagementMiddleware.PutPremarket,
      AgreementDetailsFetchMiddleware.FetchAgreements,
    ],
    REQUIREMENT_CONTROLLER.CA_GET_NEXTSTEPS,
  );

  // @GET '/da/next-steps'
  app.get(
    REQUIREMENT_PATHS.DA_GET_NEXTSTEPS,
    [
      ContentFetchMiddleware.FetchContents,
      AUTH,
      PreMarketEngagementMiddleware.PutPremarket,
      AgreementDetailsFetchMiddleware.FetchAgreements,
    ],
    REQUIREMENT_CONTROLLER.DA_GET_NEXTSTEPS,
  );

  app.get(
    REQUIREMENT_PATHS.RFP_GET_NAME_PROJECT,
    [ContentFetchMiddleware.FetchContents, AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_GET_NAME_PROJECT,
  );

  //@Get '/ca/type'
  app.get(
    REQUIREMENT_PATHS.CA_TYPE,
    [ContentFetchMiddleware.FetchContents, AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.CA_REQUIREMENT_TYPE,
  );

  app.get(
    REQUIREMENT_PATHS.CA_GET_NAME_PROJECT,
    [ContentFetchMiddleware.FetchContents, AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.CA_GET_NAME_PROJECT,
  );

  //@GET '/rfp/add-collaborators'
  app.get(
    REQUIREMENT_PATHS.RFP_GET_ADD_COLLABORATOR,
    [ContentFetchMiddleware.FetchContents, AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_GET_ADD_COLLABORATOR,
  );

  //@GET '/ca/add-collaborators'
  app.get(
    REQUIREMENT_PATHS.CA_GET_ADD_COLLABORATOR,
    [ContentFetchMiddleware.FetchContents, AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.CA_GET_ADD_COLLABORATOR,
  );

  //@GET '/rfp/procurement-lead'
  app.get(
    REQUIREMENT_PATHS.RFP_GET_LEAD_PROCUREMENT,
    [ContentFetchMiddleware.FetchContents, AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_GET_LEAD_PROCUREMENT,
  );

  //@GET '/ca/procurement-lead'
  app.get(
    REQUIREMENT_PATHS.CA_GET_LEAD_PROCUREMENT,
    [ContentFetchMiddleware.FetchContents, AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.CA_GET_LEAD_PROCUREMENT,
  );

  app.get(
    REQUIREMENT_PATHS.RFP_GET_UPLOAD_DOC,
    [ContentFetchMiddleware.FetchContents, AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_GET_UPLOAD_DOC,
  );
  app.get(
    REQUIREMENT_PATHS.CA_GET_UPLOAD_DOC,
    [ContentFetchMiddleware.FetchContents, AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.CA_GET_UPLOAD_DOC,
  );

  app.get(REQUIREMENT_PATHS.RFP_GET_USER_PROCUREMENT, [AUTH], REQUIREMENT_CONTROLLER.RFP_GET_USER_PROCUREMENT);

  app.get(REQUIREMENT_PATHS.CA_GET_USER_PROCUREMENT, [AUTH], REQUIREMENT_CONTROLLER.CA_GET_USER_PROCUREMENT);

  app.get(REQUIREMENT_PATHS.RFP_OFFLINE_JOURNEY_PAGE, [AUTH], REQUIREMENT_CONTROLLER.RFP_OFFLINE_JOURNEY_PAGE);

  // /rfp/add-context
  app.get(
    REQUIREMENT_PATHS.RFP_ADD_CONTEXT,
    [ContentFetchMiddleware.FetchContents, AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_GET_ADD_CONTEXT,
  );


    // /rfp/response-date
    app.get(
      REQUIREMENT_PATHS.RFP_GET_RESPONSE_DATE,
      [ContentFetchMiddleware.FetchContents, AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
      REQUIREMENT_CONTROLLER.GET_RESPONSE_DATE
    );




  // /rfp/questions
  app.get(
    REQUIREMENT_PATHS.RFP_GET_QUESTIONS,
    [ContentFetchMiddleware.FetchContents, AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_GET_QUESTIONS,
  );

  // /rfp/IR35
  app.get(
    REQUIREMENT_PATHS.RFP_GET_IR35,
    [ContentFetchMiddleware.FetchContents, AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_GET_I35,
  );

  app.get(
    REQUIREMENT_PATHS.DA_GET_WHERE_WORK_DONE,
    [ContentFetchMiddleware.FetchContents, AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.DA_GET_WHERE_WORK_DONE,
  );

  // /ca/team-scale
  app.get(
    REQUIREMENT_PATHS.DA_GET_TEAM_SCALE,
    [ContentFetchMiddleware.FetchContents, AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.DA_GET_TEAM_SCALE,
  );

  // @GET "/rfp/suppliers"
  app.get(
    REQUIREMENT_PATHS.GET_RFP_SUPPLIERS,
    [ContentFetchMiddleware.FetchContents, AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.GET_RFP_SUPPLIERS,
  );

  /**
   * @POST Routes
   */

  app.post(
    REQUIREMENT_PATHS.POST_ROUTE,
    [ContentFetchMiddleware.FetchContents, AUTH],
    REQUIREMENT_CONTROLLER.POST_REQUIREMENT_CHOOSE_ROUTE,
  );

  app.post(
    REQUIREMENT_PATHS.RFP_POST_TYPE,
    [ContentFetchMiddleware.FetchContents, AUTH],
    REQUIREMENT_CONTROLLER.RFP_POST_TYPE,
  );

  //@POST '/rfp/name'
  app.post(REQUIREMENT_PATHS.RFP_POST_NAME_PROJECT, AUTH, REQUIREMENT_CONTROLLER.RFP_POST_NAME_PROJECT);

  //@POST '/ca/name'
  app.post(REQUIREMENT_PATHS.CA_POST_PROJECT_NAME, AUTH, REQUIREMENT_CONTROLLER.CA_POST_NAME_PROJECT);

  //@POST '/rfp/get-collaborator-detail'
  app.post(REQUIREMENT_PATHS.RFP_POST_ADD_COLLABORATOR, AUTH, REQUIREMENT_CONTROLLER.RFP_POST_ADD_COLLABORATOR);

  //@POST '/ca/get-collaborator-detail'
  app.post(REQUIREMENT_PATHS.CA_POST_ADD_COLLABORATOR, AUTH, REQUIREMENT_CONTROLLER.CA_POST_ADD_COLLABORATOR);

  app.post(REQUIREMENT_PATHS.CA_PUT_LEAD_PROCUREMENT, AUTH, REQUIREMENT_CONTROLLER.CA_PUT_LEAD_PROCUREMENT);

  app.post(REQUIREMENT_PATHS.RFP_PUT_LEAD_PROCUREMENT, AUTH, REQUIREMENT_CONTROLLER.RFP_PUT_LEAD_PROCUREMENT);

  //@POST '/rfp/proceed-collaborators'
  app.post(
    REQUIREMENT_PATHS.RFP_POST_PROCEED_COLLABORATORS,
    AUTH,
    REQUIREMENT_CONTROLLER.RFP_POST_PROCEED_COLLABORATORS,
  );

  //@POST '/ca/proceed-collaborators'
  app.post(REQUIREMENT_PATHS.CA_POST_PROCEED_COLLABORATORS, AUTH, REQUIREMENT_CONTROLLER.CA_POST_PROCEED_COLLABORATORS);

  //@POST '/rfp/get-collaborator-detail/js-enabled'
  app.post(
    REQUIREMENT_PATHS.RFP_POST_ADD_COLLABORATOR_JSENABLED,
    AUTH,
    REQUIREMENT_CONTROLLER.RFP_POST_ADD_COLLABORATOR_JSENABLED,
  );

  //@POST '/ca/get-collaborator-detail/js-enabled'
  app.post(
    REQUIREMENT_PATHS.CA_POST_ADD_COLLABORATOR_JSENABLED,
    AUTH,
    REQUIREMENT_CONTROLLER.CA_POST_ADD_COLLABORATOR_JSENABLED,
  );

  //@POST '/rfp/add-collaborator-detail'
  app.post(
    REQUIREMENT_PATHS.RFP_POST_ADD_COLLABORATOR_TO_JAGGER,
    AUTH,
    REQUIREMENT_CONTROLLER.RFP_POST_ADD_COLLABORATOR_TO_JAGGER,
  );

  //@POST '/ca/add-collaborator-detail'
  app.post(
    REQUIREMENT_PATHS.CA_POST_ADD_COLLABORATOR_TO_JAGGER,
    AUTH,
    REQUIREMENT_CONTROLLER.CA_POST_ADD_COLLABORATOR_TO_JAGGER,
  );

  app.post(REQUIREMENT_PATHS.RFP_POST_UPLOAD_DOC, AUTH, REQUIREMENT_CONTROLLER.RFP_POST_UPLOAD_DOC);

  app.post(REQUIREMENT_PATHS.CA_POST_UPLOAD_DOC, AUTH, REQUIREMENT_CONTROLLER.CA_POST_UPLOAD_DOC);

  app.post(REQUIREMENT_PATHS.CA_POST_UPLOAD_PROCEED, AUTH, REQUIREMENT_CONTROLLER.CA_POST_UPLOAD_PROCEED);

  app.post(REQUIREMENT_PATHS.RFP_POST_UPLOAD_PROCEED, AUTH, REQUIREMENT_CONTROLLER.RFP_POST_UPLOAD_PROCEED);

  //@POST '/ca/learn-about-capability-assessment'
  app.post(REQUIREMENT_PATHS.CA_POST_LEARN, AUTH, REQUIREMENT_CONTROLLER.POST_LEARN);

  //@POST '/ca/learnabout-capability-assessment'
  app.post(REQUIREMENT_PATHS.POST_LEARN, AUTH, REQUIREMENT_CONTROLLER.POST_LEARN);

  app.post(REQUIREMENT_PATHS.RFP_POST_QUESTIONS, [AUTH], REQUIREMENT_CONTROLLER.RFP_POST_QUESTION);

  //@POST '/ca/suppliers-to-forward'
  app.post(REQUIREMENT_PATHS.CA_POST_SUPPLIERS_FORWARD, AUTH, REQUIREMENT_CONTROLLER.CA_POST_SUPPLIERS_FORWARD);

  //@POST '/ca/next-steps'
  app.post(REQUIREMENT_PATHS.CA_POST_NEXTSTEPS, AUTH, REQUIREMENT_CONTROLLER.CA_POST_NEXTSTEPS);

  //@POST '/da/next-steps'
  app.post(REQUIREMENT_PATHS.DA_POST_NEXTSTEPS, AUTH, REQUIREMENT_CONTROLLER.DA_POST_NEXTSTEPS);

  // /rfp/IR35
  app.post(REQUIREMENT_PATHS.RFP_POST_IR35, [AUTH], REQUIREMENT_CONTROLLER.RFP_POST_I35);

  // /ca/type
  app.post(REQUIREMENT_PATHS.CA_POST_TYPE, [AUTH], REQUIREMENT_CONTROLLER.CA_POST_TYPE);
  //@POST '/ca/team-scale'
  app.post(REQUIREMENT_PATHS.DA_POST_TEAM_SCALE, AUTH, REQUIREMENT_CONTROLLER.DA_POST_TEAM_SCALE);

  app.post(REQUIREMENT_PATHS.CA_POST_TYPE, [AUTH], REQUIREMENT_CONTROLLER.CA_POST_TYPE);
  app.post(REQUIREMENT_PATHS.DA_POST_WHERE_WORK_DONE, [AUTH], REQUIREMENT_CONTROLLER.DA_POST_WHERE_WORK_DONE);

  app.post(
    REQUIREMENT_PATHS.DA_POST_TYPE,
    [ContentFetchMiddleware.FetchContents, AUTH],
    REQUIREMENT_CONTROLLER.DA_POST_TYPE,
  );

  app.get(
    REQUIREMENT_PATHS.DA_TYPE,
    [ContentFetchMiddleware.FetchContents, AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.DA_REQUIREMENT_TYPE,
  );

  app.get(
    REQUIREMENT_PATHS.DA_REQUIREMENT_TASK_LIST,
    [
      ContentFetchMiddleware.FetchContents,
      AUTH,
      AgreementDetailsFetchMiddleware.FetchAgreements,
      PreMarketEngagementMiddleware.PutPremarket,
    ],
    REQUIREMENT_CONTROLLER.DA_REQUIREMENT_TASK_LIST,
  );

  app.get(
    REQUIREMENT_PATHS.DA_OFFLINE_JOURNEY_PAGE,
    [
      ContentFetchMiddleware.FetchContents,
      AUTH,
      AgreementDetailsFetchMiddleware.FetchAgreements,
      PreMarketEngagementMiddleware.PutPremarket,
    ],
    REQUIREMENT_CONTROLLER.DA_OFFLINE_JOURNEY_PAGE,
  );

  //@POST '/ca/team-scale'
  app.post(REQUIREMENT_PATHS.DA_POST_TEAM_SCALE, AUTH, REQUIREMENT_CONTROLLER.DA_POST_TEAM_SCALE);

  //@POST "rfp/suppliers"
  app.post(REQUIREMENT_PATHS.POST_RFP_SUPPLIER, AUTH, REQUIREMENT_CONTROLLER.POST_RFP_SUPPLIERS);
}
