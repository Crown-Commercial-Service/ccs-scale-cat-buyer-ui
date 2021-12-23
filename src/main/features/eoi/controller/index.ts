import { GET_TASKLIST } from './tasklist';
import { GET_TYPE, POST_TYPE } from './type';
import { GET_ONLINE_TASKLIST } from './onlinetasklist';
import { GET_QUESTIONS, POST_QUESTION } from './questions';
import { GET_RESPONSE_DATE, POST_ADD_RESPONSE_DATE, POST_RESPONSE_DATE } from './responseDate';
import { GET_UPLOAD_DOC, POST_UPLOAD_DOC, GET_REMOVE_FILES, POST_UPLOAD_PROCEED } from './upload';
import { GET_EVENT_PUBLISHED } from './eventpublished';
import { GET_NAME_PROJECT, POST_NAME_PROJECT } from './nameAProject';
import { GET_EOI_SUPPLIERS, POST_EOI_SUPPLIERS } from './suppliers';
import { GET_LEAD_PROCUREMENT, PUT_LEAD_PROCUREMENT, GET_USER_PROCUREMENT } from './leadProcurement';
import {
  GET_ADD_COLLABORATOR,
  POST_ADD_COLLABORATOR,
  POST_ADD_COLLABORATOR_TO_JAGGER,
  POST_PROCEED_COLLABORATORS,
  POST_ADD_COLLABORATOR_JSENABLED,
} from './addcollaborator';
import { OFFLINE_JOURNEY_PAGE } from './offline';
import { GET_EOI_REVIEW, POST_EOI_REVIEW } from './review';

export const associatedViews = {
  /**
   * @GET_VIEW
   */
  GET_ONLINE_TASKLIST,
  GET_TASKLIST,
  GET_TYPE,
  GET_QUESTIONS,
  GET_UPLOAD_DOC,
  GET_NAME_PROJECT,
  GET_LEAD_PROCUREMENT,
  GET_USER_PROCUREMENT,
  GET_ADD_COLLABORATOR,
  GET_REMOVE_FILES,
  OFFLINE_JOURNEY_PAGE,
  GET_EVENT_PUBLISHED,
  GET_RESPONSE_DATE,
  GET_EOI_REVIEW,
  GET_EOI_SUPPLIERS,
  /**
   * @POST_VIEW
   */
  POST_QUESTION,
  POST_TYPE,
  POST_NAME_PROJECT,
  POST_ADD_COLLABORATOR,
  POST_ADD_COLLABORATOR_TO_JAGGER,
  PUT_LEAD_PROCUREMENT,
  POST_PROCEED_COLLABORATORS,
  POST_ADD_COLLABORATOR_JSENABLED,
  POST_UPLOAD_DOC,
  POST_ADD_RESPONSE_DATE,
  POST_RESPONSE_DATE,
  POST_EOI_REVIEW,
  POST_UPLOAD_PROCEED,
  POST_EOI_SUPPLIERS,
};
