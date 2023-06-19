import { AUTH } from '../../common/middlewares/oauthservice/authstatecheck';
import { REQUIREMENT_CONTROLLER } from './controller/index';
import { REQUIRMENT_DA_PATHS } from './model/daConstants';
import { Application } from 'express';
import { PreMarketEngagementMiddleware } from '../../common/middlewares/premarketservice/premarketengagement';
import { AgreementDetailsFetchMiddleware } from '../../common/middlewares/agreementservice/agreementDetailsFetch';

export default function (app: Application): void {
  app.get(REQUIRMENT_DA_PATHS.DA_TYPE, [AUTH], REQUIREMENT_CONTROLLER.DA_TYPE);
  // app.get(REQUIRMENT_DA_PATHS.DA_REQUIREMENT_TASK_LIST, [AUTH], REQUIREMENT_CONTROLLER.DA_REQUIREMENT_TASK_LIST);

  //@GET '/da/upload'
  app.get(
    REQUIRMENT_DA_PATHS.DA_UPLOAD,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.DA_UPLOAD
  );
  //@GET '/da/upload-attachment'
  app.get(
    REQUIRMENT_DA_PATHS.DA_GET_UPLOAD_ATTACHMENT,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.DA_GET_UPLOAD_ATTACHMENT
  );

  //@GET '/da/upload-doc'
  app.get(
    REQUIRMENT_DA_PATHS.DA_GET_UPLOAD_DOC,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.DA_GET_UPLOAD_DOC
  );

  app.post(REQUIRMENT_DA_PATHS.DA_GET_UPLOAD_ATTACHMENT, AUTH, REQUIREMENT_CONTROLLER.DA_POST_UPLOAD_ATTACHMENT);

  app.post(
    REQUIRMENT_DA_PATHS.DA_POST_UPLOAD_ATTACHMENT_PROCEED,
    AUTH,
    REQUIREMENT_CONTROLLER.DA_POST_UPLOAD_ATTACHMENT_PROCEED
  );

  app.post(REQUIRMENT_DA_PATHS.DA_POST_UPLOAD_DOC, AUTH, REQUIREMENT_CONTROLLER.DA_POST_UPLOAD_DOC);

  app.post(REQUIRMENT_DA_PATHS.DA_POST_UPLOAD_PROCEED, AUTH, REQUIREMENT_CONTROLLER.DA_POST_UPLOAD_PROCEED);

  app.get(REQUIRMENT_DA_PATHS.DA_GET_REMOVE_FILES, AUTH, REQUIREMENT_CONTROLLER.DA_GET_REMOVE_FILES);

  app.get(
    REQUIRMENT_DA_PATHS.DA_GET_REMOVE_FILES_ATTACHMENT,
    AUTH,
    REQUIREMENT_CONTROLLER.DA_GET_REMOVE_FILES_ATTACHMENT
  );

  app.get(REQUIRMENT_DA_PATHS.DA_GET_UPLOAD_ADDITIONAL, REQUIREMENT_CONTROLLER.DA_GET_UPLOAD_ADDITIONAL);

  app.post(REQUIRMENT_DA_PATHS.DA_POST_UPLOAD_ADDITIONAL, AUTH, REQUIREMENT_CONTROLLER.DA_POST_UPLOAD_ADDITIONAL);

  app.post(
    REQUIRMENT_DA_PATHS.DA_POST_UPLOAD_ADDITIONAL_PROCEED,
    AUTH,
    REQUIREMENT_CONTROLLER.DA_POST_UPLOAD_ADDITIONAL_PROCEED
  );

  // /da/IR35
  app.get(
    REQUIRMENT_DA_PATHS.DA_GET_IR35,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.DA_GET_I35
  );

  // /da/IR35
  app.post(REQUIRMENT_DA_PATHS.DA_POST_IR35, [AUTH], REQUIREMENT_CONTROLLER.DA_POST_I35);

  app.get(
    REQUIRMENT_DA_PATHS.DA_GET_ADD_COLLABORATOR,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.DA_GET_ADD_COLLABORATOR
  );
  app.get(
    REQUIRMENT_DA_PATHS.DA_GET_SELECTED_SERVICE,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.DA_GET_SELECTED_SERVICE
  );
  app.post(REQUIRMENT_DA_PATHS.DA_POST_SELECT_SERVICES, AUTH, REQUIREMENT_CONTROLLER.DA_POST_SELECTED_SERVICE);

  //@POST '/da/get-collaborator-detail'
  app.post(REQUIRMENT_DA_PATHS.DA_POST_ADD_COLLABORATOR, AUTH, REQUIREMENT_CONTROLLER.DA_POST_ADD_COLLABORATOR);

  // @POST '/da/get-collaborator-detail/js-enabled'
  app.post(
    REQUIRMENT_DA_PATHS.DA_POST_ADD_COLLABORATOR_JSENABLED,
    AUTH,
    REQUIREMENT_CONTROLLER.DA_POST_ADD_COLLABORATOR_JSENABLED
  );

  app.post(
    REQUIRMENT_DA_PATHS.DA_POST_ADD_COLLABORATOR_TO_JAGGER,
    AUTH,
    REQUIREMENT_CONTROLLER.DA_POST_ADD_COLLABORATOR_TO_JAGGER
  );

  //@POST '/da/proceed-collaborators'
  app.post(
    REQUIRMENT_DA_PATHS.DA_POST_PROCEED_COLLABORATORS,
    AUTH,
    REQUIREMENT_CONTROLLER.DA_POST_PROCEED_COLLABORATORS
  );
  app.get(
    REQUIRMENT_DA_PATHS.DA_POST_DELETE_COLLABORATOR_TO_JAGGER,
    AUTH,
    REQUIREMENT_CONTROLLER.DA_POST_DELETE_COLLABORATOR_TO_JAGGER
  );

  // /da/add-context
  app.get(
    REQUIRMENT_DA_PATHS.DA_ADD_CONTEXT,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.DA_ADD_CONTEXT
  );

  // @GET "/da/suppliers"
  app.get(
    REQUIRMENT_DA_PATHS.GET_DA_SUPPLIERS,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.GET_DA_SUPPLIERS
  );

  // @GET "/da/suppliers/ratecard"
  app.get(
    REQUIRMENT_DA_PATHS.SUPPLIER_DA_RATECARD,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.SUPPLIER_DA_RATECARD
  );

  // @POST "da/suppliers"
  app.post(REQUIRMENT_DA_PATHS.POST_DA_SUPPLIER, AUTH, REQUIREMENT_CONTROLLER.POST_DA_SUPPLIER);

  app.get(
    REQUIRMENT_DA_PATHS.DA_GET_EVENT_PUBLISHED,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.DA_GET_EVENT_PUBLISHED
  );

  // /da/questions
  app.get(
    REQUIRMENT_DA_PATHS.DA_GET_QUESTIONS,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.DA_GET_QUESTIONS
  );
  app.post(REQUIRMENT_DA_PATHS.DA_POST_QUESTIONS, [AUTH], REQUIREMENT_CONTROLLER.DA_POST_QUESTIONS);

  app.get(
    REQUIRMENT_DA_PATHS.GET_DA_REVIEW,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.GET_DA_REVIEW
  );
  app.post(
    REQUIRMENT_DA_PATHS.POST_DA_REVIEW,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.POST_DA_REVIEW
  );
  app.get(
    REQUIRMENT_DA_PATHS.DA_REQUIREMENT_TASK_LIST,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements, PreMarketEngagementMiddleware.PutPremarket],
    REQUIREMENT_CONTROLLER.DA_REQUIREMENT_TASK_LIST
  );

  // app.get(REQUIRMENT_DA_PATHS.DA_REQUIREMENT_TASK_LIST, [AUTH], REQUIREMENT_CONTROLLER.DA_REQUIREMENT_TASK_LIST);

  app.get(REQUIRMENT_DA_PATHS.DA_GET_NAME_PROJECT, [AUTH], REQUIREMENT_CONTROLLER.DA_GET_NAME_PROJECT);
  app.post(REQUIRMENT_DA_PATHS.DA_POST_NAME_PROJECT, [AUTH], REQUIREMENT_CONTROLLER.DA_POST_NAME_PROJECT);

  //@GET '/da/procurement-lead'
  app.get(
    REQUIRMENT_DA_PATHS.DA_GET_LEAD_PROCUREMENT,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.DA_GET_LEAD_PROCUREMENT
  );

  app.post(REQUIRMENT_DA_PATHS.DA_PUT_LEAD_PROCUREMENT, AUTH, REQUIREMENT_CONTROLLER.DA_PUT_LEAD_PROCUREMENT);
  app.get(REQUIRMENT_DA_PATHS.DA_GET_USER_PROCUREMENT, [AUTH], REQUIREMENT_CONTROLLER.DA_GET_USER_PROCUREMENT);

  // /da/your-assesstment
  app.get(
    REQUIRMENT_DA_PATHS.DA_YOUR_ASSESSMENT,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.DA_GET_YOUR_ASSESSTMENT
  );
  //da/your-assesstment-question -GET
  app.get(
    REQUIRMENT_DA_PATHS.DA_GET_YOUR_ASSESSMENT_QUESTION,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.DA_Assesstment_GET_QUESTIONS
  );
  ///da/your-assesstment-question -POST
  app.post(
    REQUIRMENT_DA_PATHS.DA_POST_YOUR_ASSESSMENT_QUESTION,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.DA_Assesstment_POST_QUESTION
  );

  // /da/response-date
  app.get(
    REQUIRMENT_DA_PATHS.DA_GET_RESPONSE_DATE,
    [AUTH, AgreementDetailsFetchMiddleware.FetchAgreements],
    REQUIREMENT_CONTROLLER.DA_GET_RESPONSE_DATE //test
  );

  // @Post '/da/response-date'
  app.post(REQUIRMENT_DA_PATHS.DA_POST_RESPONSE_DATE, AUTH, REQUIREMENT_CONTROLLER.DA_POST_RESPONSE_DATE); //test

  // @Post /da/add/response-date
  app.post(REQUIRMENT_DA_PATHS.DA_POST_ADD_RESPONSEDATE, AUTH, REQUIREMENT_CONTROLLER.DA_POST_ADD_RESPONSE_DATE); //test
}
