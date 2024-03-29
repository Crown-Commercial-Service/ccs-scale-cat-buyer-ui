import { Application } from 'express';
import { AUTH } from '../../common/middlewares/oauthservice/authstatecheck';
import { EVENT_MANAGEMENT_CONTROLLER } from './controller/index';
import { EVENT_MANAGEMENT_PATHS } from './model/eventManagementConstants';

export default function (app: Application): void {
  // This is the reciever callback after getting the token
  app.get(EVENT_MANAGEMENT_PATHS.EVENT_MANAGEMENT, [AUTH], EVENT_MANAGEMENT_CONTROLLER.EVENT_MANAGEMENT);

  app.get(EVENT_MANAGEMENT_PATHS.EVENT_MANAGEMENT_CLOSE, [AUTH], EVENT_MANAGEMENT_CONTROLLER.EVENT_MANAGEMENT_CLOSE);
  app.get(
    EVENT_MANAGEMENT_PATHS.EVENT_MANAGEMENT_MESSAGING,
    [AUTH],
    EVENT_MANAGEMENT_CONTROLLER.EVENT_MANAGEMENT_MESSAGING
  );

  app.get(
    EVENT_MANAGEMENT_PATHS.EVENT_MANAGEMENT_MESSAGING_CREATE,
    [AUTH],
    EVENT_MANAGEMENT_CONTROLLER.EVENT_MANAGEMENT_MESSAGING_CREATE
  );

  app.get(
    EVENT_MANAGEMENT_PATHS.EVENT_MANAGEMENT_MESSAGING_SENT,
    [AUTH],
    EVENT_MANAGEMENT_CONTROLLER.EVENT_MANAGEMENT_MESSAGING_SENT
  );

  app.get(
    EVENT_MANAGEMENT_PATHS.EVENT_MANAGEMENT_MESSAGING_SUBBLIER_CREATE,
    [AUTH],
    EVENT_MANAGEMENT_CONTROLLER.EVENT_MANAGEMENT_MESSAGING_SUBBLIER_CREATE
  );

  app.post(
    EVENT_MANAGEMENT_PATHS.POST_MESSAGING_SUBBLIER_CREATE,
    [AUTH],
    EVENT_MANAGEMENT_CONTROLLER.POST_MESSAGING_SUBBLIER_CREATE
  );

  app.get(EVENT_MANAGEMENT_PATHS.EVENT_MANAGEMENT_QA, EVENT_MANAGEMENT_CONTROLLER.EVENT_MANAGEMENT_QA_SUPPLIERS);
  app.get(
    EVENT_MANAGEMENT_PATHS.EVENT_MANAGEMENT_QA_SUPPLIERS,
    EVENT_MANAGEMENT_CONTROLLER.EVENT_MANAGEMENT_QA_SUPPLIERS
  );
  app.get(EVENT_MANAGEMENT_PATHS.EVENT_MANAGEMENT_QA_view, [AUTH], EVENT_MANAGEMENT_CONTROLLER.EVENT_MANAGEMENT_QA);

  app.get(
    EVENT_MANAGEMENT_PATHS.EVENT_MANAGEMENT_SUPPLIER_QA,
    [AUTH],
    EVENT_MANAGEMENT_CONTROLLER.EVENT_MANAGEMENT_SUPPLIER_QA
  );

  app.get(
    EVENT_MANAGEMENT_PATHS.EVENT_MANAGEMENT_NEXT_STEP_GET,
    [AUTH],
    EVENT_MANAGEMENT_CONTROLLER.EVENT_MANAGEMENT_NEXT_STEP_GET
  );

  app.get(
    EVENT_MANAGEMENT_PATHS.EVENT_MANAGEMENT_MESSAGE_DETAILS_GET,
    [AUTH],
    EVENT_MANAGEMENT_CONTROLLER.EVENT_MANAGEMENT_MESSAGE_DETAILS_GET
  );

  app.get(
    EVENT_MANAGEMENT_PATHS.EVENT_MANAGEMENT_MESSAGE_REPLY,
    [AUTH],
    EVENT_MANAGEMENT_CONTROLLER.EVENT_MANAGEMENT_MESSAGE_REPLY
  );
  app.get(
    EVENT_MANAGEMENT_PATHS.EVENT_MANAGEMENT_DOWNLOAD,
    AUTH,
    EVENT_MANAGEMENT_CONTROLLER.EVENT_MANAGEMENT_DOWNLOAD
  );

  app.get(EVENT_MANAGEMENT_PATHS.STEPS_TO_CONTINUE, [AUTH], EVENT_MANAGEMENT_CONTROLLER.GET_STEPS_TO_CONTINUE);

  app.get(
    EVENT_MANAGEMENT_PATHS.PUBLISHED_PROJECT_DOWNLOAD,
    [AUTH],
    EVENT_MANAGEMENT_CONTROLLER.PUBLISHED_PROJECT_DOWNLOAD
  );
  app.get(
    EVENT_MANAGEMENT_PATHS.SUPPLIER_ANSWER_DOWNLOAD,
    [AUTH],
    EVENT_MANAGEMENT_CONTROLLER.SUPPLIER_ANSWER_DOWNLOAD
  );
  app.get(
    EVENT_MANAGEMENT_PATHS.SUPPLIER_ANSWER_DOWNLOAD_ALL,
    [AUTH],
    EVENT_MANAGEMENT_CONTROLLER.SUPPLIER_ANSWER_DOWNLOAD_ALL
  );
  app.get(EVENT_MANAGEMENT_PATHS.SUPPLIER_EVALUATION, [AUTH], EVENT_MANAGEMENT_CONTROLLER.SUPPLIER_EVALUATION);
  app.get(EVENT_MANAGEMENT_PATHS.GET_CONFIRM_SUPPLIER, [AUTH], EVENT_MANAGEMENT_CONTROLLER.GET_CONFIRM_SUPPLIER);
  app.post(EVENT_MANAGEMENT_PATHS.POST_CONFIRM_SUPPLIER, [AUTH], EVENT_MANAGEMENT_CONTROLLER.POST_CONFIRM_SUPPLIER);
  app.get(EVENT_MANAGEMENT_PATHS.GET_AWARD_SUPPLIER, [AUTH], EVENT_MANAGEMENT_CONTROLLER.GET_AWARD_SUPPLIER);
  app.post(EVENT_MANAGEMENT_PATHS.POST_AWARD_SUPPLIER, [AUTH], EVENT_MANAGEMENT_CONTROLLER.POST_AWARD_SUPPLIER);
  app.get(
    EVENT_MANAGEMENT_PATHS.GET_AWARD_SUPPLIER_DOCUMENT,
    [AUTH],
    EVENT_MANAGEMENT_CONTROLLER.GET_AWARD_SUPPLIER_DOCUMENT
  );
  app.post(EVENT_MANAGEMENT_PATHS.CONFIRM_SUPPLIER_AWARD, [AUTH], EVENT_MANAGEMENT_CONTROLLER.CONFIRM_SUPPLIER_AWARD);
  app.get(
    EVENT_MANAGEMENT_PATHS.STAND_PERIOD_DECISION_GET,
    [AUTH],
    EVENT_MANAGEMENT_CONTROLLER.STAND_PERIOD_DECISION_GET
  );
  app.post(
    EVENT_MANAGEMENT_PATHS.STAND_PERIOD_DECISION_POST,
    [AUTH],
    EVENT_MANAGEMENT_CONTROLLER.STAND_PERIOD_DECISION_POST
  );

  app.get(
    EVENT_MANAGEMENT_PATHS.UNSUCCESSFUL_SUPPLIER_DOWNLOAD,
    [AUTH],
    EVENT_MANAGEMENT_CONTROLLER.UNSUCCESSFUL_SUPPLIER_DOWNLOAD
  );

  app.get(EVENT_MANAGEMENT_PATHS.RETURN_EVENTMANAGEMENT, [AUTH], EVENT_MANAGEMENT_CONTROLLER.RETURN_EVENTMANAGEMENT);

  app.get(EVENT_MANAGEMENT_PATHS.EVENT_STATE_CHANGE, [AUTH], EVENT_MANAGEMENT_CONTROLLER.EVENT_STATE_CHANGE);

  app.post(EVENT_MANAGEMENT_PATHS.STEPS_TO_CONTINUE, AUTH, EVENT_MANAGEMENT_CONTROLLER.POST_STEPS_TO_CONTINUE);

  app.post(
    EVENT_MANAGEMENT_PATHS.POST_EVENT_MANAGEMENT_MESSAGE_REPLY,
    AUTH,
    EVENT_MANAGEMENT_CONTROLLER.POST_EVENT_MANAGEMENT_MESSAGE_REPLY
  );
  app.post(
    EVENT_MANAGEMENT_PATHS.POST_EVENT_MANAGEMENT_MESSAGE_DETAILS,
    AUTH,
    EVENT_MANAGEMENT_CONTROLLER.POST_EVENT_MANAGEMENT_MESSAGE_DETAILS
  );

  app.post(EVENT_MANAGEMENT_PATHS.POST_MESSAGING_CREATE, AUTH, EVENT_MANAGEMENT_CONTROLLER.POST_MESSAGING_CREATE);

  app.post(
    EVENT_MANAGEMENT_PATHS.POST_EVENT_MANAGEMENT_NEXT_STEP,
    AUTH,
    EVENT_MANAGEMENT_CONTROLLER.POST_EVENT_MANAGEMENT_NEXT_STEP
  );

  //Q&A
  ///event/qa-add
  app.get(
    EVENT_MANAGEMENT_PATHS.EVENT_MANAGEMENT_QA_Add_GET,
    AUTH,
    EVENT_MANAGEMENT_CONTROLLER.EVENT_MANAGEMENT_GET_QA_ADD
  );
  ///event/qa-add-2nd-step
  app.get(
    EVENT_MANAGEMENT_PATHS.EVENT_MANAGEMENT_GET_QA_ADD_TWO_STEP,
    AUTH,
    EVENT_MANAGEMENT_CONTROLLER.EVENT_MANAGEMENT_GET_QA_ADD_TWO_STEP
  );
  ///event/qa-add
  app.post(
    EVENT_MANAGEMENT_PATHS.EVENT_MANAGEMENT_QA_Add_POST,
    AUTH,
    EVENT_MANAGEMENT_CONTROLLER.EVENT_MANAGEMENT_POST_QA_ADD
  );

  ///event/qa-edit
  app.get(
    EVENT_MANAGEMENT_PATHS.EVENT_MANAGEMENT_QA_Edit_GET,
    AUTH,
    EVENT_MANAGEMENT_CONTROLLER.EVENT_MANAGEMENT_GET_QA_Edit
  );
  ///event/qa-edit
  app.post(
    EVENT_MANAGEMENT_PATHS.EVENT_MANAGEMENT_QA_Edit_POST,
    AUTH,
    EVENT_MANAGEMENT_CONTROLLER.EVENT_MANAGEMENT_POST_QA_Edit
  );

  app.get(EVENT_MANAGEMENT_PATHS.EVALUATE_SUPPLIERS, AUTH, EVENT_MANAGEMENT_CONTROLLER.EVALUATE_SUPPLIERS);
  app.get(
    EVENT_MANAGEMENT_PATHS.EVALUATE_SUPPLIERS_DOWNLOAD,
    AUTH,
    EVENT_MANAGEMENT_CONTROLLER.EVALUATE_SUPPLIERS_DOWNLOAD
  );

  app.get(EVENT_MANAGEMENT_PATHS.EVALUATE_SUPPLIERS_POPUP, AUTH, EVENT_MANAGEMENT_CONTROLLER.EVALUATE_SUPPLIERS_POPUP);

  app.get(EVENT_MANAGEMENT_PATHS.ENTER_EVALUATION, AUTH, EVENT_MANAGEMENT_CONTROLLER.ENTER_EVALUATION);

  app.post(EVENT_MANAGEMENT_PATHS.ENTER_EVALUATION_POST, AUTH, EVENT_MANAGEMENT_CONTROLLER.ENTER_EVALUATION_POST);
  //DOWNLOAD SUPPLIER RESPONCE
  app.get(
    EVENT_MANAGEMENT_PATHS.Download_SUPPLIER_RESPONCE,
    AUTH,
    EVENT_MANAGEMENT_CONTROLLER.Download_SUPPLIER_RESPONCE
  );

  app.post(EVENT_MANAGEMENT_PATHS.INVITE_SUPPLIERS, AUTH, EVENT_MANAGEMENT_CONTROLLER.INVITE_SUPPLIERS);

  app.get(
    EVENT_MANAGEMENT_PATHS.INVITE_SELECTED_SUPPLIERS,
    [AUTH],
    EVENT_MANAGEMENT_CONTROLLER.INVITE_SELECTED_SUPPLIERS
  );

  app.post(
    EVENT_MANAGEMENT_PATHS.SAVE_INVITE_SELECTED_SUPPLIERS,
    AUTH,
    EVENT_MANAGEMENT_CONTROLLER.SAVE_INVITE_SELECTED_SUPPLIERS
  );

  app.get(EVENT_MANAGEMENT_PATHS.SHORTLIST_EVALUATION, AUTH, EVENT_MANAGEMENT_CONTROLLER.SHORTLIST_EVALUATION);

  //SCORE LOADING
  app.get(EVENT_MANAGEMENT_PATHS.SCORE_INDIVIDUAL_GET, AUTH, EVENT_MANAGEMENT_CONTROLLER.SCORE_INDIVIDUAL_GET);

  //CONFIRM SCORE LOADING
  app.get(EVENT_MANAGEMENT_PATHS.CONFIRM_SCORE_GET, AUTH, EVENT_MANAGEMENT_CONTROLLER.CONFIRM_SCORE_GET);

  //START EVALUATION
  app.get(EVENT_MANAGEMENT_PATHS.START_EVALUATION, AUTH, EVENT_MANAGEMENT_CONTROLLER.START_EVALUATION);

  //START EVALUATION REDIRECT
  app.get(
    EVENT_MANAGEMENT_PATHS.START_EVALUATION_REDIRECT,
    AUTH,
    EVENT_MANAGEMENT_CONTROLLER.START_EVALUATION_REDIRECT
  );
  app.get(EVENT_MANAGEMENT_PATHS.CLOSE_PROJECT, [AUTH], EVENT_MANAGEMENT_CONTROLLER.CLOSE_PROJECT);
}
