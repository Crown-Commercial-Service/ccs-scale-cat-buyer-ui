import { DA_GET_WHERE_WORK_DONE, DA_POST_WHERE_WORK_DONE } from './da-whereWorkDone';
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
import { RFP_GET_ADD_CONTEXT } from './rfp-addcontext';
import { GET_RFP_SUPPLIERS, POST_RFP_SUPPLIERS } from './rfp-suppliers';
import { RFP_GET_QUESTIONS, RFP_POST_QUESTION } from './rfp-questions';
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
import { GET_LEARN, POST_LEARN } from './learnAboutCapabilityAssessment';
import { CA_GET_WEIGHTINGS } from './ca-enterYourWeightings';
import { CA_GET_SUPPLIERS_FORWARD, CA_POST_SUPPLIERS_FORWARD } from './ca-suppliersToForward';
import { CA_GET_SUBCONTRACTORS, CA_POST_SUBCONTRACTORS } from './ca-SubContractors';
import { CA_GET_NEXTSTEPS, CA_POST_NEXTSTEPS } from './ca-nextSteps';
import { DA_GET_TEAM_SCALE, DA_POST_TEAM_SCALE } from './ca-teamScale';
import { RFP_GET_I35, RFP_POST_I35 } from './rfp-Ir35';
import { DA_REQUIREMENT_TYPE, DA_POST_TYPE } from './da-type';
import { DA_OFFLINE_JOURNEY_PAGE } from './da-offline';
import { DA_REQUIREMENT_TASK_LIST } from './da-taskList';
import { DA_GET_NEXTSTEPS, DA_POST_NEXTSTEPS } from './da-nextSteps';

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
  RFP_GET_ADD_CONTEXT,
  RFP_GET_QUESTIONS,
  RFP_POST_QUESTION,
  RFP_GET_I35,
  RFP_POST_I35,
  GET_RFP_SUPPLIERS,
  POST_RFP_SUPPLIERS,
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
  GET_LEARN,
  POST_LEARN,
  CA_GET_WEIGHTINGS,
  CA_GET_SUPPLIERS_FORWARD,
  CA_POST_SUPPLIERS_FORWARD,
  CA_GET_SUBCONTRACTORS,
  CA_POST_SUBCONTRACTORS,
  CA_GET_NEXTSTEPS,
  CA_POST_NEXTSTEPS,

  DA_GET_NEXTSTEPS,
  DA_POST_NEXTSTEPS,
  DA_GET_WHERE_WORK_DONE,
  DA_POST_WHERE_WORK_DONE,
  DA_REQUIREMENT_TYPE,
  DA_POST_TYPE,
  DA_OFFLINE_JOURNEY_PAGE,
  DA_REQUIREMENT_TASK_LIST,
  DA_GET_TEAM_SCALE,
  DA_POST_TEAM_SCALE,
};
