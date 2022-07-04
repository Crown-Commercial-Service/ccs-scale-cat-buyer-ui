import { Application } from 'express';
import { AUTH } from '../../common/middlewares/oauthservice/authstatecheck';
import { EVENT_MANAGEMENT_CONTROLLER } from './controller/index';
import { EVENT_MANAGEMENT_PATHS } from './model/eventManagementConstants';

export default function (app: Application): void {
  // This is the reciever callback after getting the token
  app.get(EVENT_MANAGEMENT_PATHS.EVENT_MANAGEMENT, [AUTH], EVENT_MANAGEMENT_CONTROLLER.EVENT_MANAGEMENT);

  app.get(EVENT_MANAGEMENT_PATHS.EVENT_MANAGEMENT_MESSAGING, [AUTH], EVENT_MANAGEMENT_CONTROLLER.EVENT_MANAGEMENT_MESSAGING);

  app.get(EVENT_MANAGEMENT_PATHS.EVENT_MANAGEMENT_MESSAGING_CREATE, [AUTH], EVENT_MANAGEMENT_CONTROLLER.EVENT_MANAGEMENT_MESSAGING_CREATE);

  app.get(EVENT_MANAGEMENT_PATHS.EVENT_MANAGEMENT_MESSAGING_SENT, [AUTH], EVENT_MANAGEMENT_CONTROLLER.EVENT_MANAGEMENT_MESSAGING_SENT);

  app.get(EVENT_MANAGEMENT_PATHS.EVENT_MANAGEMENT_QA, [AUTH], EVENT_MANAGEMENT_CONTROLLER.EVENT_MANAGEMENT_QA);

  app.get(EVENT_MANAGEMENT_PATHS.EVENT_MANAGEMENT_NEXT_STEP_GET, [AUTH], EVENT_MANAGEMENT_CONTROLLER.EVENT_MANAGEMENT_NEXT_STEP_GET);

  app.get(EVENT_MANAGEMENT_PATHS.EVENT_MANAGEMENT_MESSAGE_DETAILS_GET, [AUTH], EVENT_MANAGEMENT_CONTROLLER.EVENT_MANAGEMENT_MESSAGE_DETAILS_GET);

  app.get(EVENT_MANAGEMENT_PATHS.EVENT_MANAGEMENT_MESSAGE_REPLY, [AUTH], EVENT_MANAGEMENT_CONTROLLER.EVENT_MANAGEMENT_MESSAGE_REPLY);
 app.get(EVENT_MANAGEMENT_PATHS.EVENT_MANAGEMENT_DOWNLOAD,AUTH,EVENT_MANAGEMENT_CONTROLLER.EVENT_MANAGEMENT_DOWNLOAD);
  
  app.get(EVENT_MANAGEMENT_PATHS.STEPS_TO_CONTINUE, [AUTH], EVENT_MANAGEMENT_CONTROLLER.GET_STEPS_TO_CONTINUE);
  
  app.get(EVENT_MANAGEMENT_PATHS.PUBLISHED_PROJECT_DOWNLOAD, [AUTH], EVENT_MANAGEMENT_CONTROLLER.PUBLISHED_PROJECT_DOWNLOAD);
  app.get(EVENT_MANAGEMENT_PATHS.SUPPLIER_ANSWER_DOWNLOAD, [AUTH], EVENT_MANAGEMENT_CONTROLLER.SUPPLIER_ANSWER_DOWNLOAD);
  app.get(EVENT_MANAGEMENT_PATHS.SUPPLIER_ANSWER_DOWNLOAD_ALL, [AUTH], EVENT_MANAGEMENT_CONTROLLER.SUPPLIER_ANSWER_DOWNLOAD_ALL);
  app.get(EVENT_MANAGEMENT_PATHS.SUPPLIER_EVALUATION, [AUTH], EVENT_MANAGEMENT_CONTROLLER.SUPPLIER_EVALUATION);
  app.get(EVENT_MANAGEMENT_PATHS.GET_CONFIRM_SUPPLIER, [AUTH], EVENT_MANAGEMENT_CONTROLLER.GET_CONFIRM_SUPPLIER);
  app.post(EVENT_MANAGEMENT_PATHS.POST_CONFIRM_SUPPLIER, [AUTH], EVENT_MANAGEMENT_CONTROLLER.POST_CONFIRM_SUPPLIER);
  app.get(EVENT_MANAGEMENT_PATHS.GET_AWARD_SUPPLIER, [AUTH], EVENT_MANAGEMENT_CONTROLLER.GET_AWARD_SUPPLIER);
  app.post(EVENT_MANAGEMENT_PATHS.POST_AWARD_SUPPLIER, [AUTH], EVENT_MANAGEMENT_CONTROLLER.POST_AWARD_SUPPLIER);
  

 app.post(EVENT_MANAGEMENT_PATHS.STEPS_TO_CONTINUE, AUTH, EVENT_MANAGEMENT_CONTROLLER.POST_STEPS_TO_CONTINUE);
 
  app.post(
    EVENT_MANAGEMENT_PATHS.POST_EVENT_MANAGEMENT_MESSAGE_REPLY,
    AUTH,
    EVENT_MANAGEMENT_CONTROLLER.POST_EVENT_MANAGEMENT_MESSAGE_REPLY,
  );
  app.post(
    EVENT_MANAGEMENT_PATHS.POST_EVENT_MANAGEMENT_MESSAGE_DETAILS,
    AUTH,
    EVENT_MANAGEMENT_CONTROLLER.POST_EVENT_MANAGEMENT_MESSAGE_DETAILS,
  );

  app.post(
    EVENT_MANAGEMENT_PATHS.POST_MESSAGING_CREATE,
    AUTH,
    EVENT_MANAGEMENT_CONTROLLER.POST_MESSAGING_CREATE,
  );

  app.post(
    EVENT_MANAGEMENT_PATHS.POST_EVENT_MANAGEMENT_NEXT_STEP,
    AUTH,
    EVENT_MANAGEMENT_CONTROLLER.POST_EVENT_MANAGEMENT_NEXT_STEP,
  );

  //Q&A
  ///event/qa-add
  app.get(
    EVENT_MANAGEMENT_PATHS.EVENT_MANAGEMENT_QA_Add_GET,
    AUTH,
    EVENT_MANAGEMENT_CONTROLLER.EVENT_MANAGEMENT_GET_QA_ADD,
  );
  ///event/qa-add-2nd-step
  app.get(
    EVENT_MANAGEMENT_PATHS.EVENT_MANAGEMENT_GET_QA_ADD_TWO_STEP,
    AUTH,
    EVENT_MANAGEMENT_CONTROLLER.EVENT_MANAGEMENT_GET_QA_ADD_TWO_STEP,
  );
  ///event/qa-add
  app.post(
    EVENT_MANAGEMENT_PATHS.EVENT_MANAGEMENT_QA_Add_POST,
    AUTH,
    EVENT_MANAGEMENT_CONTROLLER.EVENT_MANAGEMENT_POST_QA_ADD,
  );

  
 ///event/qa-edit
  app.get(
    EVENT_MANAGEMENT_PATHS.EVENT_MANAGEMENT_QA_Edit_GET,
    AUTH,
    EVENT_MANAGEMENT_CONTROLLER.EVENT_MANAGEMENT_GET_QA_Edit,
  );
  ///event/qa-edit
  app.post(
    EVENT_MANAGEMENT_PATHS.EVENT_MANAGEMENT_QA_Edit_POST,
    AUTH,
    EVENT_MANAGEMENT_CONTROLLER.EVENT_MANAGEMENT_POST_QA_Edit,
  );
}