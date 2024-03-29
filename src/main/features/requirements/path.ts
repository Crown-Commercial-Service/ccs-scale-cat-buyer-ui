import { AUTH } from '../../common/middlewares/oauthservice/authstatecheck';
import { REQUIREMENT_CONTROLLER } from './controller/index';
import { REQUIREMENT_PATHS } from './model/requirementConstants';
import { Application } from 'express';
import { PreMarketEngagementMiddleware } from '../../common/middlewares/premarketservice/premarketengagement';
import { AgreementDetailsFetchMiddleware } from '../../common/middlewares/agreementservice/agreementDetailsFetch';
//import * as express from 'express';

export default function (app: Application): void {
  // This is the reciever callback after getting the token
  app.get(REQUIREMENT_PATHS.CHOOSE_ROUTE, [AUTH], REQUIREMENT_CONTROLLER.REQUIREMENT_CHOOSE_ROUTE);

  app.get(REQUIREMENT_PATHS.RFP_TYPE, [AUTH], REQUIREMENT_CONTROLLER.RFP_REQUIREMENT_TYPE);

  app.get(
    REQUIREMENT_PATHS.RFP_REQUIREMENT_TASK_LIST,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements, PreMarketEngagementMiddleware.PutPremarket],
    REQUIREMENT_CONTROLLER.RFP_REQUIREMENT_TASK_LIST
  );

  //DOS6
  app.get(
    REQUIREMENT_PATHS.DOS6_STAGE2_TASK_LIST,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements, PreMarketEngagementMiddleware.PutPremarket],
    REQUIREMENT_CONTROLLER.DOS6_STAGE2_TASK_LIST
  );

  //@GET '/ca/task-list'
  app.get(
    REQUIREMENT_PATHS.CA_REQUIREMENT_TASK_LIST,
    [AUTH, PreMarketEngagementMiddleware.PutPremarket, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.CA_REQUIREMENT_TASK_LIST
  );

  //@get '/ca/offline'
  app.get(
    REQUIREMENT_PATHS.CA_OFFLINE_JOURNEY_PAGE,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements, PreMarketEngagementMiddleware.PutPremarket],
    REQUIREMENT_CONTROLLER.CA_OFFLINE_JOURNEY_PAGE
  );

  // @GET '/ca/learn-about-capability-assessment'
  app.get(
    REQUIREMENT_PATHS.CA_GET_LEARN,
    [AUTH, PreMarketEngagementMiddleware.PutPremarket, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.CA_GET_LEARN
  );

  // @GET '/da/learn-about-capability-assessment'
  app.get(
    REQUIREMENT_PATHS.DA_GET_LEARN,
    [AUTH, PreMarketEngagementMiddleware.PutPremarket, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.DA_GET_LEARN
  );

  // @GET '/ca/learnabout-capability-assessment'
  app.get(REQUIREMENT_PATHS.GET_LEARN, [AUTH], REQUIREMENT_CONTROLLER.GET_LEARN);

  // @GET '/ca/enter-your-weightings'
  app.get(
    REQUIREMENT_PATHS.CA_GET_WEIGHTINGS,
    [AUTH, PreMarketEngagementMiddleware.PutPremarket, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.CA_GET_WEIGHTINGS
  );

  // @GET '/rfp/enter-your-weightings'
  app.get(
    REQUIREMENT_PATHS.RFP_GET_WEIGHTINGS,
    [AUTH, PreMarketEngagementMiddleware.PutPremarket, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_GET_WEIGHTINGS
  );

  // @GET '/ca/suppliers-to-forward
  app.get(
    REQUIREMENT_PATHS.CA_GET_SUPPLIERS_FORWARD,
    [AUTH, PreMarketEngagementMiddleware.PutPremarket, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.CA_GET_SUPPLIERS_FORWARD
  );

  // @GET '/ca/suppliers-to-forward
  app.get(
    REQUIREMENT_PATHS.CA_GET_SUBCONTRACTORS,
    [AUTH, PreMarketEngagementMiddleware.PutPremarket, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.CA_GET_SUBCONTRACTORS
  );

  // @GET '/ca/next-steps'
  app.get(
    REQUIREMENT_PATHS.CA_GET_NEXTSTEPS,
    [AUTH, PreMarketEngagementMiddleware.PutPremarket, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.CA_GET_NEXTSTEPS
  );

  // @GET '/da/next-steps'
  app.get(
    REQUIREMENT_PATHS.DA_GET_NEXTSTEPS,
    [AUTH, PreMarketEngagementMiddleware.PutPremarket, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.DA_GET_NEXTSTEPS
  );
  // @GET '/ca/enter-your-weightings'
  app.get(
    REQUIREMENT_PATHS.DA_GET_WEIGHTINGS,
    [AUTH, PreMarketEngagementMiddleware.PutPremarket, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.DA_GET_WEIGHTINGS
  );
  app.get(
    REQUIREMENT_PATHS.RFP_GET_NAME_PROJECT,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_GET_NAME_PROJECT
  );

  app.get(
    REQUIREMENT_PATHS.RFP_POST_RETAIN_SESSION,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_POST_RETAIN_SESSION
  );

  app.get(
    REQUIREMENT_PATHS.RFP_GET_ADDITIONAL_SERVICES,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_GET_ADDITIONAL_SERVICES
  );

  app.get(
    REQUIREMENT_PATHS.RFP_GET_CONFIRMATION_REVIEW,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_GET_CONFIRMATION_REVIEW
  );

  app.get(
    REQUIREMENT_PATHS.PUBLISH_DATE_MISMATCH,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.PUBLISH_DATE_MISMATCH
  );

  app.get(
    REQUIREMENT_PATHS.PUBLISH_DATE_MISMATCH_CANCEL,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.PUBLISH_DATE_MISMATCH_CANCEL
  );

  app.get(
    REQUIREMENT_PATHS.RFP_GET_SELECTED_SERVICE,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_GET_SELECTED_SERVICE
  );

  //@Get '/ca/type'
  app.get(
    REQUIREMENT_PATHS.CA_TYPE,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.CA_REQUIREMENT_TYPE
  );
  app.get(
    REQUIREMENT_PATHS.CA_GET_CHOOSE_REQUIREMENTS,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.CA_GET_CHOOSE_SECURITY_REQUIREMENTS
  );
  app.get(
    REQUIREMENT_PATHS.CA_GET_NAME_PROJECT,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.CA_GET_NAME_PROJECT
  );

  app.get(
    REQUIREMENT_PATHS.CA_GET_LEARN_ASSESSMENT_BASES,
    [AUTH, PreMarketEngagementMiddleware.PutPremarket, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.CA_GET_LEARN_ASSESSMENT_BASES
  );

  //@GET '/rfp/add-collaborators'
  app.get(
    REQUIREMENT_PATHS.RFP_GET_ADD_COLLABORATOR,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_GET_ADD_COLLABORATOR
  );

  //@GET '/ca/add-collaborators'
  app.get(
    REQUIREMENT_PATHS.CA_GET_ADD_COLLABORATOR,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.CA_GET_ADD_COLLABORATOR
  );

  //@GET '/rfp/procurement-lead'
  app.get(
    REQUIREMENT_PATHS.RFP_GET_LEAD_PROCUREMENT,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_GET_LEAD_PROCUREMENT
  );

  //@GET '/ca/procurement-lead'
  app.get(
    REQUIREMENT_PATHS.CA_GET_LEAD_PROCUREMENT,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.CA_GET_LEAD_PROCUREMENT
  );

  //@GET '/rfp/upload'
  app.get(
    REQUIREMENT_PATHS.RFP_UPLOAD,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_UPLOAD
  );

  //@GET '/rfp/upload-attachment'
  app.get(
    REQUIREMENT_PATHS.RFP_GET_UPLOAD_ATTACHMENT,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_GET_UPLOAD_ATTACHMENT
  );

  //@GET '/rfp/upload-doc'
  app.get(
    REQUIREMENT_PATHS.RFP_GET_UPLOAD_DOC,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_GET_UPLOAD_DOC
  );
  app.get(
    REQUIREMENT_PATHS.CA_GET_UPLOAD_DOC,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.CA_GET_UPLOAD_DOC
  );

  app.get(REQUIREMENT_PATHS.RFP_GET_USER_PROCUREMENT, [AUTH], REQUIREMENT_CONTROLLER.RFP_GET_USER_PROCUREMENT);

  app.get(REQUIREMENT_PATHS.CA_GET_USER_PROCUREMENT, [AUTH], REQUIREMENT_CONTROLLER.CA_GET_USER_PROCUREMENT);
  app.get(REQUIREMENT_PATHS.DA_GET_USER_PROCUREMENT_REQUIRE, [AUTH], REQUIREMENT_CONTROLLER.DA_GET_USER_PROCUREMENT);

  app.get(
    REQUIREMENT_PATHS.CA_GET_REVIEW_RANKED_SUPPLIERS,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.CA_GET_REVIEW_RANKED_SUPPLIERS
  );

  app.get(REQUIREMENT_PATHS.RFP_OFFLINE_JOURNEY_PAGE, [AUTH], REQUIREMENT_CONTROLLER.RFP_OFFLINE_JOURNEY_PAGE);

  // /rfp/add-context
  app.get(
    REQUIREMENT_PATHS.RFP_ADD_CONTEXT,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_GET_ADD_CONTEXT
  );

  // /rfp/your-assessment
  app.get(
    REQUIREMENT_PATHS.RFP_YOUR_ASSESSMENT,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_GET_YOUR_ASSESSTMENT
  );
  //rfp/your-assessment-question -GET
  app.get(
    REQUIREMENT_PATHS.RFP_GET_YOUR_ASSESSMENT_QUESTION,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_Assesstment_GET_QUESTIONS
  );
  ///rfp/your-assessment-question -POST
  app.post(
    REQUIREMENT_PATHS.RFP_POST_YOUR_ASSESSMENT_QUESTION,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_Assesstment_POST_QUESTION
  );
  // /rfp/set-scoring-criteria
  app.get(
    REQUIREMENT_PATHS.RFP_GET_SCORING_CRITERIA,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_GET_SCORING_CRITERIA
  );

  // /rfp/response-date
  app.get(
    REQUIREMENT_PATHS.RFP_GET_RESPONSE_DATE,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_GET_RESPONSE_DATE //test
  );

  // /rfp/questions
  app.get(
    REQUIREMENT_PATHS.RFP_GET_QUESTIONS,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_GET_QUESTIONS
  );

  // /rfp/IR35
  app.get(
    REQUIREMENT_PATHS.RFP_GET_IR35,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_GET_I35
  );

  app.get(
    REQUIREMENT_PATHS.CA_GET_WHERE_WORK_DONE,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.CA_GET_WHERE_WORK_DONE
  );

  app.get(
    REQUIREMENT_PATHS.DA_GET_WHERE_WORK_DONE,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.DA_GET_WHERE_WORK_DONE
  );

  app.get(
    REQUIREMENT_PATHS.RFP_GET_WHERE_WORK_DONE,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_GET_WHERE_WORK_DONE
  );
  // @GET /ca/team-scale
  app.get(
    REQUIREMENT_PATHS.CA_GET_TEAM_SCALE,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.CA_GET_TEAM_SCALE
  );

  // @GET /da/team-scale
  app.get(
    REQUIREMENT_PATHS.DA_GET_TEAM_SCALE,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.DA_GET_TEAM_SCALE
  );

  // @GET "/rfp/suppliers"
  app.get(
    REQUIREMENT_PATHS.GET_RFP_SUPPLIERS,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.GET_RFP_SUPPLIERS
  );
  // @GET "/fc/suppliers/ratecard"
  app.get(
    REQUIREMENT_PATHS.RFP_SUPPLIER_RATECARD,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_SUPPLIER_RATECARD
  );
  // /ca/resources-vetting-weightings
  app.get(
    REQUIREMENT_PATHS.CA_GET_RESOURCES_VETTING_WEIGHTINGS,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.CA_GET_RESOURCES_VETTING_WEIGHTINGS
  );
  // /da/resources-vetting-weightings
  app.get(
    REQUIREMENT_PATHS.DA_GET_RESOURCES_VETTING_WEIGHTINGS,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.DA_GET_RESOURCES_VETTING_WEIGHTINGS
  );

  app.get(
    REQUIREMENT_PATHS.CA_GET_SERVICE_CAPABILITIES,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.CA_GET_SERVICE_CAPABILITIES
  );
  app.get(
    REQUIREMENT_PATHS.CA_GET_CANCEL,
    [AUTH, PreMarketEngagementMiddleware.PutPremarket, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.CA_GET_CANCEL
  );
  // @GET '/da/cancel'
  app.get(
    REQUIREMENT_PATHS.DA_GET_CANCEL,
    [AUTH, PreMarketEngagementMiddleware.PutPremarket, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.DA_GET_CANCEL
  );

  //da subcontractors
  app.get(
    REQUIREMENT_PATHS.DA_GET_SUBCONTRACTORS,
    [AUTH, PreMarketEngagementMiddleware.PutPremarket, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.DA_GET_SUBCONTRACTORS
  );
  app.get(
    REQUIREMENT_PATHS.DA_GET_REVIEW_RANKED_SUPPLIERS,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.DA_GET_REVIEW_RANKED_SUPPLIERS
  );
  //da service capabilities
  app.get(
    REQUIREMENT_PATHS.DA_GET_SERVICE_CAPABILITIES,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.DA_GET_SERVICE_CAPABILITIES
  );

  // /rfp/vetting-weighting
  app.get(
    REQUIREMENT_PATHS.RFP_GET_VETTING_AND_WEIGHTING,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_GET_VETTING_AND_WEIGHTING
  );

  app.get(
    REQUIREMENT_PATHS.DA_GET_LEARN_START,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.DA_GET_LEARN_START
  );

  app.get(
    REQUIREMENT_PATHS.RFP_GET_CHOOSE_REQUIREMENTS,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_GET_CHOOSE_SECURITY_REQUIREMENTS
  );

  app.get(
    REQUIREMENT_PATHS.DA_GET_CHOOSE_REQUIREMENTS,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.DA_GET_CHOOSE_SECURITY_REQUIREMENTS
  );
  // /ca/upload-pricing
  app.get(REQUIREMENT_PATHS.CA_GET_UPLOAD_PRICING, [AUTH], REQUIREMENT_CONTROLLER.CA_GET_UPLOAD_PRICING);

  // /ca/upload-supporting-doc
  app.get(
    REQUIREMENT_PATHS.CA_GET_UPLOAD_SUPPORTING_DOCUMENT,
    [AUTH],
    REQUIREMENT_CONTROLLER.CA_GET_UPLOAD_SUPPORTING_DOCUMENT
  );
  // /ca/upload-pricing-supporting-doc
  app.get(
    REQUIREMENT_PATHS.CA_GET_UPLOAD_PRICING_SUPPORTING_DOCUMENT,
    [AUTH],
    REQUIREMENT_CONTROLLER.CA_GET_UPLOAD_PRICING_SUPPORTING_DOCUMENT
  );

  /**
   * @GETROUTER '/ca/summary'
   */
  app.get(
    REQUIREMENT_PATHS.CA_GET_SUMMARY,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.CA_GET_SUMMARY
  );

  /**
   * @GETROUTER '/rfp/service-capabilities'
   */
  app.get(
    REQUIREMENT_PATHS.RFP_GET_SERVICE_CAPABILITIES,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_GET_SERVICE_CAPABILITIES
  );

  /**
   * @GETROUTER '/rfp/ratio-quality-group'
   */
  app.get(
    REQUIREMENT_PATHS.RFP_GET_QUALITY_GROUP,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_GET_QUALITY_GROUP
  );

  /**
   * @GETROUTER '/ca/review'
   */
  app.get(
    REQUIREMENT_PATHS.CA_GET_REVIEW,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.CA_GET_review
  );

  /**
   * @GETROUTER '/rfp/get-work-completed'
   */
  app.get(
    REQUIREMENT_PATHS.RFP_GET_WORK_COMPLETED,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_GET_WORK_COMPLETED
  );

  /**
   * @GETROUTER '/rfp/rfp-eventpublished'
   */
  app.get(
    REQUIREMENT_PATHS.RFP_GET_EVENT_PUBLISHED,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_GET_EVENT_PUBLISHED
  );

  /**
   * @GETROUTER '/da/name-your-project'
   */
  app.get(
    REQUIREMENT_PATHS.DA_GET_NAME_PROJECT_REQUIRE,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.DA_GET_NAME_PROJECT
  );

  /**
   * @GETROUTER '/da/procurement-lead'
   */
  app.get(
    REQUIREMENT_PATHS.DA_GET_LEAD_PROCUREMENT_REQUIRE,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.DA_GET_LEAD_PROCUREMENT
  );

  /**
   * @GETROUTER '/da/add-collaborator'
   */
  app.get(
    REQUIREMENT_PATHS.DA_GET_ADD_COLLABORATOR_REQUIRE,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.DA_GET_ADD_COLLABORATOR
  );
  /**
   * @POST Routes
   */

  app.post(REQUIREMENT_PATHS.DA_POST_LEARN_START, [AUTH], REQUIREMENT_CONTROLLER.DA_POST_LEARN_START);

  app.post(REQUIREMENT_PATHS.POST_ROUTE, [AUTH], REQUIREMENT_CONTROLLER.POST_REQUIREMENT_CHOOSE_ROUTE);

  app.post(REQUIREMENT_PATHS.RFP_POST_TYPE, [AUTH], REQUIREMENT_CONTROLLER.RFP_POST_TYPE);

  //@POST '/rfp/name'
  app.post(REQUIREMENT_PATHS.RFP_POST_NAME_PROJECT, AUTH, REQUIREMENT_CONTROLLER.RFP_POST_NAME_PROJECT);

  //@POST '/ca/name'
  app.post(REQUIREMENT_PATHS.CA_POST_NAME_PROJECT, AUTH, REQUIREMENT_CONTROLLER.CA_POST_NAME_PROJECT);

  //@POST '/da/name'
  app.post(REQUIREMENT_PATHS.DA_POST_NAME_PROJECT_REQUIRE, AUTH, REQUIREMENT_CONTROLLER.DA_POST_NAME_PROJECT);

  //@POST '/rfp/select-services'
  app.post(REQUIREMENT_PATHS.RFP_POST_SELECT_SERVICES, AUTH, REQUIREMENT_CONTROLLER.RFP_POST_SELECTED_SERVICE);

  //@POST '/rfp/select-additional-services
  app.post(
    REQUIREMENT_PATHS.RFP_POST_ADDITIONAL_SELECT_SERVICES,
    AUTH,
    REQUIREMENT_CONTROLLER.RFP_POST_ADDITIONAL_SELECT_SERVICES
  );

  //@POST '/rfp/get-collaborator-detail'
  app.post(REQUIREMENT_PATHS.RFP_POST_ADD_COLLABORATOR, AUTH, REQUIREMENT_CONTROLLER.RFP_POST_ADD_COLLABORATOR);

  //@POST '/ca/get-collaborator-detail'
  app.post(REQUIREMENT_PATHS.CA_POST_ADD_COLLABORATOR, AUTH, REQUIREMENT_CONTROLLER.CA_POST_ADD_COLLABORATOR);

  //@POST '/da/get-collaborator-detail'
  app.post(REQUIREMENT_PATHS.DA_POST_ADD_COLLABORATOR_REQUIRE, AUTH, REQUIREMENT_CONTROLLER.DA_POST_ADD_COLLABORATOR);

  //@POST '/rfp/set-scoring-criteria'
  app.post(REQUIREMENT_PATHS.RFP_POST_SCORING_CRITERIA, AUTH, REQUIREMENT_CONTROLLER.RFP_POST_SCORING_CRITERIA);

  app.post(REQUIREMENT_PATHS.CA_PUT_LEAD_PROCUREMENT, AUTH, REQUIREMENT_CONTROLLER.CA_PUT_LEAD_PROCUREMENT);

  app.post(REQUIREMENT_PATHS.DA_PUT_LEAD_PROCUREMENT_REQUIRE, AUTH, REQUIREMENT_CONTROLLER.DA_PUT_LEAD_PROCUREMENT);
  app.post(REQUIREMENT_PATHS.RFP_PUT_LEAD_PROCUREMENT, AUTH, REQUIREMENT_CONTROLLER.RFP_PUT_LEAD_PROCUREMENT);

  //@POST '/rfp/proceed-collaborators'
  app.post(
    REQUIREMENT_PATHS.RFP_POST_PROCEED_COLLABORATORS,
    AUTH,
    REQUIREMENT_CONTROLLER.RFP_POST_PROCEED_COLLABORATORS
  );

  //@POST '/ca/proceed-collaborators'
  app.post(REQUIREMENT_PATHS.CA_POST_PROCEED_COLLABORATORS, AUTH, REQUIREMENT_CONTROLLER.CA_POST_PROCEED_COLLABORATORS);

  //@POST '/da/proceed-collaborators'
  app.post(
    REQUIREMENT_PATHS.DA_POST_PROCEED_COLLABORATORS_REQUIRE,
    AUTH,
    REQUIREMENT_CONTROLLER.DA_POST_PROCEED_COLLABORATORS
  );

  //@POST '/rfp/get-collaborator-detail/js-enabled'
  app.post(
    REQUIREMENT_PATHS.RFP_POST_ADD_COLLABORATOR_JSENABLED,
    AUTH,
    REQUIREMENT_CONTROLLER.RFP_POST_ADD_COLLABORATOR_JSENABLED
  );

  //@POST '/ca/get-collaborator-detail/js-enabled'
  app.post(
    REQUIREMENT_PATHS.CA_POST_ADD_COLLABORATOR_JSENABLED,
    AUTH,
    REQUIREMENT_CONTROLLER.CA_POST_ADD_COLLABORATOR_JSENABLED
  );

  app.post(REQUIREMENT_PATHS.DA_POST_CANCEL, AUTH, REQUIREMENT_CONTROLLER.DA_POST_CANCEL);

  //@POST '/da/get-collaborator-detail/js-enabled'
  app.post(
    REQUIREMENT_PATHS.DA_POST_ADD_COLLABORATOR_JSENABLED_REQUIRE,
    AUTH,
    REQUIREMENT_CONTROLLER.DA_POST_ADD_COLLABORATOR_JSENABLED
  );

  //@POST '/rfp/add-collaborator-detail'
  app.post(
    REQUIREMENT_PATHS.RFP_POST_ADD_COLLABORATOR_TO_JAGGER,
    AUTH,
    REQUIREMENT_CONTROLLER.RFP_POST_ADD_COLLABORATOR_TO_JAGGER
  );

  app.get(
    REQUIREMENT_PATHS.RFP_POST_DELETE_COLLABORATOR_TO_JAGGER,
    AUTH,
    REQUIREMENT_CONTROLLER.RFP_POST_DELETE_COLLABORATOR_TO_JAGGER
  );

  app.get(
    REQUIREMENT_PATHS.CA_POST_DELETE_COLLABORATOR_TO_JAGGER,
    AUTH,
    REQUIREMENT_CONTROLLER.CA_POST_DELETE_COLLABORATOR_TO_JAGGER
  );

  app.get(
    REQUIREMENT_PATHS.DA_POST_DELETE_COLLABORATOR_TO_JAGGER_REQUIRE,
    AUTH,
    REQUIREMENT_CONTROLLER.DA_POST_DELETE_COLLABORATOR_TO_JAGGER
  );

  //@POST '/ca/add-collaborator-detail'
  app.post(
    REQUIREMENT_PATHS.CA_POST_ADD_COLLABORATOR_TO_JAGGER,
    AUTH,
    REQUIREMENT_CONTROLLER.CA_POST_ADD_COLLABORATOR_TO_JAGGER
  );

  app.post(
    REQUIREMENT_PATHS.DA_POST_ADD_COLLABORATOR_TO_JAGGER_REQUIRE,
    AUTH,
    REQUIREMENT_CONTROLLER.DA_POST_ADD_COLLABORATOR_TO_JAGGER
  );

  app.post(REQUIREMENT_PATHS.RFP_GET_UPLOAD_ATTACHMENT, AUTH, REQUIREMENT_CONTROLLER.RFP_POST_UPLOAD_ATTACHMENT);

  app.post(
    REQUIREMENT_PATHS.RFP_POST_UPLOAD_ATTACHMENT_PROCEED,
    AUTH,
    REQUIREMENT_CONTROLLER.RFP_POST_UPLOAD_ATTACHMENT_PROCEED
  );

  app.post(REQUIREMENT_PATHS.RFP_POST_UPLOAD_DOC, AUTH, REQUIREMENT_CONTROLLER.RFP_POST_UPLOAD_DOC);

  app.post(REQUIREMENT_PATHS.CA_POST_UPLOAD_DOC, AUTH, REQUIREMENT_CONTROLLER.CA_POST_UPLOAD_DOC);

  app.post(REQUIREMENT_PATHS.CA_POST_UPLOAD_PROCEED, AUTH, REQUIREMENT_CONTROLLER.CA_POST_UPLOAD_PROCEED);

  app.post(REQUIREMENT_PATHS.RFP_POST_UPLOAD_PROCEED, AUTH, REQUIREMENT_CONTROLLER.RFP_POST_UPLOAD_PROCEED);

  app.get(REQUIREMENT_PATHS.RFP_GET_UPLOAD_ADDITIONAL, REQUIREMENT_CONTROLLER.RFP_GET_UPLOAD_ADDITIONAL);

  app.post(REQUIREMENT_PATHS.RFP_POST_UPLOAD_ADDITIONAL, AUTH, REQUIREMENT_CONTROLLER.RFP_POST_UPLOAD_ADDITIONAL);

  app.post(
    REQUIREMENT_PATHS.RFP_POST_UPLOAD_ADDITIONAL_PROCEED,
    AUTH,
    REQUIREMENT_CONTROLLER.RFP_POST_UPLOAD_ADDITIONAL_PROCEED
  );

  app.get(
    REQUIREMENT_PATHS.RFP_GET_REMOVE_ADDITIONAL_FILES,
    AUTH,
    REQUIREMENT_CONTROLLER.RFP_GET_REMOVE_ADDITIONAL_FILES
  );

  app.get(REQUIREMENT_PATHS.RFP_GET_UPLOAD_ADDITIONAL_DOC, REQUIREMENT_CONTROLLER.RFP_GET_UPLOAD_ADDITIONAL_DOC);

  app.post(
    REQUIREMENT_PATHS.RFP_POST_UPLOAD_ADDITIONAL_DOC,
    AUTH,
    REQUIREMENT_CONTROLLER.RFP_POST_UPLOAD_ADDITIONAL_DOC
  );

  app.post(
    REQUIREMENT_PATHS.RFP_POST_UPLOAD_ADDITIONAL_DOC_PROCEED,
    AUTH,
    REQUIREMENT_CONTROLLER.RFP_POST_UPLOAD_ADDITIONAL_DOC_PROCEED
  );

  app.get(
    REQUIREMENT_PATHS.RFP_GET_REMOVE_ADDITIONAL_DOC_FILES,
    AUTH,
    REQUIREMENT_CONTROLLER.RFP_GET_REMOVE_ADDITIONAL_DOC_FILES
  );

  //@POST '/ca/learn-about-capability-assessment'
  app.post(REQUIREMENT_PATHS.CA_POST_LEARN, AUTH, REQUIREMENT_CONTROLLER.CA_POST_LEARN);

  app.post(
    REQUIREMENT_PATHS.CA_POST_LEARN_ASSESSMENT_BASES,
    AUTH,
    REQUIREMENT_CONTROLLER.CA_POST_LEARN_ASSESSMENT_BASES
  );
  //@POST '/da/enter-your-weightings'
  app.post(REQUIREMENT_PATHS.DA_POST_WEIGHTINGS, AUTH, REQUIREMENT_CONTROLLER.DA_POST_WEIGHTINGS);

  //@POST '/da/learn-about-capability-assessment'
  app.post(REQUIREMENT_PATHS.DA_POST_LEARN, AUTH, REQUIREMENT_CONTROLLER.DA_POST_LEARN);

  //@POST '/ca/learnabout-capability-assessment'
  app.post(REQUIREMENT_PATHS.POST_LEARN, AUTH, REQUIREMENT_CONTROLLER.POST_LEARN);

  app.post(REQUIREMENT_PATHS.RFP_POST_QUESTIONS, [AUTH], REQUIREMENT_CONTROLLER.RFP_POST_QUESTION);

  //@POST '/ca/suppliers-to-forward'
  app.post(REQUIREMENT_PATHS.CA_POST_SUPPLIERS_FORWARD, AUTH, REQUIREMENT_CONTROLLER.CA_POST_SUPPLIERS_FORWARD);

  //@POST '/ca/accept-subcontractors'
  app.post(REQUIREMENT_PATHS.CA_POST_SUBCONTRACTORS, AUTH, REQUIREMENT_CONTROLLER.CA_POST_SUBCONTRACTORS);

  //@POST '/ca/next-steps'
  app.post(REQUIREMENT_PATHS.CA_POST_NEXTSTEPS, AUTH, REQUIREMENT_CONTROLLER.CA_POST_NEXTSTEPS);

  //@POST '/da/next-steps'
  app.post(REQUIREMENT_PATHS.DA_POST_NEXTSTEPS, AUTH, REQUIREMENT_CONTROLLER.DA_POST_NEXTSTEPS);

  // /rfp/IR35
  app.post(REQUIREMENT_PATHS.RFP_POST_IR35, [AUTH], REQUIREMENT_CONTROLLER.RFP_POST_I35);

  // /ca/type
  app.post(REQUIREMENT_PATHS.CA_POST_TYPE, [AUTH], REQUIREMENT_CONTROLLER.CA_POST_TYPE);
  //@POST '/ca/team-scale'
  app.post(REQUIREMENT_PATHS.CA_POST_TEAM_SCALE, AUTH, REQUIREMENT_CONTROLLER.CA_POST_TEAM_SCALE);

  app.post(REQUIREMENT_PATHS.CA_POST_TYPE, [AUTH], REQUIREMENT_CONTROLLER.CA_POST_TYPE);

  app.post(REQUIREMENT_PATHS.CA_POST_WHERE_WORK_DONE, [AUTH], REQUIREMENT_CONTROLLER.CA_POST_WHERE_WORK_DONE);

  app.post(REQUIREMENT_PATHS.DA_POST_WHERE_WORK_DONE, [AUTH], REQUIREMENT_CONTROLLER.DA_POST_WHERE_WORK_DONE);

  app.post(REQUIREMENT_PATHS.RFP_POST_WHERE_WORK_DONE, [AUTH], REQUIREMENT_CONTROLLER.RFP_POST_WHERE_WORK_DONE);

  app.post(REQUIREMENT_PATHS.DA_POST_TYPE_REQUIRE, [AUTH], REQUIREMENT_CONTROLLER.DA_POST_TYPE);

  app.get(
    REQUIREMENT_PATHS.DA_TYPE_REQUIRE,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.DA_REQUIREMENT_TYPE
  );

  app.get(
    REQUIREMENT_PATHS.DA_REQUIREMENT_TASK_LIST_REQUIRE,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements, PreMarketEngagementMiddleware.PutPremarket],
    REQUIREMENT_CONTROLLER.DA_REQUIREMENT_TASK_LIST
  );

  app.get(
    REQUIREMENT_PATHS.DA_OFFLINE_JOURNEY_PAGE_REQUIRE,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements, PreMarketEngagementMiddleware.PutPremarket],
    REQUIREMENT_CONTROLLER.DA_OFFLINE_JOURNEY_PAGE
  );

  //@POST '/da/team-scale'
  app.post(REQUIREMENT_PATHS.DA_POST_TEAM_SCALE, AUTH, REQUIREMENT_CONTROLLER.DA_POST_TEAM_SCALE);

  //@POST "rfp/suppliers"
  app.post(REQUIREMENT_PATHS.POST_RFP_SUPPLIER, AUTH, REQUIREMENT_CONTROLLER.POST_RFP_SUPPLIERS);
  //@POST "rfp/suppliers"
  app.post(REQUIREMENT_PATHS.POST_RFP_SUPPLIER, AUTH, REQUIREMENT_CONTROLLER.POST_RFP_SUPPLIERS);
  //@POST '/ca/resources-vetting-weightisngs'
  app.post(
    REQUIREMENT_PATHS.CA_POST_RESOURCES_VETTING_WEIGHTINGS,
    AUTH,
    REQUIREMENT_CONTROLLER.CA_POST_RESOURCES_VETTING_WEIGHTINGS
  );
  app.post(REQUIREMENT_PATHS.CA_POST_WEIGHTINGS, AUTH, REQUIREMENT_CONTROLLER.CA_POST_WEIGHTINGS);

  app.post(REQUIREMENT_PATHS.CA_POST_SERVICE_CAPABILITIES, AUTH, REQUIREMENT_CONTROLLER.CA_POST_SERVICE_CAPABILITIES);

  app.post(REQUIREMENT_PATHS.DA_POST_SUBCONTRACTORS, AUTH, REQUIREMENT_CONTROLLER.DA_POST_SUBCONTRACTORS);
  // @Post '/rfp/response-date'
  app.post(REQUIREMENT_PATHS.RFP_POST_RESPONSE_DATE, AUTH, REQUIREMENT_CONTROLLER.RFP_POST_RESPONSE_DATE); //test

  // @Post /rfp/add/response-date
  app.post(REQUIREMENT_PATHS.RFP_POST_ADD_RESPONSEDATE, AUTH, REQUIREMENT_CONTROLLER.RFP_POST_ADD_RESPONSE_DATE); //test

  app.post(REQUIREMENT_PATHS.DA_POST_SERVICE_CAPABILITIES, AUTH, REQUIREMENT_CONTROLLER.DA_POST_SERVICE_CAPABILITIES);
  app.post(
    REQUIREMENT_PATHS.DA_POST_REVIEW_RANKED_SUPPLIERS,
    [AUTH],
    REQUIREMENT_CONTROLLER.DA_POST_REVIEW_RANKED_SUPPLIERS
  );

  // /rfp/vetting-weighting
  app.post(
    REQUIREMENT_PATHS.RFP_POST_VETTING_AND_WEIGHTING,
    [AUTH],
    REQUIREMENT_CONTROLLER.RFP_POST_VETTING_AND_WEIGHTING
  );

  app.post(
    REQUIREMENT_PATHS.RFP_POST_CHOOSE_REQUIREMENTS,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_POST_CHOOSE_SECURITY_REQUIREMENTS
  );
  app.post(
    REQUIREMENT_PATHS.CA_POST_CHOOSE_REQUIREMENTS,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.CA_POST_CHOOSE_SECURITY_REQUIREMENTS
  );
  app.post(
    REQUIREMENT_PATHS.DA_POST_CHOOSE_REQUIREMENTS,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.DA_POST_CHOOSE_SECURITY_REQUIREMENTS
  );
  // /ca/upload-pricing-supporting-doc
  app.post(
    REQUIREMENT_PATHS.CA_GET_UPLOAD_PRICING_SUPPORTING_DOCUMENT,
    [AUTH],
    REQUIREMENT_CONTROLLER.CA_GET_UPLOAD_PRICING_SUPPORTING_DOCUMENT
  );

  /**
   * @POSTROUTER '/ca/summary'
   */
  app.post(
    REQUIREMENT_PATHS.CA_POST_SUMMARY,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.CA_POST_SUMMARY
  );

  /**
   * @POSTROUTER ''/rfp/service-capabilities''
   */
  app.post(
    REQUIREMENT_PATHS.RFP_POST_SERVICE_CAPABILITIES,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_POST_SERVICE_CAPABILITIES
  );

  /**
   * @POSTROUTER '/rfp/enter-your-weightings'
   */
  app.post(
    REQUIREMENT_PATHS.RFP_POST_WEIGHTINGS,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_POST_WEIGHTINGS
  );

  /**
   * @POSTROUTER '/rfp/ratio-quality-group
   */
  app.post(
    REQUIREMENT_PATHS.RFP_POST_QUALITY_GROUP,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_POST_QUALITY_GROUP
  );

  /**
   * @POSTROUTER '/ca/review
   */
  app.post(
    REQUIREMENT_PATHS.CA_POST_REVIEW,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.CA_POST_review
  );

  /**
   * @POSTROUTER '/rfp/get-work-completed'
   */
  app.post(
    REQUIREMENT_PATHS.RFP_POST_WORK_COMPLETED,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.RFP_POST_WORK_COMPLETED
  );

  /**
   * @POSTROUTER '/da/resources-vetting-weightings'
   */
  app.post(
    REQUIREMENT_PATHS.DA_POST_RESOURCES_VETTING_WEIGHTINGS,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.DA_POST_RESOURCES_VETTING_WEIGHTINGS
  );
  app.get(REQUIREMENT_PATHS.RFP_GET_REMOVE_FILES, AUTH, REQUIREMENT_CONTROLLER.RFP_GET_REMOVE_FILES);
  app.get(
    REQUIREMENT_PATHS.RFP_GET_REMOVE_FILES_ATTACHMENT,
    AUTH,
    REQUIREMENT_CONTROLLER.RFP_GET_REMOVE_FILES_ATTACHMENT
  );
  app.get(
    REQUIREMENT_PATHS.GET_RFP_REVIEW,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.GET_RFP_REVIEW
  );

  app.post(
    REQUIREMENT_PATHS.POST_RFP_REVIEW,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.POST_RFP_REVIEW
  );

  app.get(
    REQUIREMENT_PATHS.GET_UNPUBLISHED_EVENT_MANAGEMENT,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.GET_UNPUBLISHED_EVENT_MANAGEMENT
  );

  app.get(
    REQUIREMENT_PATHS.GET_RFP_CLOSE_PROJECT,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.GET_RFP_CLOSE_PROJECT
  );

  app.post(
    REQUIREMENT_PATHS.POST_DA_REVIEW_SUPPLIER,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.POST_DA_REVIEW_SUPPLIER
  );

  app.get(
    REQUIREMENT_PATHS.GET_DA_REVIEW_SUPPLIER,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.GET_DA_REVIEW_SUPPLIER
  );

  // StandstilSupplierPresentation - Start
  app.post(REQUIREMENT_PATHS.TIMELINE_STANDSTILL_SUPPLIERT, AUTH, REQUIREMENT_CONTROLLER.TIMELINE_STANDSTILL_SUPPLIERT);
  // StandstilSupplierPresentation - End
}
