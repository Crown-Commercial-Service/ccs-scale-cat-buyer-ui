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

  app.get(
    REQUIREMENT_PATHS.RFP_GET_NAME_PROJECT,
    [ContentFetchMiddleware.FetchContents, AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_GET_NAME_PROJECT,
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

  // /rfp/questions
  app.get(
    REQUIREMENT_PATHS.RFP_GET_QUESTIONS,
    [ContentFetchMiddleware.FetchContents, AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_GET_QUESTIONS,
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
  app.post(REQUIREMENT_PATHS.CA_POST_LEARN, AUTH, REQUIREMENT_CONTROLLER.CA_POST_LEARN);
  app.post(REQUIREMENT_PATHS.RFP_POST_QUESTIONS, [AUTH], REQUIREMENT_CONTROLLER.RFP_POST_QUESTION);
}
