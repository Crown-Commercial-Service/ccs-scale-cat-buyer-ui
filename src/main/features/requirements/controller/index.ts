import { REQUIREMENT_CHOOSE_ROUTE, POST_REQUIREMENT_CHOOSE_ROUTE } from './choose-route';

import {
  RFP_GET_ADD_COLLABORATOR,
  RFP_POST_ADD_COLLABORATOR_JSENABLED,
  RFP_POST_ADD_COLLABORATOR,
  RFP_POST_ADD_COLLABORATOR_TO_JAGGER,
  RFP_POST_PROCEED_COLLABORATORS,
} from './rfp-addcollaborator';

import { RFP_REQUIREMENT_TYPE, RFP_POST_TYPE } from './rfp-type';
import { RFP_REQUIREMENT_TASK_LIST } from './rfp-taskList';
import { RFP_GET_LEAD_PROCUREMENT, RFP_PUT_LEAD_PROCUREMENT, RFP_GET_USER_PROCUREMENT } from './rfp-leadProcurement';
import { RFP_GET_NAME_PROJECT, RFP_POST_NAME_PROJECT } from './rfp-nameAProject';
import { RFP_OFFLINE_JOURNEY_PAGE } from './rfp-offline';
import { RFP_GET_UPLOAD_DOC, RFP_POST_UPLOAD_DOC, RFP_GET_REMOVE_FILES, RFP_POST_UPLOAD_PROCEED } from './rfp-upload';
import { RFP_GET_LEARN, RFP_POST_LEARN } from './rfp-learnAboutCapabilityAssessment';
import { RFP_GET_WEIGHTINGS } from './rfp-enterYourWeightings';

import {
  CA_GET_ADD_COLLABORATOR,
  CA_POST_ADD_COLLABORATOR_JSENABLED,
  CA_POST_ADD_COLLABORATOR,
  CA_POST_ADD_COLLABORATOR_TO_JAGGER,
  CA_POST_PROCEED_COLLABORATORS,
} from './ca-addcollaborator';

import { CA_REQUIREMENT_TYPE, CA_POST_TYPE } from './ca-type';
import { CA_REQUIREMENT_TASK_LIST } from './ca-taskList';
import { CA_GET_LEAD_PROCUREMENT, CA_PUT_LEAD_PROCUREMENT, CA_GET_USER_PROCUREMENT } from './ca-leadProcurement';
import { CA_GET_NAME_PROJECT, CA_POST_NAME_PROJECT } from './ca-nameAProject';
import { CA_OFFLINE_JOURNEY_PAGE } from './ca-offline';
import { CA_GET_UPLOAD_DOC, CA_POST_UPLOAD_DOC, CA_GET_REMOVE_FILES, CA_POST_UPLOAD_PROCEED } from './ca-upload';
import { CA_GET_LEARN, CA_POST_LEARN } from './ca-learnAboutCapabilityAssessment';
import { CA_GET_WEIGHTINGS } from './ca-enterYourWeightings';
import {RFP_GET_ADD_CONTEXT} from './rfp-addcontext'
import { RFP_GET_QUESTIONS, RFP_POST_QUESTION } from './rfp-questions';


import {RFP_GET_I35, RFP_POST_I35} from './rfp-Ir35'

/**
 * @BaseController
 * @Provider
 *
 * @description Provides as Base for all Controller
 */
export const REQUIREMENT_CONTROLLER = {
  REQUIREMENT_CHOOSE_ROUTE,
  POST_REQUIREMENT_CHOOSE_ROUTE,

  RFP_REQUIREMENT_TYPE,
  RFP_POST_TYPE,
  RFP_REQUIREMENT_TASK_LIST,
  RFP_GET_ADD_COLLABORATOR,
  RFP_POST_ADD_COLLABORATOR_JSENABLED,
  RFP_POST_ADD_COLLABORATOR,
  RFP_POST_ADD_COLLABORATOR_TO_JAGGER,
  RFP_POST_PROCEED_COLLABORATORS,
  RFP_GET_NAME_PROJECT,
  RFP_POST_NAME_PROJECT,
  RFP_GET_LEAD_PROCUREMENT,
  RFP_PUT_LEAD_PROCUREMENT,
  RFP_GET_USER_PROCUREMENT,
  RFP_OFFLINE_JOURNEY_PAGE,
  RFP_GET_UPLOAD_DOC,
  RFP_POST_UPLOAD_DOC,
  RFP_GET_REMOVE_FILES,
  RFP_POST_UPLOAD_PROCEED,
  RFP_GET_LEARN,
  RFP_POST_LEARN,
  RFP_GET_WEIGHTINGS,
  RFP_GET_ADD_CONTEXT,
  RFP_GET_QUESTIONS,
  RFP_POST_QUESTION,
  RFP_GET_I35,
  RFP_POST_I35,
//
  CA_REQUIREMENT_TYPE,
  CA_POST_TYPE,
  CA_REQUIREMENT_TASK_LIST,
  CA_GET_ADD_COLLABORATOR,
  CA_POST_ADD_COLLABORATOR_JSENABLED,
  CA_POST_ADD_COLLABORATOR,
  CA_POST_ADD_COLLABORATOR_TO_JAGGER,
  CA_POST_PROCEED_COLLABORATORS,
  CA_GET_NAME_PROJECT,
  CA_POST_NAME_PROJECT,
  CA_GET_LEAD_PROCUREMENT,
  CA_PUT_LEAD_PROCUREMENT,
  CA_GET_USER_PROCUREMENT,
  CA_OFFLINE_JOURNEY_PAGE,
  CA_GET_UPLOAD_DOC,
  CA_POST_UPLOAD_DOC,
  CA_GET_REMOVE_FILES,
  CA_POST_UPLOAD_PROCEED,
  CA_GET_LEARN,
  CA_POST_LEARN,
  CA_GET_WEIGHTINGS,
};
